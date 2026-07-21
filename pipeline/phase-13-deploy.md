# Phase 13 — Deploy + Final Report

## Deploy steps
1. Confirm `scripts/validate.js` has been run locally and passed with zero
   failures. (The deploy workflow re-runs this as a hard gate before
   publishing — see step 3 — but confirm it locally first rather than
   relying on CI to be the first place a failure surfaces.)
2. Confirm `.github/workflows/deploy.yml` is present and unmodified (it
   ships with the template — see Phase 4 Task 14). This is what actually
   publishes the site, since GitHub Pages' native branch/folder settings
   can't serve an arbitrary `/site/` folder directly.
3. Push to the client's GitHub repo, creating it first if needed:
   - All client repos live under the GitHub organization `Service-Harvest`.
   - Check whether the repo already exists remotely under that org, e.g.
     `gh repo view Service-Harvest/[repo-name]`.
   - If it does not exist yet, create it (using the "GitHub repo name" value
     from that client's completed intake file for `[repo-name]`):
     `gh repo create Service-Harvest/[repo-name] --public --source=. --push`
   - If it already exists (e.g. this is a later deploy for the same client,
     not the first one), just commit and push normally instead of trying to
     create it again.
4. Set the repo's Pages source to "GitHub Actions" (a one-time setting per
   repo — skip if already set on a later deploy):
   `gh api repos/Service-Harvest/[repo-name]/pages -X POST -f build_type=workflow`
   Check first with `gh api repos/Service-Harvest/[repo-name]/pages` if
   unsure whether this has already been done; the create call will error
   harmlessly if a Pages site already exists.
5. Confirm the workflow run triggered by the push succeeded — both the
   `validate` job and the `deploy` job (`gh run list`, `gh run view`, or the
   Actions tab). If `validate` fails, `deploy` never runs: fix the specific
   issue(s) it reported, commit, push again, and re-check.
6. Confirm the `CNAME` file (from Phase 4) matches the client's domain
   exactly.
7. Once the site is live (custom domain or the default
   `*.github.io` URL), spot-check real technical SEO/Core Web Vitals with
   the connected DataforSEO MCP tools rather than relying only on the
   static-file checks in Phase 12:
   - `mcp__dataforseo__on_page_lighthouse` on the homepage and at least one
     priority page, for performance/SEO/accessibility scores.
   - `mcp__dataforseo__on_page_instant_pages` on the homepage, to confirm
     the live page renders/crawls as expected (catches anything a static
     file check can't, like a server-level redirect or header issue).
   Report notable scores/issues in the final report below — this is a
   spot-check, not a blocking gate; don't hold up deploy on it, but do flag
   anything that looks clearly wrong (e.g. a failing performance score).
8. **Custom domain connection with canonicalization — a required step, not
   an optional add-on, whenever intake's "Domain" field is a real domain
   and "Domain registrar access confirmed" is Yes.** Skip only if intake
   has no real domain yet (test/placeholder domain) or registrar access
   isn't confirmed — note that explicitly in the final report as a
   follow-up item, don't silently drop it. Otherwise, walk through all of
   the following before considering Phase 13 done:
   a. **Canonical form defaults to apex — do not ask.** Use the apex domain
      (`example.com`) as canonical, with `www` as the redirecting form. Apex is
      simpler for the client to hand out verbally and in ads. Only use `www`
      instead if the intake *explicitly* states a reason to (e.g. an existing
      CDN/email setup that expects it) — that's a documented signal in the
      intake, not a mid-build question. Record which form was used in the final
      report. Never pause to ask the human which they prefer; the execution
      model in `CLAUDE.md` forbids any check-in between the Phase 3 checkpoint
      and the final report.
   b. **The DNS records the client must add go in the final report — this is
      the single manual action the human ever takes in the whole build.** List
      both sets clearly in the report (they happen outside the repo, in the
      client's registrar account, which you cannot access). Do not send them as
      a mid-build chat message and do not wait on them before finishing the
      build; they belong in the Phase 13 report and nowhere else.
      - Apex: four `A` records (host `@` or blank, per their registrar)
        pointing to GitHub Pages' IPs: `185.199.108.153`, `185.199.109.153`,
        `185.199.110.153`, `185.199.111.153`. (`AAAA` records for IPv6 are
        optional, not required.)
      - `www`: one `CNAME` record (host `www`) pointing to
        `[org].github.io` (the GitHub Pages default domain for this repo,
        e.g. `service-harvest.github.io`).
      Both record sets are required regardless of which form is canonical
      — the redirect only works if the non-canonical form also has a real
      DNS record pointing at GitHub Pages.
   c. **Set the custom domain now, and complete verification yourself as a
      deferred tail step — this is your job, not the human's, and it is not a
      check-in.** Set the custom domain via the GitHub Pages API using the
      **canonical** (apex) form:
      `gh api repos/Service-Harvest/[repo-name]/pages -X PUT -f cname=[canonical-domain]`
      It will show unverified until the client's DNS resolves. The final report
      tells the client to add the DNS records (step b) — that is their only
      action. Once those records have propagated (minutes to hours depending on
      registrar/TTL), **you** complete the activation: re-check
      `gh api repos/Service-Harvest/[repo-name]/pages` for
      `protected_domain_state`/verification status and that HTTPS provisioning
      completes (`https_enforced: true`). This finishing pass happens whenever
      you next run after DNS is live; it requires no decision from the human and
      is never a reason to pause the build or ask them anything — their DNS
      action is the only gate, and completing the activation on top of it is
      yours.
   d. **Do not assume the non-canonical form redirects automatically —
      verify it live.** Fetch the non-canonical URL directly (e.g. `curl -I
      https://www.[domain]`) and confirm it returns a real `30x` redirect
      to the canonical domain, not just that both URLs happen to load
      independently (which is a real, different failure mode — GitHub
      Pages requires the custom domain to be actively set to the canonical
      form, via step c, for this redirect to exist at all; without that
      step, the non-canonical form's DNS record resolves but doesn't
      redirect anywhere).
   e. **Confirm canonical tags, `sitemap.xml`, and OG/Twitter meta tags all
      consistently reference the canonical domain form** — they should
      already, since they're built from intake's domain value during
      earlier phases and don't depend on which URL is currently serving
      the site, but re-check post-connection specifically, since this is
      the point a mismatch would actually matter (before DNS is connected,
      a mismatch is invisible; after, it's live).

## Final report to the user
Read the full `/ledgers/build-report.md` and present it to the user in the
final report, alongside everything below.

Report, plainly:
- Total pages built and deployed
- Live GitHub Pages URL (and custom domain URL once DNS is connected)
- Any DNS steps still required on the user's end, spelled out clearly
- If a real domain was connected this deploy: which form is canonical,
  confirmation the non-canonical form's redirect was actually verified
  (not just assumed), and confirmation canonical/sitemap/OG tags match
- Confirmation that the validation gate passed with zero failures
- Any warnings (non-blocking) surfaced during validation, for the user's
  awareness
- The Phase 7 image-substitutions list (if non-empty), so the user knows
  exactly which image slots got an SVG substitution instead of a generated
  image and can decide whether to regenerate them later
- Confirmation that the deploy workflow's IndexNow ping succeeded (check the
  workflow run logs), or a note that it was skipped and why
- The Lighthouse/on-page spot-check results from step 7, and anything
  flagged as worth a closer look
- A short pointer to Phase 14 for any future edits, so the user knows this
  isn't a one-and-done static file — it's an editable repo with a repeatable
  process behind it
