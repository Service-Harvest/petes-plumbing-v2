#!/usr/bin/env node
/**
 * AUTHORING HELPER — not a build step, and not a runtime dependency.
 *
 * Phase 4 requires /site/ to contain final, plain static HTML with no build
 * step. It still does: this script is run once per page at authoring time and
 * its OUTPUT is committed. Nothing reads it at request time, at deploy time,
 * or in scripts/validate.js. Delete it and the site is unaffected.
 *
 * Why it exists: Phase 6 requires the shared header/nav/footer to be copied
 * verbatim from /snippets/ into all ~46 pages. Hand-copying ~90 lines of
 * boilerplate 46 times is where sitewide nav/footer drift comes from. This
 * does that copy mechanically, from the canonical /snippets/ files, so the
 * Phase 4 Task 1 rule ("update /snippets/ first, then re-propagate") is
 * actually enforceable.
 *
 * Usage:  node scripts/assemble.js [slug ...]     (omit slugs to build all)
 * Input:  /fragments/<slug>.html   — JSON front-matter between --- markers,
 *                                    then the page's <article> content.
 *         Homepage fragment slug is "index".
 * Output: /site/<slug>/index.html  (or /site/index.html for "index")
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const FRAGMENTS = path.join(ROOT, "fragments");
const SITE = path.join(ROOT, "site");
const SNIPPETS = path.join(ROOT, "snippets");
const DOMAIN = "https://hexorasystems.com";

function stripComments(html) {
  return html.replace(/<!--[\s\S]*?-->\s*/g, "");
}

// Pull the canonical header/footer out of /snippets/, minus their authoring
// comments. These are the single source of truth for sitewide markup.
const headerSrc = stripComments(
  fs.readFileSync(path.join(SNIPPETS, "header-nav.html"), "utf8")
).trim();
const footerSrc = stripComments(
  fs.readFileSync(path.join(SNIPPETS, "footer.html"), "utf8")
).trim();

function parseFragment(file) {
  const raw = fs.readFileSync(file, "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${path.basename(file)}: missing --- front-matter ---`);
  let meta;
  try {
    meta = JSON.parse(m[1]);
  } catch (e) {
    throw new Error(`${path.basename(file)}: front-matter is not valid JSON — ${e.message}`);
  }
  for (const key of ["title", "meta", "h1", "og"]) {
    if (!meta[key]) throw new Error(`${path.basename(file)}: front-matter missing "${key}"`);
  }
  // Trim surrounding blank lines but preserve the first line's indentation,
  // so assembled output matches the hand-authored pages byte for byte.
  return { meta, body: m[2].replace(/^\n+/, "").replace(/\s+$/, "") };
}

function render(slug, { meta, body }) {
  const isHome = slug === "index";
  const root = isHome ? "./" : "../";
  const canonical = isHome ? `${DOMAIN}/` : `${DOMAIN}/${slug}`;

  const header = headerSrc.replace(/\{\{ROOT\}\}/g, root);
  const footer = footerSrc.replace(/\{\{ROOT\}\}/g, root);
  const article = body.replace(/\{\{ROOT\}\}/g, root);

  // Breadcrumbs: Home > Services > [parent] > current. Homepage has none.
  let crumbs = "";
  if (!isHome) {
    const trail = [
      `      <li><a href="${root}">Home</a></li>`,
      `      <li><a href="${root}services/">Services</a></li>`,
    ];
    if (meta.parent) {
      trail.push(
        `      <li><a href="${root}${meta.parent}/">${meta.parentLabel}</a></li>`
      );
    }
    trail.push(`      <li aria-current="page">${meta.crumb || meta.h1}</li>`);
    crumbs = `
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol>
${trail.join("\n")}
    </ol>
  </nav>
`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${meta.title}</title>
<meta name="description" content="${meta.meta}">
<link rel="canonical" href="${canonical}">

<link rel="icon" href="${root}assets/img/favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="${root}assets/img/favicon-16.png" sizes="16x16" type="image/png">
<link rel="apple-touch-icon" href="${root}assets/img/apple-touch-icon.png">
<link rel="manifest" href="${root}site.webmanifest">
<meta name="theme-color" content="#0b4f6c">

<meta property="og:type" content="website">
<meta property="og:site_name" content="Pete&rsquo;s Plumbing">
<meta property="og:locale" content="en_US">
<meta property="og:title" content="${meta.title}">
<meta property="og:description" content="${meta.meta}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${DOMAIN}/assets/img/${meta.og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${meta.title}">
<meta name="twitter:description" content="${meta.meta}">
<meta name="twitter:image" content="${DOMAIN}/assets/img/${meta.og}">

<link rel="stylesheet" href="${root}assets/css/main.css">
</head>
<body>

${header}

<main id="main">
${crumbs}
${article}
</main>

${footer}

</body>
</html>
`;
}

const requested = process.argv.slice(2);
const files = fs
  .readdirSync(FRAGMENTS)
  .filter((f) => f.endsWith(".html"))
  .map((f) => f.replace(/\.html$/, ""))
  .filter((slug) => requested.length === 0 || requested.includes(slug));

if (requested.length && files.length !== requested.length) {
  const missing = requested.filter((s) => !files.includes(s));
  console.error(`No fragment for: ${missing.join(", ")}`);
  process.exit(1);
}

let count = 0;
for (const slug of files) {
  const parsed = parseFragment(path.join(FRAGMENTS, `${slug}.html`));
  const outDir = slug === "index" ? SITE : path.join(SITE, slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), render(slug, parsed));
  console.log(`  ${slug === "index" ? "/" : "/" + slug}`);
  count++;
}
console.log(`\n${count} page(s) written to /site/.`);
