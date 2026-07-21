# Phase 4 — Repo Scaffold (Layer 1 Foundation)

## Purpose
Build the technical foundation so every Layer 1 requirement is structurally
guaranteed by the template, not something to remember per page. **"Layer 1"
means, specifically, every item in the Tasks list below** — this is the one
place that checklist is defined. Every other phase that refers to "Layer 1"
(Phase 10, Phase 12) means this exact list.

## Output format
`/site/` contains only final, plain static HTML files — no template
language (Nunjucks, Liquid, JSX, or otherwise), no build step, no
source/output split. Every `.html` file under `/site/` is exactly what
ships to the browser, exactly what `scripts/validate.js` reads, and exactly
what the deploy workflow (Task 14 below) publishes. No client-side
rendering of any page content, and no framework that renders content
client-side (no SPA behavior of any kind).

## Tasks

1. **Folder structure**: `/site/` contains the final site as flat HTML
   files, one directory per clean URL with an `index.html` inside it (e.g.
   the page at `/water-heater-repair-austin-tx` lives at
   `/site/water-heater-repair-austin-tx/index.html`) — this is what makes
   the clean URLs from Phase 3's URL structure actually resolve on GitHub
   Pages without a `.html` extension, and it's what `scripts/validate.js`
   assumes when matching sitemap/canonical URLs to real files. The
   homepage is `/site/index.html`; the 404 page is the one exception and
   lives flat at `/site/404.html` (GitHub Pages requires that exact path).
   A top-level `/snippets/` folder (outside `/site/` — never served,
   never read by `scripts/validate.js`) holds the canonical shared header/
   nav/footer HTML blocks: the authoring reference Claude Code copies
   verbatim into every real page file for sitewide consistency. If a
   sitewide nav/footer change is ever needed (including in Phase 14), update
   `/snippets/` first, then re-propagate the change into every affected page.
2. **Relative internal paths, never root-absolute.** Every internal
   `href`/`src` (nav, footer, breadcrumbs, in-body links, images, favicon,
   CSS) is written relative to the current file, not as a root-absolute
   path (`/services`, `/assets/css/main.css`). Use a `{{ROOT}}` prefix that
   resolves to `./` on depth-0 pages (the homepage, `404.html`) and `../` on
   every depth-1 page (every category/service/hub/about/contact page — all
   of them live one directory below site root per Task 1 above). Root-
   absolute paths work fine once a real custom domain is verified and
   serving from its own root, but silently 404 site-wide (nav, CSS, every
   image) when the site is instead viewed at GitHub Pages' fallback project-
   subpath URL (`https://org.github.io/repo-name/`) — which is exactly how
   a build gets previewed before DNS is cut over, or whenever a client's
   custom domain isn't live yet. Canonical tags, Open Graph/Twitter meta
   tags, and JSON-LD schema URLs are the one exception — those stay fully
   absolute (`https://[real-domain]/...`) always, since they declare the
   page's real-world identity regardless of which URL it's being viewed
   through. See `snippets/header-nav.html`, `snippets/footer.html`, and
   `snippets/page-template.html` for the exact convention.
3. **robots.txt**: present, correct, and includes a deliberate AI-crawler
   policy (explicit allow/block decision for GPTBot, ClaudeBot, PerplexityBot,
   Google-Extended — a decision, not a default).
4. **llms.txt**: present, summarizing the site for AI crawlers.
5. **Favicon set**: complete (multiple sizes/formats) — the actual assets
   are produced in Phase 4a (Design System), which runs immediately after
   this phase; this scaffold just needs the `<link rel="icon">` etc. tags
   wired into the page template, ready to point at them.
   > **Emit these five tags in exactly this shape — `scripts/validate.js`
   > matches them with strict regexes (attribute order matters: `rel`, then
   > `type`, then `sizes`, then `href`), and a different order or a missing
   > one fails the gate on every page:**
   > ```html
   > <link rel="icon" type="image/svg+xml" href="{{ROOT}}assets/img/favicon.svg">
   > <link rel="icon" type="image/png" sizes="32x32" href="{{ROOT}}assets/img/favicon-32.png">
   > <link rel="icon" type="image/png" sizes="16x16" href="{{ROOT}}assets/img/favicon-16.png">
   > <link rel="apple-touch-icon" sizes="180x180" href="{{ROOT}}assets/img/apple-touch-icon.png">
   > <link rel="manifest" href="{{ROOT}}site.webmanifest">
   > ```
   > The **SVG icon is required** (not optional): the gate checks for a
   > `type="image/svg+xml"` icon tag, so Phase 4a must produce a real
   > `favicon.svg` asset, not just PNGs. The apple-touch-icon **must** carry
   > `sizes="180x180"`. Every referenced file must exist on disk.
6. **`<html lang="en">`, viewport meta, charset** on every page template.
7. **Open Graph + Twitter card tags** on every page template, populated
   per-page (unique title/description/image per page, not one static OG
   image sitewide) — Phase 4a establishes which image fills that slot per
   page; this scaffold just needs the tags wired to point at it.
8. **Self-referencing canonical tag** on every page, generated from the final
   domain (from intake), never a placeholder/preview domain.
9. **Single canonical hostname**: pick www or non-www, plan the 301 (this may
   be host-level, confirmed again in Phase 13 for GitHub Pages).
10. **HTML5 semantic sectioning**: header, `<nav>`, main, article/section,
    `<footer>` on every page template — use the literal `<nav>` / `<footer>`
    elements (not just visual styling), since `scripts/validate.js` relies on
    these exact tags to tell body-copy links apart from navigation/footer
    links when checking required contextual links.
11. **Real 404 handling**: a custom 404 page that actually returns 404, not a
    soft-200 fallback (verify this works correctly for GitHub Pages
    specifically once deployed in Phase 13).
12. **CNAME file** for the client's custom domain (used by GitHub Pages),
    placed at `/site/CNAME`.
13. **Image handling conventions**: explicit width/height on every `<img>`,
    `loading="lazy"` on below-the-fold images only (never on the LCP image),
    WebP format where practical, descriptive filenames (not generic IDs).
    These conventions get used in Phase 7.
14. **No render-blocking CSS/JS**: inline or minimal CSS, no `@import`,
    `font-display: swap` + preload on webfonts. Phase 4a builds the actual
    CSS on top of this constraint.
15. **Deploy workflow**: confirm `.github/workflows/deploy.yml` (shipped
    with this template — see the repo root) is present and unmodified. This
    is what actually validates and deploys `/site/` in Phase 13, since
    native GitHub Pages branch/folder settings can't serve an arbitrary
    `/site/` folder directly. Do not remove, rename, or hand-edit it per
    client.
16. **Git initialization**: run `git init -b main` (if this directory isn't
    already a git repository — and if it already is, confirm the current
    branch is actually named `main`, since the deploy workflow only triggers
    on pushes to `main`) and create an initial commit of the scaffold
    produced by this phase, so a real commit history exists before Phase 13
    ever tries to push or create the remote repo. Later phases don't need to
    commit as they go — Phase 13 commits and pushes everything accumulated
    since this initial commit.

## Output
A working, empty-of-content but fully wired site skeleton, with a real git
history behind it, ready for Phase 4a to apply the visual design system,
then Phase 5–6 to populate with real pages, and ready for Phase 12 to
validate against.
