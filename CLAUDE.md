# Local SEO Website Build Pipeline — Master Instructions

You are building a complete, production-ready local SEO website for a home-service
business, entirely inside this repo, with no external hosting/CMS dependencies
beyond DataforSEO (research) and Gemini (image generation).

This file is the entry point. Read it fully before doing anything else, then work
through the phase files in `/pipeline/` **in numeric order**. Do not skip a phase
or jump ahead. Do not ask the user for approval between phases except at the one
checkpoint explicitly marked below.

## How this repo is organized

```
/intake/intake-completed.md      <- filled-in client intake (input, provided by user)
/pipeline/phase-00-intake.md     <- what the intake must contain, and how to validate it
/pipeline/phase-01-category-audit.md
/pipeline/phase-02-research.md
/pipeline/phase-03-architecture-checkpoint.md   <- THE ONE HUMAN CHECKPOINT
/pipeline/phase-04-repo-scaffold.md
/pipeline/phase-04a-design-system.md
/pipeline/phase-05-per-page-research.md
/pipeline/phase-06-content-drafting.md
/pipeline/phase-07-images.md
/pipeline/phase-08-qa-pass.md
/pipeline/phase-09-schema.md
/pipeline/phase-10-ghl-embeds.md
/pipeline/phase-11-sitemap-technical.md
/pipeline/phase-12-validation-gate.md
/pipeline/phase-13-deploy.md
/pipeline/phase-14-post-launch/14a-single-page-edit.md
/pipeline/phase-14-post-launch/14b-add-new-page.md
/pipeline/phase-14-post-launch/14c-sitewide-fact-update.md

/ledgers/anchor-ledger.md        <- every internal anchor text ever used, generated in Phase 3, updated forever after
/ledgers/content-ledger.md       <- every local detail/angle used per page, generated in Phase 6, updated forever after
/ledgers/architecture.md         <- the approved site architecture from Phase 3 (source of truth for all later phases)
/ledgers/build-report.md         <- connection status and research/QA takeaways, generated in Phase 2, updated forever after

/site/                           <- the actual static site files (final output — plain final HTML, no build step)
/snippets/                       <- shared header/nav/footer reference markup (Phase 4), copied into pages, never served
/.github/workflows/deploy.yml    <- validates then deploys /site/ to GitHub Pages on push (Phase 4/Phase 13)
/scripts/validate.js             <- the Phase 12 build-validation gate, reusable across all clients
```

## Non-negotiable global rules (apply to every phase)

- **No invented facts, ever.** Reviews, ratings, license numbers, years in business,
  pricing, credentials, statistics — only what's in the intake or on the approved
  live content. If something is missing, flag it as a gap, don't fill it in.
- **No client-rendered content.** Output must be plain static HTML with the full
  content present in the initial response — no JS required to see any text, price,
  or CTA. This is the entire reason this pipeline exists (the prior GHL pipeline
  had this problem). Treat any violation of this as a Phase 12 hard failure.
- **Anchor text is never repeated sitewide**, and lives in body copy, not nav/
  footer/headers. See the 6 Golden Rules in `phase-06-content-drafting.md`.
- **Writing voice**: friendly local expert, direct, warm, no jargon, short
  paragraphs, one idea per paragraph, "we"/"you," no corporate-speak, ~8th-grade
  reading level, never patronizing.
- **DataforSEO informs decisions, it does not make them.** Every category/service/
  content decision needs four inputs weighed together: search-volume signal,
  competitive-landscape signal, client-fit signal (from the intake), and
  AI/LLM visibility signal (see `phase-02-research.md`). Never rank-order
  purely by volume.
- **One outbound authoritative link per page**, in-body, from the approved domain
  list in `phase-06-content-drafting.md`.
- **The intake's GBP city is not automatically the geo-target.** That field says
  where the business physically *is*; it does not establish which geography the
  site should *target*, and for a small town or suburb the two are usually
  different. Phase 2 has a required geo-target selection step that compares the
  literal city against the county/metro and the largest approved service-area
  city on volume, natural head-term usage, competition, and AI visibility. Never
  skip it and never take the city field literally by default. When the chosen
  target differs from the physical city, implement it as a hybrid (target geo in
  URLs/titles/H1s; physical city in NAP, schema, and body copy) — never a
  wholesale find-and-replace.
- **Page count mirrors the GBP, not the search volume.** One page per category
  and per service, even when Phase 2 shows most service pages have little or no
  measurable exact-match volume. These pages exist to make the site's service
  list mirror the GBP's, which connects the GBP to the site and builds authority
  for the priority pages that *are* meant to rank. Thin-but-complete is the
  strategy. Do not propose consolidating the page count on volume grounds — see
  the full reasoning in `phase-03-architecture-checkpoint.md`.
