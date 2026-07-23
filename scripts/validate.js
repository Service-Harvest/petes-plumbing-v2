#!/usr/bin/env node
/**
 * Phase 12 — Build Validation Gate
 *
 * Reusable across every client repo built from this template.
 * Run before every deploy: `node scripts/validate.js`
 * Also run automatically by .github/workflows/deploy.yml before publish.
 *
 * Checks (see /pipeline/phase-12-validation-gate.md for full spec):
 *  Technical/Layer 1: broken links, orphan pages (body-copy links only —
 *    nav/footer don't count), duplicate/missing titles, missing meta
 *    descriptions, missing/incorrect canonicals, missing alt text, missing
 *    width/height on images, schema present (hard fail) + well-formed,
 *    every sitemap.xml entry corresponds to a real page with a matching
 *    canonical.
 *  Content/SEO: duplicate anchor text sitewide (vs anchor-ledger.md), every
 *    anchor-ledger.md row present as an actual body-copy link, FAQ schema
 *    vs. visible FAQ section mismatch, missing outbound authority link on
 *    category/service pages (vs phase-06-content-drafting.md's approved
 *    domain list).
 *  Warnings (non-blocking): title/meta-description length outside general
 *    SEO guidance.
 *
 * Exits with code 1 (fail) or 0 (pass). Intended to block deploy on failure.
 */

const fs = require("fs");
const path = require("path");

const SITE_DIR = path.join(__dirname, "..", "site");
const ANCHOR_LEDGER = path.join(__dirname, "..", "ledgers", "anchor-ledger.md");
const PHASE_06 = path.join(__dirname, "..", "pipeline", "phase-06-content-drafting.md");
const CNAME_FILE = path.join(SITE_DIR, "CNAME");
const SITEMAP_FILE = path.join(SITE_DIR, "sitemap.xml");

// Pages reachable via the global nav by design, plus the flat 404 handler
// (which is deliberately never linked to) — exempt from the body-copy-link
// orphan/outbound-link requirements that apply to category/service pages.
const CORE_NAV_PAGES = new Set(["/", "/services", "/about", "/contact"]);
const LINKING_EXEMPT_PAGES = new Set([...CORE_NAV_PAGES, "/404.html"]);

let failures = [];
let warnings = [];

function fail(msg) {
  failures.push(msg);
}
function warn(msg) {
  warnings.push(msg);
}

function walkHtmlFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walkHtmlFiles(full));
    } else if (entry.name.endsWith(".html")) {
      results.push(full);
    }
  }
  return results;
}

function readFile(file) {
  return fs.readFileSync(file, "utf8");
}

// groupIndex lets callers pick which capture group holds the actual value —
// needed because an attribute-value regex that only captures inside a lazy
// ["'](.*?)["'] class will treat a straight apostrophe inside a
// double-quoted value (e.g. "what's") as the closing quote, silently
// truncating the match. Callers extracting a quoted attribute value should
// instead capture the quote character itself (group 1) and backreference it
// (\1) for the actual closing quote, then pass groupIndex: 2.
function extractTag(html, tagRegex, groupIndex = 1) {
  const m = html.match(tagRegex);
  return m ? m[groupIndex].trim() : null;
}

function extractAll(html, regex) {
  const matches = [];
  let m;
  const re = new RegExp(regex, "gi");
  while ((m = re.exec(html)) !== null) {
    matches.push(m);
  }
  return matches;
}

function relUrl(file) {
  return "/" + path.relative(SITE_DIR, file).replace(/index\.html$/, "").replace(/\\/g, "/");
}

function normalizeUrl(u) {
  return u.split("#")[0].split("?")[0].replace(/\/$/, "") || "/";
}

// Resolves an href/src found on a given page to a normalized, site-relative
// absolute path (e.g. "/services"), regardless of whether that href was
// written root-absolute ("/services"), dot-relative ("./x", "../x"), or bare
// relative ("services/") — the site's convention (see phase-04 Task 2) uses
// relative paths so the build works both under a real custom domain's root
// and under a GitHub Pages project-subpath fallback URL, so this validator
// has to resolve them the same way a browser would rather than assume any
// one style. Returns null for non-path hrefs (external, tel:, mailto:, bare
// same-page anchors).
function resolveHref(pageUrl, href) {
  if (/^https?:\/\//i.test(href) || /^(tel|mailto):/i.test(href) || href.startsWith("#")) {
    return null;
  }
  if (href.startsWith("/")) return normalizeUrl(href);
  const baseDir = pageUrl === "/" ? "/" : pageUrl.replace(/\/$/, "") + "/";
  try {
    const resolved = new URL(href, "http://site.invalid" + baseDir);
    return normalizeUrl(resolved.pathname);
  } catch (e) {
    return null;
  }
}

