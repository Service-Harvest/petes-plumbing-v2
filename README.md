# Local SEO Website Build Pipeline — Template Repo

This is the reusable template for building a client's local SEO website
entirely through Claude Code, with no CMS/hosting dependency beyond
DataforSEO (research) and Gemini (image generation), hosted on GitHub Pages.

## How to start a new client build

1. Duplicate this template into a new repo (named for the client).
2. Copy `/intake/intake-template.md` to `/intake/intake-completed.md` and fill
   it in completely — see `/pipeline/phase-00-intake.md` for what each field
   needs.
3. Open Claude Code in the new repo and point it at `CLAUDE.md`. It will read
   the phase files in order, validate the intake (Phase 0), and run Phases
   1–3, stopping at the Phase 3 checkpoint for your review.
4. Review the proposed GBP + site structure output, correct anything needed,
   and approve.
5. Claude Code runs Phases 4–13 (including Phase 4a, the design system pass
   right after Phase 4) to completion and reports back with a deployed site
   and a final summary.
6. For any edits after launch, use the relevant Phase 14 sub-flow
   (`/pipeline/phase-14-post-launch/`) rather than re-running the full
   pipeline.

## What's reusable vs. per-client

**Reusable across every client (do not edit per-build):**
- `CLAUDE.md`
- `/pipeline/*` (all phase files)
- `/scripts/validate.js`
- `/scripts/generate-image.js` (Phase 7's Gemini image-generation helper)
- `/.github/workflows/deploy.yml` (validates then deploys `/site/` on push)

**Per-client (created fresh each build):**
- `/intake/intake-completed.md`
- `/ledgers/*` (architecture, anchor ledger, content ledger, build report)
- `/site/*` (the actual pages — plain final HTML, no build step)
- `/snippets/*` — Phase 4 Task 1 generates this fresh for every client,
  populated with that specific client's business name, phone number, nav
  links, and footer content. It does not ship pre-populated in this
  template (there is no `/snippets/` directory here) and a new client's
  copy should never reuse another client's `/snippets/` content. What *is*
  reusable and constant across every client is the underlying markup
  **convention** — the relative-path (`{{ROOT}}`) rule (Task 2), which
  elements must be literal `<nav>`/`<footer>` tags, etc. — which lives in
  `phase-04-repo-scaffold.md` itself, not in a shipped file.

## Prerequisites
- [GitHub CLI](https://cli.github.com/) (`gh`), authenticated, for repo
  creation/pushes and Pages setup in Phase 13.
- Node.js (any reasonably current LTS version), to run
  `node scripts/validate.js` locally in Phase 12/13 — the deploy workflow
  runs it again in CI, but local Node is what lets Claude Code catch a
  failure before ever pushing.

## Environment setup checklist (per machine/session, not per client)

A full build has now been run successfully through this template (a mock
client, end to end, Phase 0 through Phase 13 plus several rounds of
post-launch fixes), so these are no longer unproven — they're just the
one-time environment setup every new session/machine needs before Phase 2
and Phase 7 can do real work instead of falling back to estimates:

- **DataforSEO**: needs `DATAFORSEO_USERNAME`/`DATAFORSEO_PASSWORD` set as
  environment variables reachable by the DataforSEO MCP server. Without
  them, Phase 2/Phase 5 fall back to web search and must label every
  finding "estimated — not DataforSEO-verified" rather than silently
  proceeding as if it were verified data.
- **Gemini API**: needs `GEMINI_API_KEY` set as an environment variable
  before Phase 7 runs, or Phase 4a's favicon and Phase 7's images fall back
  to placeholders (SVG mark, SVG graphics) instead of real generated
  assets — flag this in the Phase 13 report if it happens, don't silently
  ship placeholders as final.
- **GitHub Pages custom domain**: DNS changes for each client's domain
  happen outside this repo, at the domain registrar, once Phase 13 reports
  what's needed. Until DNS is verified, GitHub Pages serves the build at
  its fallback `https://org.github.io/repo-name/` project-subpath URL —
  this is normal and expected, and is exactly why Phase 4 Task 2's
  relative-path convention exists (a root-absolute path 404s under that
  fallback subpath, even though it works fine once the custom domain is
  verified).