- **Ledgers are real files, updated as you go, never held only in working memory.**
  Every later phase (including everything in Phase 14, used months after launch)
  depends on these files being current and complete.
- **A template-level fix discovered mid-build isn't done until it's ported back
  to `pipeline-template/`.** This client folder is a one-time duplicate of
  `pipeline-template/` — the two are separate, non-synced locations on disk;
  editing one never updates the other. If, while working in this client's
  folder, you discover a genuine bug or gap in a phase file, `scripts/
  validate.js`, `scripts/generate-image.js`, `CLAUDE.md` itself, or any other
  file that's supposed to be reusable across every client (as opposed to this
  client's actual business content — their copy, their images, their ledgers,
  which correctly stay client-specific), the fix is not complete once it
  works here. Locate this client's sibling `pipeline-template/` folder (same
  parent directory) and apply the equivalent fix there too, then confirm the
  two copies actually match — diff the specific file(s), or grep
  `pipeline-template/` for language from the fix — the same verification
  approach used to catch and correct this exact failure mode once already
  (an entire session's worth of fixes had accumulated only in a client copy
  before anyone checked). "I fixed it" and "I fixed it and confirmed
  `pipeline-template/` matches" are different claims — only make the second
  one.

## Execution model

The whole build has **exactly one planned interruption: the Phase 3 checkpoint.**
Before it, Phase 0 may pause only to report an incomplete intake. After the
checkpoint is approved, the build runs all the way to a deployed site with **zero
further stops of any kind.** This section is absolute; read it literally.

1. **Phase 0 — intake.** Confirm `/intake/intake-completed.md` exists and is
   complete. If incomplete, stop and list exactly what's missing — do not guess
   or proceed. This is the only pause permitted *before* the checkpoint.

2. **Phases 1–3 — research + the checkpoint.** Run them and produce the Phase 3
   checkpoint output in the GBP-copyable format. **Stop here and wait for
   explicit human approval.** This is the single planned interruption in the
   entire pipeline.

3. **Phases 4–13 — build to a deployed site, no stops.** Once the checkpoint is
   approved, run every phase through deployment **without a single further
   check-in.** No exceptions:
   - **No phase-completion reports.** Do not stop to summarize after Phase 4, 6,
     9, or any phase. Finish a phase and move straight into the next one.
   - **No "should I continue?" / "ready for the next phase?" questions.** The
     answer is always yes, so asking is itself a violation of this model.
   - **No surfacing judgment calls for a decision.** Every phase's choices have a
     documented default — take it and keep moving. If a phase ever seems to lack
     a default, pick the most reasonable option, write down what you chose and
     why in `/ledgers/build-report.md`, and continue. Never pause to ask.
   - **A long phase is still not a reason to stop.** Phase 6 alone is ~46 pages;
     that length is not licence to batch-report or wait for a "continue." Work
     through it in one continuous run.
   - This includes Phase 4a, which runs immediately after Phase 4 and before
     Phase 5.

4. **Anything the human might want to know goes in `/ledgers/build-report.md`,
   never a chat message that waits for a reply.** Notable findings, judgment
   calls made and why, gaps flagged, image substitutions, the Phase 10
   live-popup verification note — all written to the report as you go. The human
   reads the report when the build finishes; they are not watching chat between
   phases.

5. **The human sees exactly two things, ever, for any client:** (a) the Phase 3
   checkpoint awaiting approval, and (b) the final Phase 13 report once the site
   is fully built and deployed. Nothing in between. If you are about to send the
   human anything else, stop — it belongs in the build report instead.

6. **The only manual action the human ever takes is adding DNS records at their
   domain registrar.** Everything else is yours: creating and pushing the repo,
   enabling GitHub Pages, the CNAME, the domain-activation step itself, and the
   post-deploy live-popup check. The Phase 13 report gives them the exact DNS
   records to add — that single hand-off is the only thing you ask of them, and
   it appears only in the final report, not mid-build.

7. Phase 14 sub-flows are invoked separately, on demand, long after initial
   launch.

## A note on session continuity

This build is long-running. If the session is interrupted (computer sleep,
shutdown, crash), files already written to `/site/`, `/ledgers/`, and this repo
are safe — resume by re-reading `/ledgers/architecture.md` and checking which
pages in `/site/` already exist against it, rather than restarting from Phase 1.
