# Phase 14b — Add a New Service/Category Page

## When to use
The client adds a new service (or category) after launch and wants it on the
site and, typically, on the live GBP listing too.

## Steps (a scoped mini-pipeline, same rigor as the original build, one page)
1. Load `/ledgers/architecture.md` — determine correct placement (new
   category, or a child under an existing category) and update this file
   with the new page's entry.
2. Update the anchor ledger: add new anchor text for the parent↔child
   relationship (and any related-service cross-links), checked for sitewide
   uniqueness exactly as in Phase 3.
3. Run Phase 5 (per-page research) for this one page: competitor gap
   analysis, PAA/forum questions, local factors, one outbound source.
4. Run Phase 6 (content drafting) for this one page, checking the content
   ledger for cross-page redundancy against the existing site.
5. Run Phase 7 (images) for this one page.
6. Run Phase 8 (QA pass) for this one page.
7. Run Phase 9 (schema) for this one page, using the same `@id` conventions
   already established sitewide.
8. Update `sitemap.xml` to include the new page.
9. Update the parent category page (and services hub, and any related pages)
   to add the new in-body contextual link to this page, per the anchor
   ledger.
10. Run `scripts/validate.js` sitewide.
11. Deploy.

## Also report back to the user
Since this may also need to go on the live GBP listing, report the exact
category/service name and where it nests in the hierarchy, formatted the same
way as the original Phase 3 checkpoint output, so it's easy to copy into GBP.
