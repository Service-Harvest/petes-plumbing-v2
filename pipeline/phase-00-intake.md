# Phase 0 — Intake Validation

## Purpose
This is the only phase where you're checking work the human did, rather than
doing work yourself. Confirm `/intake/intake-completed.md` is complete before
touching anything else. Nothing downstream should require going back to the user
for more information — if it's not in the intake, the pipeline stalls, so it's
worth being strict here.

## The intake request block — output VERBATIM, do not paraphrase

When the intake is missing or incomplete, output the block below **exactly as
written, word for word**. Do not re-word it, re-order it, summarize it, "improve"
it, or generate a fresh version from the field list that follows. Every client
must see identical wording, so that intake responses are comparable across
clients and nothing silently drifts between sessions.

Copy everything between the `<<<INTAKE-REQUEST` and `INTAKE-REQUEST>>>` markers,
excluding the markers themselves.

```
<<<INTAKE-REQUEST
Please provide the actual details for each field below, and I'll drop them into
intake-completed.md. Anything you don't have yet, just say "skip" and we'll
circle back before Phase 0 passes.

Business Basics
- Business name, domain, GitHub repo name, phone, email
- Street address (or "service-area business, no public address")
- Physical location / GBP city, state, zip
- Service areas (cities/neighborhoods served)

GBP Structure
- Primary GBP category
- Secondary GBP categories (raw list)
- All services (raw list)
- Manual priority overrides, if any

Brand and Voice
- About the business (history, specialties, residential/commercial focus)
- Unique selling points
- Credentials (licenses, insurance, certifications) — include license numbers
  if you have them; we cannot invent or imply any credential not listed here
- Trust signals (4-8)
- Writing voice profile
- Target audience
- Approved writing samples (optional)

Aesthetic Direction
- Overall feel
- Brand colors/fonts/logo file
- Reference sites liked/disliked

Assets
- Client-provided images (with descriptions)
- Logo file
- Social profile URLs

GHL Embed Codes
- Chat widget, lead form, review widget, GBP embed, anything else

CTAs
- Primary and secondary CTA text
- Additional CTA options

Hosting
- Domain registrar access confirmed for future DNS changes (Yes/No)
INTAKE-REQUEST>>>
```

The field list below is the **validation reference** — what "complete" means for
each field when checking the response. It is not a script to read aloud, and it
is not a substitute for the verbatim block above.

## Required intake fields

**Business basics**
- Business name, domain, GitHub repo name, phone, email
- Street address (or "service-area business, no public address")
- Physical location / GBP city, state, zip
- Service areas (cities/neighborhoods served)

**GBP structure (raw, pre-cleanup)**
- Primary GBP category
- All secondary GBP categories (raw list, before Phase 1 cleanup)
- All services (raw list, before Phase 1 cleanup)
- Any manual overrides: services/categories the client wants prioritized
  regardless of what research suggests, and why

**Brand and voice**
- About the business (history, specialties, residential/commercial focus)
- Unique selling points (same-day, emergency, family-owned, licensed, insured,
  warranties, upfront pricing, etc.)
- Credentials (licenses, insurance, certifications — do not invent anything
  not listed here)
- Trust signals (4–8)
- Writing voice profile / tone
- Target audience (homeowners, property managers, urgency level, etc.)
- Any approved writing samples

**Aesthetic direction**
- Overall feel (professional / modern / established / warm / etc.)
- Any specific brand colors, fonts, or logo file
- Any reference sites the client likes or dislikes

**Assets**
- Client-provided images (with notes on what each depicts — job site, team,
  finished work, etc.) — these get priority placement over generated images
  in Phase 7
- Logo file
- Social profile URLs

**GHL embed codes** (these stay on GHL's backend; only the embed snippets
come into the static site)
- Chat widget embed code
- Free estimate / lead form embed code
- Google review widget embed code
- Google Business Profile embed code
- Anything else the client uses GHL for that needs to appear on the site

**CTAs**
- Primary CTA text (e.g., "Call Now")
- Secondary CTA text (e.g., "Request a Free Estimate")

**Hosting**
- Confirm domain registrar access exists for DNS changes later (CNAME to GitHub
  Pages) — this doesn't need to happen now, just confirm it's possible later

## Validation task

Read the intake file. Produce a short pass/fail list:
- ✅ Field present and usable
- ⚠️ Field present but vague/incomplete (explain what's missing)
- ❌ Field missing entirely

If anything is ⚠️ or ❌, stop and report back to the user with a specific,
answerable list of questions — do not proceed to Phase 1 on an incomplete
intake, since every downstream phase assumes this data is solid.
