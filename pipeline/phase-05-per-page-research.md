# Phase 5 — Per-Page Research

## Purpose
Every page needs its own research pass — not just the site-wide pass from
Phase 2. This is where competitor content-gap analysis and hyper-local detail
gathering happen, page by page, right before that page is drafted in Phase 6.

## Page order
Research pages in the same order Phase 6 drafts them: the homepage + the
3–7 priority pages from Phase 3 first, then all remaining category/service
pages, then About/Contact. This keeps a page's research finished by the
time Phase 6 is ready to draft it, instead of Phase 6 waiting on research
for a page that hasn't been reached yet.

## Research depth is tiered — this is a standing rule, not a per-client call

Not every page gets the same research spend. Live SERP/competitor-gap calls are
the expensive part of this phase, and on a GBP-mirroring site most pages exist to
complete the mirror rather than to rank individually (see
`phase-03-architecture-checkpoint.md`, "Why one page per service"). Spending a
full research pass on all ~50 pages buys very little on the pages that were never
meant to rank alone.

Apply this split, using the content tier already assigned to each page in
`/ledgers/architecture.md`:

| Page tier | Research depth |
|---|---|
| **Tier 1 — homepage + the 3–7 priority pages from Phase 3** | **Full research.** Every numbered item below, including the live DataforSEO SERP/competitor-gap calls and the per-page AI/LLM visibility check. These are the pages meant to rank and to be cited in AI answers; this is where research earns its cost. |
| **Tier 3 — general service pages** | **Light research. Skip the dedicated live SERP call for this page entirely.** Draft from the intake's local context, the site-wide research already gathered in Phase 2, general knowledge of the trade, and the content ledger. |
| **Tier 2 — category pages** | Follow the **Tier 3** rule by default. The exception: a category page that is itself one of Phase 3's priority picks is Tier 1 in `architecture.md` and gets **full** research like any other Tier 1 page. |

**"Light research" does not mean generic or templated copy.** Every existing
quality bar still applies to Tier 3 pages without exception:

- Genuinely accurate — no invented facts, figures, credentials, or pricing.
- Locally specific — real detail drawn from the intake's local context and the
  Phase 2 findings, not filler that would fit any town in the country.
- Non-redundant — checked against `/ledgers/content-ledger.md` and given its own
  angle, exactly like a Tier 1 page.
- Written in the client's voice, at the same standard.

What is being cut is **one specific expensive step** — the live per-page SERP
lookup — not the thinking, the local specificity, or the quality. A Tier 3 page
that reads as interchangeable with a competitor's page has failed this phase even
though it was researched lightly.

Tier 3 pages will often land shorter than Tier 1 pages as a result. That is
correct and expected — see the word-count guidance in
`phase-06-content-drafting.md`. Do not pad a Tier 3 page to match a Tier 1 length.

Log the tier used for each page alongside its note in "Research Takeaways" in
`/ledgers/build-report.md`, so a later session can tell which pages were
researched lightly by design rather than by oversight.

## For each page, research:

**This numbered list is the full Tier 1 pass.** For Tier 3 pages (and Tier 2
pages that aren't priority picks), items 1, 2, 3 and 7 are the live-SERP steps
that get skipped — cover items 4, 5 and 6 from the intake, Phase 2's site-wide
findings, and general knowledge instead. See the tiering table above.

Use the connected DataforSEO MCP tools (tool names prefixed `dataforseo`)
directly for competitor content-gap analysis and any other DataforSEO-sourced
research below — call the MCP tools directly, never write custom REST API
requests (bash/curl) against the DataforSEO API. If the MCP connection is
unavailable, fall back to web search and label affected findings accordingly.
Log the outcome under "Connection Status" in `/ledgers/build-report.md`:
whether the DataforSEO MCP tools were successfully used for this phase, or
whether it fell back to web search.

1. **Top-ranking local competitors** for this specific service/category in
   this city (DataforSEO MCP tools, or web search fallback if not connected).
2. **What competitors cover, and what they miss** — a real content-gap
   analysis, not just a topic list. The goal is a page that's more helpful,
   more specific, and more locally relevant than what's currently ranking —
   never a page that mirrors competitor structure or wording.
3. **Explicit redundancy check against competitors**: identify the generic
   angle(s) most competitor pages default to (the thing everyone says) and
   flag it so Phase 6 deliberately avoids leaning on it as the page's main
   angle. Google's local algorithms are known to penalize thin,
   me-too content that doesn't differentiate — this check exists specifically
   to prevent that.
4. **People Also Ask–style questions** and **Reddit/forum-style homeowner
   concerns** specific to this service and area.
5. **Local factors**: home age, housing stock, water quality, septic/sewer
   prevalence, weather, basements, mature trees, local codes/permits — whatever
   applies to this specific service, pulled from the intake's local details
   plus any additional research.
6. **One outbound authority source** for this specific page, from the approved
   domain list (see Phase 6), that fits naturally with something on this page.
7. **AI/LLM visibility for this page's topic**: check how/whether competitors
   appear in AI-generated answers for this specific page's topic, using the
   same method as Phase 2 (for consistency across the site):
   a. Call `mcp__dataforseo__ai_opt_llm_ment_top_domains` (fall back to
      `mcp__dataforseo__ai_opt_llm_ment_search` if empty) with this page's
      target keyword + city.
   b. Call `mcp__dataforseo__ai_optimization_llm_response` once with the
      page's core question phrased naturally, and note which competitors (if
      any) get named in the response.
   Factor both into what makes the page's content genuinely differentiated —
   not just different from what's currently ranking, but also positioned to
   be a good source for AI-generated answers.

## Output
A per-page research brief that Phase 6 consumes directly — not a general
document, but organized page-by-page so Phase 6 can move through pages
efficiently without re-deriving context each time.

Also log one short note per page under "Research Takeaways" in
`/ledgers/build-report.md`: what differentiating angle this page ended up
using and why, and anything notable from the competitor gap analysis.
