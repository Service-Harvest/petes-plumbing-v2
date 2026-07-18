# Phase 3 — Site Architecture + Anchor Ledger + HUMAN CHECKPOINT

## Purpose
Produce the full site architecture, seed the anchor-text ledger, and present
the one checkpoint in this entire pipeline. Everything after user approval
here runs autonomously — so this output needs to be complete enough that
approval here is actually meaningful, not a rubber stamp.

## Task 1 — Build the architecture

Using the Phase 1 cleaned hierarchy and Phase 2 priority selections:

1. Homepage targets `[Primary GBP Category] + [City] + [State Abbreviation]`.
   Do not create a separate page for the primary category itself.
2. One indexable page per secondary category.
3. One indexable page per service, nested under its correct parent category.
4. Standard pages: Homepage, Services hub, About, Contact.
5. No location/service-area pages in this initial build.
6. Every page gets: unique URL, unique title tag, unique meta description,
   unique H1 (categories/services should include the service/category name;
   homepage includes Primary Category + City + State), parent page assignment,
   schema types needed, content priority tier.
7. URL structure: `/[category-or-service-slug]-[city-slug]-[state-abbrev]` for
   category/service pages; `/services`, `/about`, `/contact` for main pages.
8. Nav bar stays exactly: Home, Services, About, Contact. No dropdowns, no
   service links in nav. One CTA button in the header (phone or primary CTA).
9. Footer includes: main nav, homepage-linked priority pages, all secondary
   category pages, contact details, service areas. These footer links use
   plain functional labels ("Services," category name) — they are navigation,
   not the anchor-text strategy (see Task 2).

### Why one page per service, even when the volume data says not to

**Read this before proposing a smaller site. It will look like the wrong call
if you evaluate page count on search volume alone — that is not the criterion.**

Steps 2 and 3 above produce one indexable page per category and per service,
mirroring the client's GBP structure exactly. On a small or low-volume market,
research in Phase 2 will frequently show that most individual service pages have
little or no measurable exact-match search volume, and the apparently sensible
recommendation is to cut the page count and consolidate into fewer, deeper pages.

**Do not make that recommendation. The service pages are not there to rank
individually on their own search volume.** Their job is to make the website's
service list **fully mirror the GBP's service list**. That correspondence is what
helps Google connect the GBP to the site and build the authority that lifts the
**priority pages** — which are the pages actually meant to rank. Thin-but-complete
coverage is the intended strategy, not an oversight to correct.

A service page with no measurable search volume is still doing its job if it
completes the GBP mirror. Judge the page set on whether it matches the cleaned
GBP hierarchy from Phase 1, not on per-page volume.

(Volume research still matters — it decides the **priority picks** in Phase 2 and
the content tier of each page here. It does not decide whether a page exists.)

## Task 2 — Seed the anchor-text ledger

**Sequencing — finalize the architecture first.** Do not begin this task until
Task 1's page list is complete and settled. The ledger is derived mechanically
from the page set, so seeding it against a page list that might still change
means generating every anchor twice — and a partly-stale ledger is worse than an
empty one, because `scripts/validate.js` reads it as authoritative.

If the checkpoint is likely to change the page set (an open question about
scope, geography, or which categories survive), it is correct to present the
architecture at the checkpoint **first**, resolve those questions, and seed the
ledger immediately afterward — before Phase 4 begins. If you do this, say so
explicitly in the checkpoint output and write a visible "deferred, not skipped"
note at the top of `anchor-ledger.md`, so the gap can't be mistaken for a
finished ledger. **The ledger must be fully seeded before any Phase 4 work
starts** — it is never carried into Phase 4 empty.


Write `/ledgers/anchor-ledger.md`. For every planned internal link in the
architecture (category → child service, child service → parent, related-
service cross-links, services hub → each category and its highlighted
services per Phase 6's services hub structure), pre-generate the anchor text
now, following these rules (the 6 Golden Rules of Internal Anchor Text):

1. **Never repeat anchor text anywhere on the site** — not just per source
   page, sitewide. Two different pages linking to the same destination must
   use two different anchor strings. Check every new entry against everything
   already in the ledger before adding it.
2. **Incorporate keywords naturally** — no keyword stuffing.
3. **Describe the destination page**, not the current page.
4. **Descriptive yet concise** — not a full sentence, not "click here."
5. **Body content only** — this ledger governs in-body contextual links.
   Nav/footer/header links are separate and stay plain/functional (not subject
   to this ledger).
6. **Never use the brand name as anchor text.**

Ledger format:
```
| Source Page | Destination Page | Anchor Text | Placement Note |
|---|---|---|---|
```
**Source Page and Destination Page must be the page's exact URL path**
(e.g. `/water-heater-repair-austin-tx`, not "Water Heater Repair page") —
`scripts/validate.js` reads this table directly to confirm every planned
contextual link actually exists in that source page's body copy, and it
needs an exact path to check against, not a human-readable label.

This file is permanent — Phase 6 (content drafting) and every Phase 14
post-launch edit will read from and add to it. Never regenerate it from
scratch on a later edit; always append/check against what's there.

## Task 3 — Write `/ledgers/architecture.md`

The full architecture output (Task 1) becomes this file — the permanent
source of truth every later phase reads from.

## Task 4 — Produce the checkpoint output for the user

This is what the user actually reviews. Format it exactly like this, since
it doubles as their literal GBP data-entry reference:

```
=======================================================
PROPOSED GBP + SITE STRUCTURE — FOR YOUR REVIEW
=======================================================

PRIMARY CATEGORY:
[Category] — maps to homepage

SECONDARY CATEGORIES (with nested services):

[Category Name]  ⭐ PRIORITY (homepage-linked / premium content)
  - [Service]  ⭐ PRIORITY
  - [Service]

[Category Name]
  - [Service]
  - [Service]  ⭐ PRIORITY

[continue for all categories]

-------------------------------------------------------
PRIORITY PICKS SUMMARY (3–7 total, homepage-linked, premium content)
-------------------------------------------------------
1. [Name] — [Manual override | Data-backed pick]
   - Search volume: [finding, from Phase 2]
   - Competitive landscape: [finding, from Phase 2]
   - Client-fit: [finding, from Phase 2]
   - AI/LLM visibility: [finding, from Phase 2]
   - Judgment: [plain-language reason this made the cut]
2. [Name] — [Manual override | Data-backed pick]
   - Search volume: [finding, from Phase 2]
   - Competitive landscape: [finding, from Phase 2]
   - Client-fit: [finding, from Phase 2]
   - AI/LLM visibility: [finding, from Phase 2]
   - Judgment: [plain-language reason this made the cut]
[...]

Pull these four signal lines directly from Phase 2's per-candidate output —
don't re-summarize or drop any of them. All four go into the decision, so
all four should be visible here, not just the three that happen to fit on
one line.

-------------------------------------------------------
QUESTIONS / CRITIQUES / FLAGS
-------------------------------------------------------
[Anything Claude Code is unsure about, any intake gaps noticed, any
categories/services it recommends reconsidering, etc.]
```

**Stop here.** Do not proceed to Phase 4 until the user explicitly approves
this output or provides corrections. If corrections come back, update the
architecture and anchor ledger accordingly and re-confirm before proceeding.
