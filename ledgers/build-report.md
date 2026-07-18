# Build Report — Pete's Plumbing (Armonk, NY)

> Generated in Phase 2, updated by Phases 5, 7, 8, and read in full by
> Phase 13 for the final report to the user.

## Connection Status

| System | Status | Notes |
|---|---|---|
| DataforSEO MCP | ✅ Connected, used for Phase 1–2 | Live data. Keyword volume, SERP, and business listings all returned `status_code: 20000`. |
| DataforSEO — LLM mentions endpoints | ⚠️ Connected but **no data for this market** | `ai_opt_llm_ment_top_domains` and `ai_opt_llm_ment_search` both returned empty `items[]` for "plumber armonk ny", "plumber westchester county", "emergency plumber near me". Not an auth failure — the mention dataset does not cover a market this small. |
| DataforSEO — LLM response | ✅ Connected, used | `ai_optimization_llm_response` (gpt-4o-mini, web_search on) returned a full answer. This carried the entire AI/LLM signal for Phase 2. |
| Gemini (image generation) | Not yet exercised — Phase 7 | |

**Confidence note for downstream phases:** the AI/LLM visibility signal in Phase 2
is **qualitative only** — a single spot-check response, not aggregated mention
metrics. Phase 2's four-signal weighting still ran with all four inputs, but the
fourth is thinner than it would be on a larger market. Treat AI-visibility
conclusions as directional, not measured.

## Research Takeaways

**1. This is a very low-volume market, and that is the single most important
finding in the build.**

| Keyword | Volume/mo | Competition |
|---|---|---|
| `plumber near me` | 823,000 | MEDIUM |
| `plumber yonkers` | 720 | MEDIUM |
| `plumber westchester county` | 480 | HIGH |
| `plumber scarsdale` | 50 | MEDIUM |
| `plumber mount kisco` | 30 | HIGH (index 97) |
| `emergency plumber westchester` | 20 | LOW (index 32) |
| `drain cleaning westchester` | 20 | LOW (index 10) |
| `plumber armonk ny` | **10** | HIGH (index 92) |
| `emergency plumber armonk` | **10** | HIGH (index 100) |
| `septic service westchester ny` | 10 | MEDIUM |
| `water heater installation armonk` | **no data** | — |
| `drain cleaning armonk` | **no data** | — |
| `plumber bedford ny` | **no data** | — |
| `sewer line repair westchester` | **no data** | — |
| `sump pump installation westchester` | **no data** | — |
| `water heater replacement westchester` | **no data** | — |

Armonk-level service keywords mostly return **no measurable volume at all**. The
town-level head term is 10/mo. Implication: individual service+city pages will
each capture near-zero direct exact-match search. This site's traffic will come
from unbranded "near me" searches, county-level terms, the local pack, and AI
answers — not from exact-match service+city queries. This directly informs how
many pages are worth building (raised as a flag at the Phase 3 checkpoint).

**2. There is a dominant incumbent.** Gleason Plumbing & Heating
(`armonkplumbing.com`) holds local pack #1 **and** organic #1 for "plumber armonk
ny" — 45+ years in business, 4.9 stars, 93 reviews, exact-match domain. Beating
them on the head term is not a realistic near-term goal.

**3. Directories occupy the middle of the SERP** — Yelp (#5), Armonk Chamber of
Commerce (#7), Angi (#8), Facebook (#9). Roughly a third of page one is not
competitor websites, which is normal for a market this thin.

**4. The most exploitable finding: AI answers ignore the directories entirely.**
The ChatGPT spot-check for "best plumber in Armonk NY" cited **only business
websites** — Gleason, S&L Plumbing, Mill Square City Plumbing, Cassidy Plumbing.
No Yelp, no Angi. The cited competitors also run thin sites. A well-structured,
fully-static, fact-dense site is unusually well positioned to earn AI citations
here, and that is a cheaper win than outranking Gleason organically. This is the
strategic center of the build.

**5. Commercial intent is high despite low volume.** CPC for
`emergency plumber westchester` is **$62.34**, and `plumber scarsdale` tops out at
an $89.48 top-of-page bid. Ten searches a month at that CPC is still worth
owning — low volume does not mean low value in this vertical.

**6. Clearest competitive gap: `drain cleaning westchester`** — competition index
10 (LOW) at 20/mo. Paired with the client's "Drainage service" manual override,
this is the most uncontested opening found anywhere in the research.

**7. Category-name problem found during the Phase 1 sanity check.**
`bathroom_renovator` returns **zero** Google listings within 30km of Armonk, while
`bathroom_remodeler` returns many. "Bathroom renovator" is the AU/UK category name
and is not a valid US Google Business category — dropped in Phase 1 as an invalid
duplicate of "Bathroom remodeler."

**8. Yonkers is 72× the search volume of Armonk** (720/mo vs 10/mo) and is an
approved service area. No location pages are built in this phase per Phase 3 rule
5, but this is the strongest argument for a Phase 14 location-page expansion
later, and is recorded here so that decision isn't re-derived from scratch.

## Content Quality Notes
(Notable QA findings from Phase 8, per page)

## Image Notes
(Generated vs. substituted images, from Phase 7)
