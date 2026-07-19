#!/usr/bin/env node
/**
 * AUTHORING CHECK — not a build step, not read at deploy/validation time.
 *
 * A faster, stricter local mirror of the anchor-ledger checks in
 * scripts/validate.js, run during Phase 6 drafting so anchor problems are
 * caught at draft time rather than at the Phase 12 gate dozens of pages later.
 *
 * For every built page it:
 *   1. extracts in-body links (inside <article>/<main>, excluding nav/footer,
 *      excluding class="btn ..." structural CTAs, excluding #fragment and
 *      tel:/mailto:/https: links),
 *   2. confirms each (source, dest, anchor) triple exists as a row in
 *      anchor-ledger.md,
 *   3. confirms every ledger row whose source page is built has its anchor
 *      present in that page,
 *   4. confirms no anchor string is used twice anywhere (sitewide uniqueness),
 *   5. confirms no anchor contains characters that break literal matching
 *      (HTML entities, straight/again curly quotes, ampersands).
 *
 * Exit 0 = clean, 1 = problems (printed).
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE = path.join(ROOT, "site");
const LEDGER = path.join(ROOT, "ledgers", "anchor-ledger.md");

// Approved outbound-authority domains (phase-06-content-drafting.md). Every
// category/service page needs exactly one in-body link to one of these; the
// core nav pages are exempt. Kept in sync with the phase-06 list.
const APPROVED_OUTBOUND = new Set([
  "iaei.org", "nachi.org", "nate.org", "ahrinet.org", "phccweb.org",
  "iapmo.org", "angi.com", "nari.org", "epa.gov", "energy.gov",
  "energystar.gov", "cdc.gov", "fema.gov", "osha.gov", "consumerreports.org",
  "thisoldhouse.com", "familyhandyman.com", "nfpa.org", "ashrae.org",
  "nahb.org", "buildingscience.com", "hud.gov", "ftc.gov", "usa.gov",
  "nih.gov", "ncbi.nlm.nih.gov", "mayoclinic.org", "clevelandclinic.org",
  "webmd.com", "healthline.com", "bobvila.com", "hgtv.com", "bhg.com",
  "aia.org", "ul.com", "asme.org", "icc-es.org", "aceee.org",
  "sciencedirect.com", "bankrate.com", "nerdwallet.com", "investopedia.com",
  "forbes.com", "nytimes.com", "washingtonpost.com", "apnews.com",
  "reuters.com", "cornell.edu", "harvard.edu", "mit.edu", "stanford.edu",
  "berkeley.edu", "psu.edu", "umich.edu", "wikipedia.org",
]);
const OUTBOUND_EXEMPT = new Set(["/", "/services", "/about", "/contact"]);

// --- parse the ledger ------------------------------------------------------
const ledger = []; // {source, dest, anchor}
for (const line of fs.readFileSync(LEDGER, "utf8").split("\n")) {
  const m = line.match(/^\|\s*`([^`]+)`\s*\|\s*`([^`]+)`\s*\|\s*(.+?)\s*\|/);
  if (m) ledger.push({ source: m[1], dest: m[2], anchor: m[3].trim() });
}

const problems = [];

// --- sitewide anchor uniqueness -------------------------------------------
const seen = new Map();
for (const row of ledger) {
  if (seen.has(row.anchor)) {
    problems.push(`DUPLICATE anchor "${row.anchor}" (${seen.get(row.anchor)} and ${row.source})`);
  } else {
    seen.set(row.anchor, row.source);
  }
  if (/&[a-z]+;|['"’“”&]/i.test(row.anchor)) {
    problems.push(`UNSAFE char in anchor "${row.anchor}" (${row.source}) — will break literal matching`);
  }
}

// --- map a source url to its file -----------------------------------------
function fileFor(url) {
  const f = url === "/" ? path.join(SITE, "index.html")
                        : path.join(SITE, url.replace(/^\//, ""), "index.html");
  return fs.existsSync(f) ? f : null;
}

// --- extract in-body links from a page ------------------------------------
function bodyLinks(html) {
  const main = html.match(/<main id="main">([\s\S]*?)<\/main>/);
  if (!main) return [];
  // drop breadcrumbs nav
  const body = main[1].replace(/<nav class="breadcrumbs"[\s\S]*?<\/nav>/g, "");
  const out = [];
  const re = /<a\s+href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>/g;
  let m;
  while ((m = re.exec(body))) {
    const [, href, attrs, text] = m;
    if (/class="btn/.test(attrs)) continue;            // structural CTA
    if (/^(#|tel:|mailto:|https?:)/.test(href)) continue; // anchor/ext/contact
    out.push({ href, anchor: text.trim() });
  }
  return out;
}

// --- per-page checks -------------------------------------------------------
const builtSources = new Set();
for (const row of ledger) {
  const f = fileFor(row.source);
  if (f) builtSources.add(row.source);
}

for (const source of builtSources) {
  const f = fileFor(source);
  const html = fs.readFileSync(f, "utf8");

  // 2. every in-body link must be a ledger row (matching dest + anchor)
  for (const link of bodyLinks(html)) {
    const dest = "/" + link.href.replace(/^(\.\.?\/)/, "").replace(/\/$/, "");
    const destNorm = dest === "/" ? "/" : dest;
    const row = ledger.find(
      (r) => r.source === source && r.anchor === link.anchor
    );
    if (!row) {
      problems.push(`UNLEDGERED link on ${source}: "${link.anchor}" -> ${link.href}`);
    } else if (row.dest !== destNorm) {
      problems.push(`DEST MISMATCH on ${source}: "${link.anchor}" points at ${destNorm} but ledger says ${row.dest}`);
    }
  }

  // 3. every ledger row for this source must appear in the page body
  for (const row of ledger.filter((r) => r.source === source)) {
    if (!html.includes(">" + row.anchor + "</a>")) {
      problems.push(`MISSING in ${source}: ledger anchor "${row.anchor}" not found as a link`);
    }
  }

  // 4. category/service pages need >=1 in-body link to an approved domain
  if (!OUTBOUND_EXEMPT.has(source)) {
    const main = html.match(/<main id="main">([\s\S]*?)<\/main>/);
    const body = main ? main[1] : "";
    const hosts = [...body.matchAll(/href="https?:\/\/([^/"]+)/g)]
      .map((m) => m[1].replace(/^www\./, ""));
    if (!hosts.some((h) => APPROVED_OUTBOUND.has(h))) {
      problems.push(`NO APPROVED OUTBOUND link on ${source} (found: ${hosts.join(", ") || "none"})`);
    }
  }
}

if (problems.length) {
  console.error(`✗ ${problems.length} link problem(s):\n` + problems.map((p) => "  " + p).join("\n"));
  process.exit(1);
}
console.log(`✓ links clean — ${ledger.length} ledger rows, ${builtSources.size} built source pages checked`);
