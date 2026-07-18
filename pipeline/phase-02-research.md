# Phase 2 — Site-Wide Research + Priority Category/Service Selection

## Purpose
Decide which 3–7 categories/services get treated as ranking priorities
(homepage-linked, premium content) — one of which must be the primary GBP
category. This is a **multi-factor judgment call**, not a ranked list sorted
by search volume.

## DataforSEO status check

Before running any DataforSEO calls, confirm the DataforSEO MCP tools (tool
names prefixed `dataforseo`) are connected and available.

- **If connected:** use the connected DataforSEO MCP tools directly for all
  research in this phase (search volume, SERP/competitor data, AI/LLM
  visibility) — call the MCP tools directly, never write custom REST API
  requests (bash/curl) against the DataforSEO API.
- **If not connected:** fall back to general web search for competitor and
  volume signals, and explicitly label every research output in this phase as
  "estimated — not DataforSEO-verified" so confidence level is visible
  downstream, especially at the Phase 3 checkpoint.

Log the outcome under "Connection Status" in `/ledgers/build-report.md`:
whether the DataforSEO MCP tools were successfully used for this phase, or
whether it fell back to web search.

## Geo-target selection — REQUIRED, run this BEFORE the per-service research

**Do not take the intake's GBP city field literally as the site's geo-target.**
That field records where the business is physically located. It does not
establish which geography the site should target, and for any business in a
small town or suburb the two are usually different. Targeting a small
municipality verbatim is the single most common way this pipeline produces a
technically-correct site aimed at a market with no search demand.

Compare at least three candidates using the **same four-signal weighting** used
for service/category priorities below:

1. **The literal intake city** (e.g. "Armonk")
2. **The county or metro area** (e.g. "Westchester County")
3. **The largest city already listed in the intake's approved service areas**
   (e.g. "Yonkers") — only ever a candidate if it is already an approved service
   area; never introduce a geography the client did not list

For each candidate, gather:

- **Search volume** — `[primary category] + [candidate geo]`, via
  `mcp__dataforseo__kw_data_google_ads_search_volume`.
- **Natural head-term usage** — query 3–4 *phrasings* of the same candidate
  (e.g. `plumber westchester`, `westchester plumber`, `plumber westchester ny`,
  `plumbers in westchester county ny`). If several phrasings return identical
  volume/competition/CPC, Google is clustering them as one demand pool, which is
  strong evidence that geography is how people genuinely name the market. If a
  phrasing returns **no data at all**, that phrasing is not a real search term.
- **Competitive landscape** — `mcp__dataforseo__serp_organic_live_advanced` for
  each candidate. Note whether the competitive set *changes* between candidates:
  a dominant incumbent at city level may be entirely absent at county level.
  Also note whether an **AI Overview** appears — its presence or absence at a
  given geo directly affects AI-citation strategy.
- **AI/LLM visibility** — run the signal-4 method below against each candidate.
  **If the LLM-mention endpoints return empty, that is itself a finding, not a
  failure:** it usually means the geo is too small to be represented in the
  dataset, which is a strong argument against targeting it.

### Choosing

Weigh all four together — highest volume does **not** automatically win. A
candidate must also be *reachable*:

- **Physical-location constraint.** A GBP cannot rank in the local pack of a city
  it isn't in. A larger nearby city may show real volume that this business
  simply cannot capture in local results. Volume that can't be reached is not a
  reason to pick a geo.
- **Honesty constraint.** The site must not imply the business is headquartered
  somewhere it isn't, and must not contradict the GBP's NAP.
- **Coverage.** A county/metro target usually *contains* the larger service-area
  cities, capturing their intent without the contradiction above.

### Implementing the choice — hybrid, not a swap

When the selected target differs from the intake's physical city, apply it as a
**hybrid**, never a wholesale find-and-replace:

- The **selected geo** goes in URLs, title tags, H1s, and meta descriptions.
- The **physical city** stays in the NAP, `LocalBusiness` schema `address`,
  homepage subhead, About, Contact, and body copy — it is real and it drives
  local-pack proximity.
- The site should read as *"based in [physical city], serving [target geo]"* —
  accurate on both counts.

Record the comparison table, the four signals per candidate, and the reasoning
in `/ledgers/architecture.md` under a "Geo-target decision" heading, and log
anything notable to "Research Takeaways" in `/ledgers/build-report.md`. Phase 3
reads the selected target from `architecture.md`.

## Research tasks (per category/service from the Phase 1 cleaned list)

1. **Search volume signal** (DataforSEO MCP tools, or fallback): approximate
   local search volume for `[category/service] + [city] + [state]` and close
   variants.
2. **Competitive landscape signal** (DataforSEO MCP tools, or fallback): who
   ranks locally for this category/service, whether it's heavily contested or
   has a visible gap, and whether top competitors feature it prominently or
   treat it as an afterthought.
3. **Client-fit signal** (from intake, not from any API): does the client's
   own intake data — USPs, "what we're known for," manual override requests —
   support prioritizing this? This signal is not optional or secondary; it is
   weighted equally with the others.
4. **AI/LLM visibility signal** (DataforSEO MCP tools, or fallback): whether
   and how competitors currently appear in AI-generated answers for this
   category/service. Use this specific two-step method, the same way every
   time, so results are comparable across categories and across clients:
   a. Call `mcp__dataforseo__ai_opt_llm_ment_top_domains` (fall back to
      `mcp__dataforseo__ai_opt_llm_ment_search` if it returns nothing) with
      a query built as `[category/service] + [city]` and, separately,
      `[category/service] near me`. This returns which domains currently get
      cited in AI-generated answers for that query — cross-reference the
      client's own domain and the competitors already identified under
      signal 2 against this list.
   b. Call `mcp__dataforseo__ai_optimization_llm_response` once, with the
      query phrased as a real customer question (e.g., "who's the best
      [category/service] company in [city]"), and note whether/how named
      competitors show up in the actual generated response — this is a
      qualitative spot-check alongside (a)'s quantitative mention data.
   This is an additional input weighed alongside the other three — not a
   replacement for any of them.

## The decision

For every candidate category/service, weigh all four signals together and
produce a plain-language judgment, not just a number. Do not default to
"highest volume wins." A service with modest volume but a clear competitive
gap and strong client-fit can outrank a high-volume, saturated, low-fit one.

Select 3–7 total for priority/homepage-linked status:
- The primary GBP category is automatically included (maps to homepage).
- Honor every manual override from intake as-is — these do not need to be
  justified by data, the client has already decided.
- Fill remaining slots (roughly 1–2 services, 3–4 categories) using the
  four-signal judgment above.

## Output format

For each candidate considered (not just the winners), show:

```
[Category/Service Name]
- Search volume signal: [finding + confidence level]
- Competitive signal: [finding]
- Client-fit signal: [finding, referencing intake]
- AI/LLM visibility signal: [finding]
- Judgment: [plain-language reasoning]
- Selected for priority: Yes/No
- Reason if manual override: [if applicable]
```

This full reasoning — not just the final picks — carries into the Phase 3
checkpoint so the user can see *why*, not just *what*, and can push back with
real context if something looks off.

Also log a short summary of anything notable found during this
priority-selection research under "Research Takeaways" in
`/ledgers/build-report.md` — e.g., a surprising competitive gap, a category
with unexpectedly low/high volume, or a case where client-fit overrode the
data signal.
