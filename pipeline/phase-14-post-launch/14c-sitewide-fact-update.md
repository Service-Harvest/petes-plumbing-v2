# Phase 14c — Sitewide Fact Update

## When to use
A single fact changes and appears across many pages and/or many schema
blocks — e.g., phone number change, business name change, new/changed trust
signal, changed service area, updated credential.

## Steps
1. Search the entire `/site/` directory for every occurrence of the old fact
   (visible content AND inside JSON-LD schema blocks — both need updating,
   since schema is not auto-derived from body copy in this pipeline).
2. Produce a list of every file/location that will change before making any
   edits, so the scope is visible before it happens.
3. Apply the update everywhere it appears — visible copy and schema alike.
4. If the change affects the business's identity in a way that could trigger
   GBP re-verification (business name, address, primary category, website
   URL) flag this explicitly to the user — this is a GBP-side consideration,
   not something the site build handles.
5. Update `/intake/intake-completed.md` itself, so future sessions (Phase 14
   or otherwise) start from the corrected fact, not the outdated one.
6. Run `scripts/validate.js` sitewide.
7. Deploy.

## Output
The full list of changed locations, confirmation of validation pass, deploy
confirmation, and (if applicable) the GBP re-verification flag.
