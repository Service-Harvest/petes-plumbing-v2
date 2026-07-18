# Phase 8 — QA Pass (Second Pass on All Content)

## Purpose
A dedicated review pass, separate from drafting, on every page's finished
content. This is not a rewrite — it's a check, with targeted fixes only where
something fails.

## Check every page against:

1. **Factual accuracy / no hallucination.** Does every claim trace back to
   the intake or a properly cited outbound source? Flag and fix anything that
   reads as plausible-sounding but unverifiable — this is the most common spot
   for a fabricated detail to have slipped in during drafting (a model filling
   a gap with something that "sounds right").
2. **Claims-compliance recheck.** Re-verify no page invented review counts,
   ratings, license numbers, exact response times, exact pricing, or years in
   business, even indirectly (e.g., a confident-sounding turn of phrase that
   implies a specific number that was never provided).
3. **Reading level.** Roughly 8th-grade — genuinely easy to read, not
   dumbed-down. Flag sentences that are needlessly complex, jargon-heavy, or
   long, and simplify them.
4. **Natural, human-sounding flow.** Flag anything that reads as templated,
   AI-generic, or repetitive in sentence structure/rhythm across the page.
5. **Cross-page redundancy.** Check this page's local details/angles against
   `/ledgers/content-ledger.md`. If this page leans on an angle already used
   elsewhere on the site, revise it to find a genuinely different angle for
   this specific page's topic — don't just reword the same point. Checking
   this properly means comparing the actual underlying *premise* the page's
   local-factors section builds on, not just whether the ledger's one-line
   summary phrase for this page reads differently from another page's
   summary phrase — two summary phrases can look distinct on paper
   ("basement-finishing projects" vs. "finished basements, spring rain")
   while the actual drafted paragraphs both open with the same core claim
   ("finished basements are common in Westchester") applied to two
   different services. A generically-true local fact (finished basements
   are common; older homes have mixed pipe materials; winters are cold) is
   a legitimate detail to draw on for more than one page, but each page
   still needs its own distinct angle built from it — not the same opening
   sentence/premise reused with the service name swapped out.
6. **Competitor-redundancy check** (carried from Phase 5): confirm the page
   didn't end up leaning on the generic angle flagged as "what every
   competitor already says" for this topic.
7. **H2 structural consistency** (per Phase 6): does this page's H2
   selection/order follow the consistent pattern established for its
   service type (repair-type, installation-type, etc.), matching how other
   pages of that same type are structured? If this is the first page of its
   type drafted, there's nothing to check against yet — just note the
   pattern it sets so later same-type pages can be checked against it.
8. **FAQ marker check**: `<section id="faq">` is present in the page's HTML
   and correctly wraps the visible FAQ content (Phase 6's convention).
   `scripts/validate.js` cross-checks this against FAQPage schema later as a
   safety net, but catch a missing/misplaced marker here first.

## Output
Per page: pass/fail on each of the eight checks above, with the specific fix
applied if it failed. Update `/ledgers/content-ledger.md` with any changes.
Do not proceed to Phase 9 for a page that still fails check 1 or 2 (factual
accuracy / claims-compliance) — these are hard blockers, not style notes.

Also log one short note per page under "Content Quality Notes" in
`/ledgers/build-report.md` — e.g., reading-level adjustments made,
redundancy conflicts found and resolved, or anything flagged and fixed for
factual accuracy. A brief takeaway, not a full re-statement of the page.
