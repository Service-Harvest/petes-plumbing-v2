# Phase 14a — Single-Page Content Edit

## When to use
A client wants a wording change, updated trust signal, changed CTA, or similar
small edit to one existing page. No new pages, no structural change.

## Steps
1. Load `/ledgers/architecture.md` and `/ledgers/anchor-ledger.md` — do not
   rely on conversation memory of the original build; these files are the
   source of truth.
2. Make the requested edit to that page only.
3. If the edit touches or removes an existing internal link/anchor, update
   `/ledgers/anchor-ledger.md` accordingly (remove the old entry, add the new
   one, checking sitewide uniqueness against the ledger as in Phase 3/6).
4. If the edit changes a fact that also appears in that page's schema (e.g., a
   trust signal referenced in a description), update the schema block too.
5. Run `scripts/validate.js` — the full sitewide check, not just this page —
   since a single-page edit can still introduce a sitewide duplicate-anchor
   or broken-link issue.
6. Deploy (commit + push) only after validation passes.

## Output
Confirmation of what changed, validation pass, and deploy confirmation.