// Strip <nav>...</nav> and <footer>...</footer> blocks so link checks that
// are supposed to be "body copy only" don't get satisfied by a nav/footer
// link (Phase 4 Task 9 requires literal <nav>/<footer> elements specifically
// so this is reliable).
function stripNavAndFooter(html) {
  return html
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, "");
}

function extractAnchors(html) {
  const anchorTags = extractAll(html, '<a\\s+[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>');
  return anchorTags.map((a) => ({
    href: a[1],
    text: a[2].replace(/<[^>]+>/g, "").trim(),
    // Whether this is a styled CTA/action button (class="btn ...") rather than
    // an in-body contextual link. CTA buttons intentionally repeat the same
    // label sitewide (e.g. "Request a Free Estimate") as a UI/UX convention —
    // they are not "anchor text" in the SEO/golden-rules sense, so they're
    // exempt from the anchor-uniqueness check the same way nav/footer are.
    isCtaButton: /class=["'][^"']*\bbtn\b/.test(a[0]),
  }));
}

// Recursively collect every "@type" value in a parsed JSON-LD object,
// following @graph and any nested object (mainEntity, provider, etc.).
function extractSchemaTypes(data) {
  const types = new Set();
  function walk(node) {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (node && typeof node === "object") {
      if (node["@type"]) {
        if (Array.isArray(node["@type"])) node["@type"].forEach((t) => types.add(t));
        else types.add(node["@type"]);
      }
      for (const key of Object.keys(node)) walk(node[key]);
    }
  }
  walk(data);
  return types;
}

function getSiteDomain() {
  if (!fs.existsSync(CNAME_FILE)) return null;
  const domain = readFile(CNAME_FILE).trim();
  return domain || null;
}

function parseMarkdownTable(text) {
  const rows = [];
  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line.startsWith("|")) continue;
    if (/^\|[\s:-]+\|/.test(line)) continue; // separator row
    // Strip markdown code-span backticks (e.g. `/some-path`) in addition to
    // whitespace — ledger paths are written as inline code for readability,
    // and leaving the backticks in would make every downstream URL lookup
    // silently fail to match a real page.
    const cells = line.split("|").slice(1, -1).map((c) => c.trim().replace(/^`(.*)`$/, "$1"));
    if (cells.length >= 3) rows.push(cells);
  }
  return rows;
}

function loadAnchorLedgerRows() {
  if (!fs.existsSync(ANCHOR_LEDGER)) return null;
  const rows = parseMarkdownTable(readFile(ANCHOR_LEDGER));
  return rows
    .filter((cells) => cells[0] && cells[0].toLowerCase() !== "source page")
    .map((cells) => ({ source: cells[0], destination: cells[1], anchorText: cells[2] }))
    .filter((r) => r.source && r.destination && r.anchorText);
}

