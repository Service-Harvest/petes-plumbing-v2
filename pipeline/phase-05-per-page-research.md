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

## For each page, research:

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
