# Phase 6 — Content Drafting

## Order
Draft premium pages first (homepage + the 3–7 priority pages from Phase 3),
then all remaining category/service pages, then About/Contact.

## Writing principles (every page)
- Friendly local expert voice. Direct, warm, no jargon (explain simply if
  necessary). Short paragraphs, one idea per paragraph. "We" for the business,
  "you" for the customer.
- Target roughly an 8th-grade reading level — genuinely easy to read without
  sounding dumbed-down or patronizing.
- No corporate phrases ("industry-leading," "world-class," "seamless,"
  "robust," "best-in-class," "look no further," etc.)
- No invented facts: no fake review counts, ratings, response times,
  guarantees, awards, years in business, license numbers, or statistics. Only
  what's in the intake or a cited outbound source.
- No keyword stuffing, no scare tactics, no generic "we pride ourselves" filler.
- Don't overuse the business name.

## Required page structure (category/service pages)
1. Hero: H1, subheadline, primary CTA, secondary CTA, trust badges.
2. Table of contents (short descriptive anchor labels).
3. Opening CTA banner.
4. 5 main H2 sections, chosen per service from: signs you need it, causes,
   what to do before calling, process, cost factors, local factors, repair
   vs. replace, prevention, when to call a pro. Pick what fits the specific
   service, but stay consistent within a service *type* across the site: all
   repair-type pages should tend toward the same subset/order (e.g., signs
   you need it → causes → what to do before calling → process → when to call
   a pro), all installation-type pages toward another consistent subset
   (e.g., process → cost factors → local factors → prevention → when to call
   a pro), and so on. This isn't a rigid template — swap in a section a page
   genuinely needs — but two pages of the same service type shouldn't read
   as structured by two different people.

   > **Exactly 5, and only these count — `scripts/validate.js` enforces it as a
   > hard fail.** The gate counts every `<h2>` on the page *except* those inside
   > the table-of-contents nav and inside the FAQ section, and requires the total
   > to be exactly 5. Two consequences that have bitten a real build:
   >
   > - **The count is 5 regardless of research tier.** "Lighter research" for a
   >   Tier 3 page (see `phase-05-per-page-research.md`) means less live SERP work
   >   and a shorter page — it does **not** mean fewer sections. A Tier 3 page
   >   still gets exactly 5 H2 content sections; they are just shorter. Drafting a
   >   Tier 3 page with only 3 sections fails the gate and needs 2 more genuine
   >   sections added later (cost factors, prevention, before-you-call, and
   >   maintenance are the usual, service-appropriate additions) — cheaper to get
   >   right the first time.
   > - **Nothing else on the page may use `<h2>`.** The TOC heading, every
   >   mid-page CTA banner heading, and the footer's column labels must *not* be
   >   `<h2>`, or the gate counts them and the page fails with far more than 5.
   >   Make the TOC a `<nav class="toc">` (the validator excludes it by that
   >   class), give CTA-banner headings a non-heading element like
   >   `<p class="cta-title">`, and use `<h3>` (or a styled non-heading) for
   >   footer column labels. Set this up in the Phase 4 snippets so it is right
   >   sitewide from the start rather than retrofitted across ~40 pages.
5. Internal links to parent, services hub, relevant children, 2–4 related
   pages — placed inside body copy (paragraphs, bullets, explanatory text),
   never only in cards/grids/menus/footer.
6. One outbound authority link, in-body, from the approved domain list below.
7. Mid-page CTA after the 2nd or 3rd section.
8. 5–6 FAQs, specific to this service/area, not repeated from other pages.
   Wrap the FAQ section in `<section id="faq">` — `scripts/validate.js`
   uses this exact id to confirm visible FAQ content matches FAQPage schema
   (Phase 9) and vice versa.
9. Final CTA.
10. SEO elements: title tag, meta description, H1, H2s, internal links used,
    outbound link used.

## Word count guidance (category/service pages)
Target roughly **1500–2500 words** of real body copy per page — but only
where there's genuine content/research depth to support that length. This
is not a license to pad a thin page with filler, repeated points, or
generic statements to hit a number: a page with real substance (specific
local detail, a genuinely useful process explanation, a well-developed
cost-factors section, distinct FAQs) can and should run toward the higher
end, while a page that's naturally simpler (a narrow, low-complexity
service with little to differentiate it) should stay shorter rather than
be stretched to match. Judge length by whether every sentence is still
earning its place, not by the target number alone — the reading-level and
"one idea per paragraph" rules above still apply at any length.