function loadApprovedDomains() {
  if (!fs.existsSync(PHASE_06)) return null;
  const text = readFile(PHASE_06);
  const sectionMatch = text.match(/## Approved outbound source domains([\s\S]*?)\n## /);
  const section = sectionMatch ? sectionMatch[1] : text;
  const matches = section.match(/\b[a-z0-9-]+\.(?:gov|org|com|edu|net)(?:\/[a-z0-9-]+)?\b/gi) || [];
  return [...new Set(matches.map((m) => m.toLowerCase()))];
}

function hrefMatchesApprovedDomain(href, approvedDomains) {
  let url;
  try {
    url = new URL(href);
  } catch (e) {
    return false;
  }
  const host = url.hostname.toLowerCase();
  const pathname = url.pathname.toLowerCase();
  for (const entry of approvedDomains) {
    const [entryHost, entryPath] = entry.split("/");
    const hostMatches = host === entryHost || host.endsWith("." + entryHost);
    if (!hostMatches) continue;
    if (!entryPath || pathname.startsWith("/" + entryPath)) return true;
  }
  return false;
}

function loadSitemapUrls() {
  if (!fs.existsSync(SITEMAP_FILE)) return null;
  const text = readFile(SITEMAP_FILE);
  const locs = extractAll(text, "<loc>(.*?)</loc>").map((m) => m[1].trim());
  return locs;
}

// ---------------------------------------------------------------------
// Load site files
// ---------------------------------------------------------------------
const files = walkHtmlFiles(SITE_DIR);
if (files.length === 0) {
  fail(`No HTML files found under ${SITE_DIR}. Has Phase 4/6 run yet?`);
}

const domain = getSiteDomain();
if (!domain) {
  warn(`No /site/CNAME found — skipping canonical-tag domain correctness check (only checking presence).`);
}

const titles = new Map(); // title -> [files]
const metaDescriptions = new Map();
const bodyLinkedTo = new Set(); // hrefs seen in body copy anywhere (nav/footer excluded)
const allInternalHrefs = []; // { from, href } — every internal link, any location
const anchorTextSeen = new Map(); // anchorText -> [ {from, href} ] — body copy only
const schemaTypesByUrl = new Map(); // url -> Set<string>
const faqSectionByUrl = new Map(); // url -> boolean
const bodyAnchorsByUrl = new Map(); // url -> [{href, text}] — body copy only
const outboundAnchorsByUrl = new Map(); // url -> [{href, text}] — external links, any location
const canonicalByUrl = new Map(); // url -> raw canonical href string, for the sitemap cross-check below

for (const file of files) {
  const html = readFile(file);
  const url = relUrl(file);

  // The 404 handler is a required utility page (Phase 4 Task 10), not an
  // indexable content page — it's intentionally exempt from every SEO/
  // schema/content check below (no canonical, no schema, etc. expected).
  if (url === "/404.html") continue;

  const bodyHtml = stripNavAndFooter(html);

  // --- Title tag ---
  const title = extractTag(html, /<title>(.*?)<\/title>/i);
  if (!title) {
    fail(`Missing <title> tag: ${url}`);
  } else {
    if (!titles.has(title)) titles.set(title, []);
    titles.get(title).push(url);
    if (title.length < 50 || title.length > 60) {
      warn(`Title tag length ${title.length} chars (guidance: ~50–60) on ${url}: "${title}"`);
    }
  }

  // --- Meta description ---
  const metaDesc = extractTag(
    html,
    /<meta\s+name=["']description["']\s+content=(["'])(.*?)\1/i,
    2
  );
  if (!metaDesc) {
    fail(`Missing meta description: ${url}`);
  } else {
    if (!metaDescriptions.has(metaDesc)) metaDescriptions.set(metaDesc, []);
    metaDescriptions.get(metaDesc).push(url);
    if (metaDesc.length < 150 || metaDesc.length > 160) {
      warn(`Meta description length ${metaDesc.length} chars (guidance: ~150–160) on ${url}`);
    }
  }

  // --- Canonical tag ---
  const canonical = extractTag(
    html,
    /<link\s+rel=["']canonical["']\s+href=(["'])(.*?)\1/i,
    2
  );
  if (!canonical) {
    fail(`Missing canonical tag: ${url}`);
  } else {
    canonicalByUrl.set(url, canonical);
    if (domain) {
      const expected = `https://${domain}${url}`;
      if (normalizeUrl(canonical) !== normalizeUrl(expected)) {
        fail(`Incorrect canonical tag on ${url}: found "${canonical}", expected "${expected}"`);
      }
    }
  }

  // --- Favicon set (Phase 4a Task 2: SVG icon, 32x32 + 16x16 PNG fallback,
  // 180x180 apple-touch-icon, manifest — every size/format, every page,
  // and every referenced file must actually exist on disk) ---
  const REQUIRED_FAVICON_LINKS = [
    { rel: /rel="icon"\s+type="image\/svg\+xml"/, label: "SVG icon" },
    { rel: /rel="icon"\s+type="image\/png"\s+sizes="32x32"/, label: "32x32 PNG icon" },
    { rel: /rel="icon"\s+type="image\/png"\s+sizes="16x16"/, label: "16x16 PNG icon" },
    { rel: /rel="apple-touch-icon"\s+sizes="180x180"/, label: "180x180 apple-touch-icon" },
    { rel: /rel="manifest"/, label: "web app manifest" },
  ];
  for (const { rel, label } of REQUIRED_FAVICON_LINKS) {
    const linkMatch = html.match(new RegExp(`<link\\s+[^>]*${rel.source}[^>]*>`, "i"));
    if (!linkMatch) {
      fail(`Missing ${label} <link> tag: ${url}`);
      continue;
    }
    const hrefMatch = linkMatch[0].match(/href=(["'])(.*?)\1/i);
    if (!hrefMatch) {
      fail(`${label} <link> tag has no href: ${url}`);
      continue;
    }
    const resolvedPath = path.join(path.dirname(file), hrefMatch[2]);
    if (!fs.existsSync(resolvedPath)) {
      fail(`${label} on ${url} references "${hrefMatch[2]}", which doesn't exist on disk`);
    }
  }

  // --- H1 count (exactly one) ---
  const h1s = extractAll(html, "<h1[^>]*>");
  if (h1s.length === 0) fail(`No H1 found: ${url}`);
  if (h1s.length > 1) fail(`Multiple H1s (${h1s.length}) found: ${url}`);

  // --- Images: alt text + width/height ---
  const imgTags = extractAll(html, "<img[^>]*>");
  for (const imgMatch of imgTags) {
    const imgTag = imgMatch[0];
    if (!/alt=["'][^"']+["']/i.test(imgTag)) {
      fail(`Image missing alt text in ${url}: ${imgTag.slice(0, 80)}...`);
    }
    if (!/width=["']?\d+["']?/i.test(imgTag) || !/height=["']?\d+["']?/i.test(imgTag)) {
      fail(`Image missing explicit width/height in ${url}: ${imgTag.slice(0, 80)}...`);
    }
  }

  // --- JSON-LD schema present (hard fail) + well-formed + type collection ---
  const schemaBlocks = extractAll(
    html,
    '<script[^>]*type=["\']application/ld\\+json["\'][^>]*>([\\s\\S]*?)</script>'
  );
  const types = new Set();
  if (schemaBlocks.length === 0) {
    fail(`No JSON-LD schema found on: ${url}`);
  } else {
    for (const block of schemaBlocks) {
      try {
        const data = JSON.parse(block[1]);
        extractSchemaTypes(data).forEach((t) => types.add(t));
      } catch (e) {
        fail(`Invalid JSON-LD schema on ${url}: ${e.message}`);
      }
    }
  }
  schemaTypesByUrl.set(url, types);

  // --- FAQ section marker (Phase 6 convention: <section id="faq">) ---
  faqSectionByUrl.set(url, /<section[^>]*\bid=["']faq["']/i.test(html));

  // --- H2 section count + FAQ count consistency (Phase 6's "5 main H2
  // sections" and "5-6 FAQs" structure, category/service pages only) ---
  if (!LINKING_EXEMPT_PAGES.has(normalizeUrl(url))) {
    // Exclude the table-of-contents heading (some pages label it with an
    // <h2>, others with a <p><strong>) and the FAQ section's own <h2> —
    // neither counts as one of the "5 main H2 sections."
    const withoutToc = html.replace(/<nav[^>]*\bclass=["'][^"']*\btoc\b[^"']*["'][^>]*>[\s\S]*?<\/nav>/i, "");
    const withoutFaqSection = withoutToc.replace(/<section[^>]*\bid=["']faq["'][^>]*>[\s\S]*?<\/section>/i, "");
    const mainH2Count = extractAll(withoutFaqSection, "<h2[^>]*>").length;
    if (mainH2Count !== 5) {
      fail(`Expected exactly 5 main H2 sections (Phase 6's required page structure), found ${mainH2Count}: ${url}`);
    }

    const faqItemCount = extractAll(html, '<div[^>]*\\bclass=["\']faq-item["\'][^>]*>').length;
    if (faqItemCount < 5 || faqItemCount > 6) {
      fail(`Expected 5-6 FAQs (Phase 6's FAQ cap), found ${faqItemCount}: ${url}`);
    }
  }

  // --- Duplicated word across an anchor boundary (e.g. "The <a>the EPA's
  // guidance...</a>") — a recurring authoring artifact from splicing a
  // lead-in sentence with anchor text that already starts with the same
  // word (an article, "guidance", etc.), producing a doubled-word typo
  // right at the link boundary. Case-insensitive; only flags a real
  // adjacent duplicate, not legitimate doubled words elsewhere in prose. ---
  const anchorBoundaryMatches = extractAll(
    bodyHtml,
    "([A-Za-z']+)[\\s]*<a\\s+[^>]*href=[\"']([^\"']+)[\"'][^>]*>\\s*([A-Za-z']+)"
  );
  for (const m of anchorBoundaryMatches) {
    const before = m[1].toLowerCase();
    const firstAnchorWord = m[3].toLowerCase();
    if (before === firstAnchorWord) {
      fail(`Duplicated word "${m[1]} ${m[3]}" split across a link boundary on ${url} (e.g. "The <a>the EPA's...</a>") — reword so the lead-in text and the anchor text don't repeat the same word.`);
    }
  }

  // --- Body-copy anchors (for orphan / required-link / duplicate-anchor checks) ---
  const bodyAnchors = extractAnchors(bodyHtml);
  // Keyed by normalized URL (no trailing slash) so lookups from ledger rows
  // like "/some-page" reliably match directory-style page URLs like
  // "/some-page/" that relUrl() produces.
  bodyAnchorsByUrl.set(normalizeUrl(url), bodyAnchors);
  for (const { href, text, isCtaButton } of bodyAnchors) {
    const resolved = resolveHref(url, href);
    if (resolved) {
      bodyLinkedTo.add(resolved);
      if (!isCtaButton && text && text.split(" ").length > 1) {
        if (!anchorTextSeen.has(text)) anchorTextSeen.set(text, []);
        anchorTextSeen.get(text).push({ from: url, href });
      }
    }
  }

  // --- All anchors, any location (for broken-link + outbound-link checks) ---
  const allAnchors = extractAnchors(html);
  const outbound = [];
  for (const { href, text } of allAnchors) {
    if (resolveHref(url, href) !== null) {
      allInternalHrefs.push({ from: url, href });
    } else if (/^https?:\/\//i.test(href)) {
      outbound.push({ href, text });
    }
  }
  outboundAnchorsByUrl.set(url, outbound);
}

// ---------------------------------------------------------------------
// Duplicate title / meta description checks
// ---------------------------------------------------------------------
for (const [title, urls] of titles.entries()) {
  if (urls.length > 1) {
    fail(`Duplicate title tag "${title}" used on: ${urls.join(", ")}`);
  }
}
for (const [desc, urls] of metaDescriptions.entries()) {
  if (urls.length > 1) {
    fail(`Duplicate meta description used on: ${urls.join(", ")}`);
  }
}

// ---------------------------------------------------------------------
// Orphan page check — body-copy links only; nav/footer don't count.
// Core nav pages (home/services/about/contact) are exempt.
// ---------------------------------------------------------------------
const allUrls = files.map(relUrl);
for (const url of allUrls) {
  if (LINKING_EXEMPT_PAGES.has(normalizeUrl(url))) continue;
  if (!bodyLinkedTo.has(normalizeUrl(url))) {
    fail(`Orphan page — no body-copy internal links point to it (nav/footer links don't count): ${url}`);
  }
}

// ---------------------------------------------------------------------
// Services-hub coverage check — every category/service page must have at
// least one in-body link specifically FROM the Services hub page, not just
// be reachable from somewhere sitewide (the orphan check above only
// requires *some* incoming body link, which a sibling cross-link already
// satisfies even if the hub itself never mentions the page). See
// phase-06-content-drafting.md's Services hub section.
// ---------------------------------------------------------------------
const hubAnchors = bodyAnchorsByUrl.get("/services") || [];
const hubLinkedTo = new Set();
for (const { href } of hubAnchors) {
  const resolved = resolveHref("/services", href);
  if (resolved) hubLinkedTo.add(resolved);
}
for (const url of allUrls) {
  if (LINKING_EXEMPT_PAGES.has(normalizeUrl(url))) continue;
  if (!hubLinkedTo.has(normalizeUrl(url))) {
    fail(`Services hub coverage — no in-body link from /services to ${url} (every category/service page needs a direct hub link, per phase-06-content-drafting.md's Services hub section — sitewide reachability from another page doesn't satisfy this).`);
  }
}

// ---------------------------------------------------------------------
// Broken internal link check (any location — nav/footer links matter too)
// ---------------------------------------------------------------------
const urlSet = new Set(allUrls.map(normalizeUrl));
for (const { from, href } of allInternalHrefs) {
  const cleanHref = resolveHref(from, href);
  if (cleanHref && !urlSet.has(cleanHref)) {
    fail(`Broken internal link on ${from}: href="${href}"`);
  }
}

// ---------------------------------------------------------------------
// Duplicate anchor text check (sitewide, body-copy only, vs the ledger)
// ---------------------------------------------------------------------
for (const [anchorText, uses] of anchorTextSeen.entries()) {
  if (uses.length > 1) {
    const locations = uses.map((u) => `${u.from} -> ${u.href}`).join(" | ");
    fail(`Duplicate anchor text "${anchorText}" used more than once: ${locations}`);
  }
}

const anchorLedgerRows = loadAnchorLedgerRows();
if (anchorLedgerRows === null) {
  warn(`No anchor-ledger.md found at ${ANCHOR_LEDGER} — cannot cross-check anchors or required contextual links against the permanent ledger.`);
} else {
  // Ledger-internal duplicate check: compare exact anchorText column values
  // from the parsed table, not a raw substring search — a substring search
  // false-positives whenever one legitimate anchor happens to contain another
  // shorter legitimate anchor as a prefix/substring (e.g. "everything else we
  // handle" vs. "everything else we handle for Armonk plumbing").
  const anchorTextCounts = new Map();
  for (const { anchorText } of anchorLedgerRows) {
    anchorTextCounts.set(anchorText, (anchorTextCounts.get(anchorText) || 0) + 1);
  }
  for (const [anchorText, count] of anchorTextCounts.entries()) {
    if (count > 1) {
      fail(`Anchor text "${anchorText}" appears more than once in anchor-ledger.md — ledger is out of sync or anchor was reused.`);
    }
  }

  // Every planned link in the ledger must actually exist in that source
  // page's body copy, with matching href and anchor text.
  for (const { source, destination, anchorText } of anchorLedgerRows) {
    const sourceAnchors = bodyAnchorsByUrl.get(normalizeUrl(source));
    if (!sourceAnchors) {
      warn(`anchor-ledger.md references source page "${source}", which doesn't exist in /site/ — skipping this row.`);
      continue;
    }
    const found = sourceAnchors.some(
      (a) => resolveHref(source, a.href) === normalizeUrl(destination) && a.text.trim() === anchorText.trim()
    );
    if (!found) {
      fail(
        `anchor-ledger.md requires a body-copy link from ${source} to ${destination} with anchor text "${anchorText}", but it wasn't found (missing entirely, or only present in nav/footer)`
      );
    }
  }
}

// ---------------------------------------------------------------------
// FAQ schema vs. visible FAQ section mismatch
// ---------------------------------------------------------------------
for (const url of allUrls) {
  const hasFaqSchema = (schemaTypesByUrl.get(url) || new Set()).has("FAQPage");
  const hasFaqSection = faqSectionByUrl.get(url);
  if (hasFaqSchema && !hasFaqSection) {
    fail(`FAQPage schema present on ${url} but no visible <section id="faq"> found on the page`);
  }
  if (hasFaqSection && !hasFaqSchema) {
    fail(`Visible <section id="faq"> found on ${url} but no matching FAQPage schema present`);
  }
}

// ---------------------------------------------------------------------
// Outbound authority link check (category/service pages only)
// ---------------------------------------------------------------------
const approvedDomains = loadApprovedDomains();
if (approvedDomains === null) {
  warn(`Could not read ${PHASE_06} — skipping outbound authority link check.`);
} else {
  for (const url of allUrls) {
    if (LINKING_EXEMPT_PAGES.has(normalizeUrl(url))) continue;
    const outbound = outboundAnchorsByUrl.get(url) || [];
    const hasApproved = outbound.some((a) => hrefMatchesApprovedDomain(a.href, approvedDomains));
    if (!hasApproved) {
      fail(`No outbound link to an approved authority domain found on ${url} (see phase-06-content-drafting.md's approved list)`);
    }
  }
}

// ---------------------------------------------------------------------
// Sitemap check — every sitemap URL is a real page with a matching canonical
// ---------------------------------------------------------------------
const sitemapUrls = loadSitemapUrls();
if (sitemapUrls === null) {
  warn(`No sitemap.xml found at ${SITEMAP_FILE} — skipping sitemap checks.`);
} else if (!domain) {
  warn(`Skipping sitemap URL/canonical cross-check — no /site/CNAME to determine the expected domain.`);
} else {
  for (const loc of sitemapUrls) {
    let locUrl;
    try {
      locUrl = new URL(loc);
    } catch (e) {
      fail(`sitemap.xml contains an unparseable URL: "${loc}"`);
      continue;
    }
    if (locUrl.hostname !== domain) {
      fail(`sitemap.xml URL uses the wrong domain: "${loc}" (expected ${domain})`);
      continue;
    }
    const path_ = normalizeUrl(locUrl.pathname);
    if (!urlSet.has(path_)) {
      fail(`sitemap.xml references "${loc}", which has no corresponding file in /site/`);
      continue;
    }
    // Exact-string cross-check (not just normalized-equal) — sitemap.xml and
    // every canonical tag must agree on trailing-slash convention, not just
    // point at the same normalized page. See phase-11-sitemap-technical.md.
    const pageUrl = allUrls.find((u) => normalizeUrl(u) === path_);
    const canonical = pageUrl != null ? canonicalByUrl.get(pageUrl) : null;
    if (canonical && canonical !== loc) {
      fail(`sitemap.xml entry "${loc}" doesn't exactly match its page's canonical tag "${canonical}" (trailing-slash or other mismatch — these must be byte-identical, not just resolve to the same normalized page)`);
    }
  }
  // Every real page (except the custom 404) should be represented in the sitemap.
  const sitemapPaths = new Set(
    sitemapUrls
      .map((loc) => {
        try {
          return normalizeUrl(new URL(loc).pathname);
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean)
  );
  for (const url of allUrls) {
    if (url === "/404.html") continue; // flat 404 handler, not a sitemap entry
    if (!sitemapPaths.has(normalizeUrl(url))) {
      warn(`Page ${url} exists in /site/ but isn't listed in sitemap.xml`);
    }
  }
}

// ---------------------------------------------------------------------
// Button/CTA colour contrast (WCAG AA) — hard fail
// ---------------------------------------------------------------------
// Recurring bug class: a button's text colour ends up matching (or too close
// to) its own background at REST — e.g. a blanket `.section-deep a { color:#fff }`
// out-specifies `.btn-secondary`'s brand text colour and renders a white button
// white-on-white until hover. This backstop computes the resting-state contrast
// ratio of each button variant against its background — including the colour it
// would actually inherit inside the dark `.section-deep` band — and hard-fails
// below WCAG AA (4.5:1 normal text, 3:1 for large text / buttons).
(function checkButtonContrast() {
  const cssPath = path.join(SITE_DIR, "assets", "css", "main.css");
  if (!fs.existsSync(cssPath)) {
    warn("main.css not found — skipping button contrast check.");
    return;
  }
  const css = readFile(cssPath);

  // Resolve :root custom properties to hex.
  const vars = {};
  const rootMatch = css.match(/:root\s*\{([\s\S]*?)\}/);
  if (rootMatch) {
    for (const m of rootMatch[1].matchAll(/(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{3,6})\s*;/g)) {
      vars[m[1]] = m[2];
    }
  }
  const resolve = (v) => {
    if (!v) return null;
    v = v.trim();
    const varRef = v.match(/^var\((--[\w-]+)\)$/);
    if (varRef) return vars[varRef[1]] || null;
    return /^#[0-9a-fA-F]{3,6}$/.test(v) ? v : null;
  };
  // Pull `color` and `background`/`background-color` from a selector's block.
  const ruleColors = (selectorRegex) => {
    const re = new RegExp(selectorRegex + "\\s*\\{([^}]*)\\}");
    const m = css.match(re);
    if (!m) return null;
    const body = m[1];
    const color = (body.match(/(?:^|;|\{)\s*color\s*:\s*([^;]+)/) || [])[1];
    const bg = (body.match(/background(?:-color)?\s*:\s*([^;]+)/) || [])[1];
    return { color: resolve(color), bg: resolve(bg) };
  };

  const hexToRgb = (h) => {
    h = h.replace("#", "");
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  };
  const relLum = (hex) => {
    const [r, g, b] = hexToRgb(hex).map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a, b) => {
    const la = relLum(a), lb = relLum(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  };

  const primary = ruleColors("\\.btn-primary");
  const secondary = ruleColors("\\.btn-secondary");
  if (!primary || !secondary || !primary.color || !primary.bg || !secondary.color || !secondary.bg) {
    warn("Could not parse .btn-primary/.btn-secondary colours from main.css — button contrast check skipped.");
    return;
  }

  // Resting pairings to verify. Buttons are large/bold → 3:1 AA threshold.
  const pairings = [
    { label: ".btn-primary", text: primary.color, bg: primary.bg },
    { label: ".btn-secondary", text: secondary.color, bg: secondary.bg },
  ];

  // Does a `.section-deep a` colour rule override buttons on the dark band?
  // If the selector lacks `:not(.btn)`, buttons inherit that colour at rest.
  const deepAnchor = css.match(/\.section-deep\s+a(:not\(\.btn\))?\s*\{([^}]*)\}/);
  if (deepAnchor) {
    const excludesBtn = !!deepAnchor[1];
    const deepColor = resolve((deepAnchor[2].match(/color\s*:\s*([^;]+)/) || [])[1]);
    if (!excludesBtn && deepColor) {
      pairings.push({ label: ".btn-primary inside .section-deep", text: deepColor, bg: primary.bg });
      pairings.push({ label: ".btn-secondary inside .section-deep", text: deepColor, bg: secondary.bg });
    }
  }

  const MIN = 3.0; // WCAG AA for large text / buttons
  for (const p of pairings) {
    if (!p.text || !p.bg) continue;
    const ratio = contrast(p.text, p.bg);
    if (ratio < MIN) {
      fail(
        `Button contrast too low (WCAG AA): ${p.label} has ${p.text} text on ${p.bg} background = ${ratio.toFixed(2)}:1 (need >= ${MIN}:1 at rest). Legible only on hover is not enough.`
      );
    }
  }
})();

// ---------------------------------------------------------------------
// Section background alternation + hero-image framing — hard fail
// ---------------------------------------------------------------------
// Two design-regression backstops:
//  (1) No two ADJACENT full-bleed bands in <main> may share the same background
//      (plain vs. section-alt vs. section-deep). Doubled same-colour padding
//      reads as a random dead gap — this was the actual root cause of the
//      "excessive spacing" bug, introduced when a section-insertion skipped the
//      alternation check.
//  (2) Every hero LCP image (`fetchpriority="high"`) must sit inside a
//      `.hero-media` band, so the defined image-framing style is actually
//      applied — an "unused defined style" can't silently happen again.
for (const file of walkHtmlFiles(SITE_DIR)) {
  const url = relUrl(file);
  if (url === "/404.html") continue;
  const html = readFile(file);
  const mainMatch = html.match(/<main id="main">([\s\S]*?)<\/main>/);
  if (!mainMatch) continue;
  const main = mainMatch[1];

  // (1) adjacency
  const seq = [];
  for (const m of main.matchAll(/<(?:section|nav)\s+class="([^"]*)"/g)) {
    const cls = m[1];
    const toks = cls.split(/\s+/);
    let bg;
    if (toks.includes("section-deep")) bg = "deep";
    else if (cls === "hero") bg = "hero";
    else if (toks.includes("section") || toks.includes("hero")) bg = toks.includes("section-alt") ? "alt" : "plain";
    else continue; // not a full-bleed band
    seq.push(bg);
  }
  for (let i = 0; i < seq.length - 1; i++) {
    if (seq[i] === seq[i + 1]) {
      fail(`Two adjacent full-bleed sections share the same "${seq[i]}" background on ${url} (position ${i}) — backgrounds must alternate so the doubled section padding doesn't read as a dead gap.`);
    }
  }

  // (2) hero-image framing
  for (const img of main.matchAll(/<img\b[^>]*fetchpriority="high"[^>]*>/g)) {
    // the enclosing band must carry the hero-media framing class
    const before = main.slice(0, img.index);
    const lastSection = before.lastIndexOf("<section");
    const sectionOpen = before.slice(lastSection).match(/<section\s+class="([^"]*)"/);
    if (!sectionOpen || !sectionOpen[1].split(/\s+/).includes("hero-media")) {
      fail(`Hero LCP image on ${url} is not inside a .hero-media band — its defined framing (radius/shadow) would render as a flat rectangle.`);
    }
  }
}

// ---------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------
console.log("\n=== BUILD VALIDATION REPORT ===\n");

if (warnings.length) {
  console.log(`⚠️  ${warnings.length} warning(s):`);
  warnings.forEach((w) => console.log(`   - ${w}`));
  console.log("");
}

if (failures.length) {
  console.log(`❌ ${failures.length} failure(s) — DEPLOY BLOCKED:`);
  failures.forEach((f) => console.log(`   - ${f}`));
  console.log("");
  process.exit(1);
} else {
  console.log("✅ All checks passed. Safe to proceed to Phase 13 (deploy).\n");
  process.exit(0);
}
