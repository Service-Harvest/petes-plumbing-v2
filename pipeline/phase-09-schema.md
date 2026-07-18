# Phase 9 — Schema Generation

## Purpose
Generate JSON-LD schema for every indexable page, using only final,
QA-approved visible content and the approved architecture — schema is
generated last, after content is locked, never before.

## Rules
- Only include facts from the intake, the architecture, or content actually
  visible on the page. Never invent owner names, license numbers, ratings,
  review counts, hours, prices, service areas, certifications, or awards.
- Consistent `@id` values sitewide:
  - Business: `https://[domain]/#business`
  - Website: `https://[domain]/#website`
  - WebPage: `https://[domain]/[page-url]#webpage`
  - Service: `https://[domain]/[page-url]#service`
  - Breadcrumb: `https://[domain]/[page-url]#breadcrumb`
  - FAQ: `https://[domain]/[page-url]#faq`

## Schema by page type
- **Homepage**: LocalBusiness (most specific subtype), WebSite, WebPage,
  BreadcrumbList, FAQPage (only if FAQs are visible).
- **Services hub**: CollectionPage or WebPage, ItemList, BreadcrumbList,
  LocalBusiness reference.
- **Category/service pages**: Service, WebPage, BreadcrumbList, FAQPage (only
  if visible).
- **About**: AboutPage, WebPage, BreadcrumbList, LocalBusiness reference,
  Person schema only if real owner/team info is provided.
- **Contact**: ContactPage, WebPage, BreadcrumbList, LocalBusiness reference.

## Never use
Product schema (no ecommerce pages), Article schema (no blog/article pages),
Review schema or AggregateRating unless real, visible, approved review data
exists.

## Breadcrumb structure
Home → Services → [Category] → [Child Service], matching the architecture's
parent/child relationships exactly.

## Service schema fields
`name`, `serviceType`, `url`, `description`, `provider` (referencing the
business `@id`), `areaServed` (from intake service areas). No offers/pricing/
availability unless explicitly provided.

## Output
Schema manifest, one block per URL, in valid JSON-LD, inserted directly into
that page's existing `/site/[slug]/index.html` file (written in Phase 6,
already carrying its Phase 7 images) — editing the `<head>` of the file
that's already there, not installed via a third party and not a new file.

## Final validation checklist (confirm before moving to Phase 10)
- Every URL in the architecture has schema
- Same business/website `@id` used everywhere
- Every page has BreadcrumbList
- Every category/service page has Service schema
- FAQPage schema only where FAQs are actually visible
- No Review, Product, or Article schema present
- No invented facts anywhere in the schema
