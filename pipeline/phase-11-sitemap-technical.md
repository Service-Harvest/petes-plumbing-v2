# Phase 11 — Sitemap + Final Technical Pass

## Sitemap
- Generate `sitemap.xml` at the site root, using the final live domain from
  intake (never a preview/temporary domain).
- Include only: homepage, services hub, about, contact, all category pages,
  all service pages. No hash fragments, no query strings, no duplicate
  trailing-slash versions, no mixed www/non-www.
- `<lastmod>` uses today's date for initial launch (accurate going forward —
  only update a page's `lastmod` when that page's content actually changes,
  never fake freshness).

## Canonical check
Every page's canonical tag matches its exact sitemap URL. Fix any mismatch.

## IndexNow
1. On a client's first build, generate a persistent IndexNow key (a random
   32–64 character hex string) and write it, key only, to
   `/site/indexnow-key.txt`. On a later Phase 14 edit, reuse the existing
   key from that file rather than regenerating it — IndexNow ties history to
   the key, so rotating it loses standing with search engines.
2. That's this phase's full responsibility — the actual ping fires
   automatically from the deploy workflow (`.github/workflows/deploy.yml`)
   after every successful publish, using this key file, `/site/CNAME`, and
   `/site/sitemap.xml`. See Phase 13 for confirming the ping succeeded.

## robots.txt / llms.txt final check
Confirm both still reflect the final domain and the deliberate AI-crawler
policy decision made in Phase 4 (not a default/placeholder).

## Output
Final `sitemap.xml`, confirmed canonicals, confirmed robots.txt/llms.txt —
ready for Phase 12's automated validation gate.