**Length tracks the page's research tier, and that's by design.** Phase 5
researches Tier 1 pages (homepage + Phase 3's priority picks) in full and Tier 3
general service pages lightly, on purpose — see the tiering table in
`phase-05-per-page-research.md`. Tier 1 pages have competitor-gap findings and
per-page AI-visibility research behind them, so they genuinely support the upper
end of the range. Tier 3 pages usually land nearer the lower end, and that is the
correct outcome, not a shortfall to correct.

Do **not** pad a Tier 3 page to Tier 1 length. A shorter page that is accurate,
locally specific, and non-redundant has met the bar; a longer one padded with
filler to match a word count has failed it, and thin me-too content is exactly
what the redundancy check in Phase 5 exists to prevent. Equally, "lighter
research" is never licence for generic copy — every Tier 3 page still needs its
own angle, checked against `/ledgers/content-ledger.md`, in the client's voice,
with no invented facts.

Homepage follows the same spirit but with its own structure: hero, why-choose-
us (4 differentiators, drawn from the intake's unique selling points), reviews
placeholder (no invented review data), homepage-linked priority sections
(full-width, not cards — see below), local-service section, process section,
trust/credentials section, GBP embed placeholder, 6–8 FAQs (same
`<section id="faq">` wrapper convention as above), final CTA.

**Homepage-linked priority sections, specifically**: these are the site's
premium real estate — the homepage-linked picks from Phase 3's priority
tiers — and each one gets a full-page-width section of its own, stacked
vertically down the homepage, not a card sitting side-by-side with others
in a grid. Think of it as a mini version of that page's own landing-page
section, not a teaser. For each priority pick:
1. **An H2 heading** naming that category/service.
2. **2–3 real paragraphs**, not a one- or two-sentence blurb. Draw them
   from that page's own already-drafted content — either condense its key
   points, or pull out and expand on one strong, specific local angle from
   it (whichever reads better; this is a per-section judgment call, not a
   fixed formula). Don't duplicate a large passage verbatim — this is a
   distinct, shorter restatement in its own words, not a copy-paste. Check
   `/ledgers/content-ledger.md` first, same as drafting any other page, so
   the section's local details/angle don't collide with what's already
   logged for that destination page or any other page.
3. **A real image**, reusing that destination page's own existing hero/LCP
   image (same file, referenced again — don't generate a new one).
   Lazy-load it on the homepage even though it's the non-lazy LCP image on
   its own page, since it isn't the homepage's own LCP image. Lay the
   section out as image + text side by side (alternating which side the
   image sits on from one section to the next reads better over several
   stacked sections than repeating the same layout six times), stacking to
   a single column on mobile.
4. **A "Learn More" CTA** linking to the destination page, styled/treated
   as a button. It repeats identically across every section by design (a
   UI convention, like the repeated "Request a Free Estimate" CTAs) —
   give it the same `class="btn ..."` treatment those use so
   `scripts/validate.js` treats it as a structural element exempt from the
   anchor-uniqueness check, not literal SEO anchor text. Keep at least one
   genuine descriptive link woven into the paragraph prose itself too
   (real anchor text, checked against `/ledgers/anchor-ledger.md` same as
   any other in-body link) — the CTA button isn't a substitute for that,
   same "links live in body content" principle as every other page.

## Approved outbound source domains
**Trade-specific (prefer these first when one fits the page's topic):**
iaei.org (electrical), nachi.org (home inspection/general trades), nate.org
(HVAC technician certification), ahrinet.org (HVAC/refrigeration
standards), phccweb.org (plumbing/HVAC — the National Association; phcc.org
resolves to an unrelated Northern Virginia local chapter site, not the
national org, so don't use it), iapmo.org (plumbing codes), angi.com
(only for general contractor-selection guidance, not as a review/ratings
source), nari.org (remodeling), epa.gov/watersense (water efficiency).

**General (use when no trade-specific domain fits):**
epa.gov, energy.gov, energystar.gov, cdc.gov, fema.gov, osha.gov,
consumerreports.org, thisoldhouse.com, familyhandyman.com, nfpa.org,
ashrae.org, nahb.org, buildingscience.com, hud.gov, ftc.gov, usa.gov, nih.gov,
ncbi.nlm.nih.gov, mayoclinic.org, clevelandclinic.org, webmd.com,
healthline.com, cornell.edu, harvard.edu, mit.edu, stanford.edu, berkeley.edu,
psu.edu, umich.edu, wikipedia.org (only if no better authority fits),
bobvila.com, hgtv.com, bhg.com, aia.org, ul.com, asme.org, icc-es.org,
aceee.org, sciencedirect.com, bankrate.com, nerdwallet.com, investopedia.com,
forbes.com, nytimes.com, washingtonpost.com, apnews.com, reuters.com.

## The 6 Golden Rules of Internal Anchor Text (in-body links only)
1. Never repeat anchor text anywhere on the site — check `/ledgers/anchor-
   ledger.md` before finalizing any anchor, and add every new one to it.
2. Incorporate keywords naturally, never stuffed.
3. Anchor text describes the destination page, not the current page.
4. Descriptive yet concise — not a sentence, not "click here."
5. Links live in body content only. Nav/footer/header stay plain and
   functional, and are not subject to this ledger.
6. Never use the brand name as anchor text.

### Anchor text must match the ledger *character for character*

`scripts/validate.js` confirms each ledger row by looking for its anchor string
inside the source page's body copy. That check is literal, so an anchor that
reads correctly to a human can still fail:

- **Sentence-start capitalisation.** A ledger entry of `gas-fired boiler work`
  written into the page as "Gas-fired boiler work" at the start of a sentence
  will not match. Rewrite the sentence so the anchor sits mid-sentence — a colon
  or em-dash before it usually reads better anyway — rather than capitalising
  the anchor or editing the ledger to match the capitalised form.
- **HTML entities.** Curly quotes and apostrophes written as `&rsquo;`, `&amp;`,
  or `&mdash;` inside anchor text will not match a plain-text ledger entry.
  Keep anchor text free of entities entirely; if the natural phrasing needs an
  apostrophe or ampersand, choose different phrasing for the anchor.
- **Line breaks inside the anchor.** Wrapping a long anchor across two source
  lines inserts a newline and extra indentation into the string. Keep the whole
  `<a>…</a>` on one line, however long that line gets.

Both of the first two failures occurred in real builds. Check every anchor
against the ledger programmatically after drafting each page rather than by eye
— a simple "is this exact string present in this file" test over every ledger
row catches all three cases in seconds, and catching them at draft time is far
cheaper than debugging a Phase 12 gate failure dozens of pages later.

## Content ledger (cross-page redundancy prevention)
Before drafting each page, check `/ledgers/content-ledger.md` for which local
details, angles, and phrasings have already been used on other pages (e.g.,
"mature tree root intrusion" as the lead angle for one page shouldn't become
the lead angle for three more). After drafting, add this page's local
details/angles used to the ledger. The goal: pages that share a general
region and industry can share *facts* (the town has septic systems) without
sharing *angles* or *phrasing* — each page needs its own genuine differentiator,
not just a reworded repeat of the last page's hook.

## Services hub (/services) page structure
Nothing else in this pipeline defines this page's content, even though
Phase 3 requires it and Phase 9 schemas it — this is that definition:
1. H1 (e.g. "Our Services" — not keyword-stuffed).
2. A brief intro paragraph (2–4 sentences) explaining the range of services
   in plain language.
3. **Hub-only exception to the in-body-prose-link rule.** Every other page
   on the site (including every category page) links to its related pages
   through contextual sentences — real prose that happens to contain a
   link. The Services hub is the one deliberate exception to that pattern,
   because its actual job is scannable navigation across the entire
   architecture, not content: a hub page written as dense contextual prose
   for 50+ destination pages reads as a wall of text nobody scans. Instead:
   one short category framing sentence or two (can include an in-line link
   to that category's own overview page, same as any other in-body link),
   followed by a **card grid** of that category's nested services — one
   card per page, each with a title (the page's own service name, used as
   the card's link/anchor text), a short real description (its own meta
   description is a good source — don't invent new copy), and a "Learn
   More" link to the page.
   - **This exception applies to this one page only.** Every other page on
     the site — including the 4 category overview pages themselves — keeps
     the existing full in-body-contextual-link requirement unchanged. Do
     not use a card-grid-instead-of-prose pattern anywhere else just
     because it's convenient; the hub is structurally different (a
     directory of the whole site) from every other page (content about one
     topic).
   - **This is not a return to a bare, sparse link wall.** The card grid
     still needs full coverage of every page per point 4 below — a card
     grid with only 2–4 sample cards per category is the same underlying
     problem as a prose paragraph with only 2–4 sample links, just in a
     different visual wrapper.
   - Each card's title link and the "Learn More" link both point to the
     same destination. The title link is real, page-specific anchor text
     (the service name) subject to the normal sitewide anchor-uniqueness
     rule — check `/ledgers/anchor-ledger.md` same as any other link. The
     "Learn More" link repeats identically across every card by design (a
     UI convention, like the repeated "Request a Free Estimate" CTA
     buttons) — give it the same `class="btn ..."` treatment those CTAs
     use so `scripts/validate.js` treats it as a structural element exempt
     from the anchor-uniqueness check, not literal SEO anchor text.
4. **Full coverage, no exceptions**: every page in the approved architecture
   — every category page and every service page, including any page that
   sits under a catch-all bucket rather than a real category (e.g. a
   "Plumber — general service pages, no dedicated category" grouping) —
   must get at least one in-body link from this page (a card counts as
   in-body; nav/footer still don't). This is not a license to sample a
   handful of cards from a larger bucket and leave the rest unlinked from
   the hub. `scripts/validate.js` enforces this as a hard fail (see Phase
   12), so treat it as non-negotiable, not a nice-to-have.
5. **Large flat groupings need sub-structure, not a link wall (or card
   wall).** If a catch-all bucket (no dedicated category page) is large
   enough that one undifferentiated card grid would be unreadable — as a
   rough guide, more than ~8–10 pages — split it into its own short section
   (an H2, e.g. "Plumbing") containing multiple readable sub-groupings
   (H3s) by genuine service type, each with its own short framing sentence
   and its own card grid for just that sub-group's pages. Pick sub-groupings
   that reflect how a homeowner actually thinks about the problem, not an
   arbitrary alphabetical split — e.g. for a general plumbing bucket:
   emergency/leak/pipe repair, water heating/softening/filtration,
   fixture/appliance/bathroom-kitchen installs, and
   specialty/maintenance/commercial work is one reasonable split; a
   different client's uncategorized bucket may naturally split differently.
6. One CTA.
7. SEO elements: title tag, meta description, H1 — same as other pages.

## Writing the actual page file
Nothing before this point writes real HTML — this is where each page's file
first gets created. For each page, once its content above is drafted,
combine into a single file:
1. This page's drafted content (headings, body copy, FAQs, CTAs), placed
   into the Phase 4 page template's structure.
2. The shared header/nav/footer markup, copied verbatim from `/snippets/`.
3. A `<link rel="stylesheet" href="{{ROOT}}assets/css/main.css">` reference
   to Phase 4a's stylesheet — relative, not root-absolute; see Phase 4
   Task 2 for why.
4. A placeholder for each image slot this page needs — a `data-slot`
   marker noting what the slot should depict (e.g.
   `<img data-slot="hero: technician repairing a tankless water heater">`),
   with no `src` or `alt` yet. Phase 7 generates the image and writes its
   alt text together, in the same step (alt text describes what was
   actually generated, not a guess made before the image exists), then
   fills in this exact slot.

Write this to `/site/[slug]/index.html` (or `/site/index.html` for the
homepage, `/site/services/index.html` for the hub, etc.), following the
file/directory convention in Phase 4 Task 1. This is a one-time write per
page — it is not regenerated from scratch later. Phase 7 (images), Phase 9
(schema), and Phase 10 (GHL embeds) each *edit* this same file to add their
own piece (filling in `src`/dimensions on the placeholder `<img>` tags,
inserting the JSON-LD `<script>` block in `<head>`, inserting embed
snippets) rather than writing a new file. Phase 11 (technical pass) mostly
works at the site level (`sitemap.xml`, `robots.txt`, `llms.txt`) but may
also edit an individual page file, and only that one, if its canonical
check finds a mismatch to fix.

## Output
Each page's full drafted content, in the same structured output format as the
architecture (title tag, meta description, H1, H2s, body copy, FAQs, CTAs,
internal/outbound links used) — ready for Phase 8 QA. The actual
`/site/[slug]/index.html` file exists by the end of this phase, per above.
