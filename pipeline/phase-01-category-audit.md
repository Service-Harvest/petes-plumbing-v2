# Phase 1 — Category + Service Cleanup Audit

## Purpose
Take the raw GBP category/service list from intake and produce a clean,
deduplicated hierarchy. This hierarchy becomes the backbone of the entire
site architecture and, eventually, the actual live GBP listing.

## Task

Using the raw category/service list from `/intake/intake-completed.md`:

0. Sanity-check the raw GBP category names against real Google Business
   category data using `mcp__dataforseo__business_data_business_listings_search`
   (search on the client's business name + location from intake). Flag any
   raw category from intake that doesn't match a real, current Google
   category name — a stale or informally-worded category is worth catching
   here, before it gets cleaned up and baked into the architecture. This is
   a sanity check, not a redo of the client's category choices.
1. Remove exact duplicates and major overlaps.
2. Keep similar services separate only when customers and Google would likely
   treat them as meaningfully different (don't over-merge just to shorten the
   list).
3. Merge or remove items that are basically the same thing worded differently.
4. Group every remaining service under its correct parent category.
5. Do not over-explain decisions, create homepage-linking notes, or create
   architecture commentary here — that happens in Phase 2/3. This phase is
   purely the cleanup.

## Output format

```
CATEGORIES:
- [Category]
- [Category]

CATEGORY / SERVICE HIERARCHY:
[Category 1 Name]
- [Service]
- [Service]

[Category 2 Name]
- [Service]
- [Service]
```

No primary/secondary or priority split here — this phase produces one clean
hierarchy, nothing else. Which categories/services become priority/
homepage-linked is a judgment call made in Phase 2 (weighing search volume,
competitive landscape, client-fit, and AI/LLM visibility) and finalized in
the Phase 3 checkpoint, not here.

This output feeds directly into Phase 2 (research) and Phase 3 (architecture).
