# Phase 7 — Images

## Priority order per page
1. **Client-provided images first**, wherever they genuinely fit (real job
   sites, real team photos, real finished work) — these carry the most trust
   value and should never be replaced by generated images if a real one fits.
2. **Gemini-generated images** for remaining illustrative slots (2–4 images
   per page total, fewer on lower-priority pages to control API cost).
3. **A small number of original SVG graphics** (process diagrams, simple
   icon rows) mixed in specifically to reduce total Gemini API calls — not a
   full substitute for photographic imagery on a ~50-page site.

## Open Graph image
Per the convention established in Phase 4a, one image slot per page (the
LCP/hero image) also serves as that page's Open Graph/Twitter card image.
When generating or placing that specific slot, size/crop it to 1200×630 in
addition to its normal in-page dimensions, so Phase 4's OG tags have a real
asset to point to.

## Honesty rule for generated images
AI-generated images are illustrative/decorative, similar in spirit to stock
photography. Never present a generated image as an actual customer result,
actual team member, or actual job — that would cross from illustration into
a misleading claim. Reserve "our actual work / our actual team" framing
exclusively for client-provided real photos.

## Technical requirements (apply to every image, generated or client-provided)
- Descriptive filename (not `IMG_4782.jpg` or a generic generated-image ID)
- Descriptive, specific alt text (not keyword-stuffed)
- Explicit width/height attributes set in the HTML
- `loading="lazy"` on every image except the page's LCP (largest contentful
  paint) image, which should be preloaded instead
- WebP format where practical, resized/compressed appropriately — do not
  ship an oversized source file
- **Resize by cropping to fill the target box, never by stretching to it.**
  Gemini returns its own native size (commonly a 1024×1024 square) regardless
  of the aspect ratio implied by the prompt or requested dimensions — it does
  not honor an arbitrary target width/height. A naive resize command that
  forces the source directly to the target's exact width AND height (e.g.
  `cwebp -resize <w> <h>` given both dimensions) performs a non-uniform
  stretch, distorting the actual photo content (a circle becomes an ellipse,
  a person's proportions warp) even though the resulting file's pixel
  dimensions technically match what was requested. Instead: scale uniformly
  so the image *covers* the target box (preserving aspect ratio: scale =
  max(targetW/nativeW, targetH/nativeH)), then center-crop to the exact
  target dimensions — the same effect as CSS `object-fit: cover`, baked into
  the file itself (e.g. `sips -z <scaledH> <scaledW>` to uniformly scale,
  then `sips -c <targetH> <targetW>` to center-crop, then `cwebp` for final
  format/quality). If a reusable generation helper script exists in this
  repo's `scripts/` folder, use it rather than re-deriving this by hand —
  check there first before writing a new one.

## Gemini API usage notes
- Model: `gemini-2.5-flash-image`, called via the `generateContent` endpoint.
- `generationConfig.responseModalities` must be set to `["TEXT", "IMAGE"]` —
  this model does not support image-only output, so both must be requested.
- API key read from the `GEMINI_API_KEY` environment variable — never
  hardcode it in a file, and never ask the user to paste it into one.
- Track approximate image count per client build (roughly 100–200 images
  across a ~50-page site at 2–4 per page) — check current Gemini pricing
  before treating "4 images per page" as a fixed default, since cost scales
  directly with page count.
- Generate the image and write its alt text/filename in the same step, so
  Layer 1 image compliance isn't a separate pass done later.
- The first time Gemini is called in this phase, log the outcome under
  "Connection Status" in `/ledgers/build-report.md`: working, or the specific
  failure encountered (quota exceeded, insufficient billing balance, etc.).

## Image generation failures
Not every failure is the same — a rate limit is transient and often clears
in seconds, while a quota/billing failure won't resolve itself mid-build.
Distinguish them before giving up on an image slot:

1. **Retry first.** If the failure is a rate limit (HTTP 429) or another
   plausibly-transient error, retry up to 3 times with a short backoff (e.g.
   ~5s, ~15s, ~30s) before treating the slot as failed. Do not retry on a
   clearly permanent error (quota exhausted, billing balance insufficient,
   invalid request) — treat those as failed immediately, no point burning
   time on a retry that can't succeed.
2. If the slot is still failing after retries (or failed immediately on a
   permanent error), do not halt the pipeline run. Instead:
   a. Substitute an original SVG graphic for that specific image slot
      instead of a photo-style generated image.
   b. Log which page/slot got the SVG substitution, and which failure type
      caused it (transient-after-retries vs. permanent), under "Image Notes"
      in `/ledgers/build-report.md` — this is the running list; it is not
      tracked anywhere else.
   c. Continue the build normally.

At the end of Phase 7, surface the "Image Notes" section of
`/ledgers/build-report.md` to the user (if non-empty), so they know exactly
which images were substituted and can decide whether to regenerate them
later (e.g., after adding more billing balance). The same list is surfaced
again in the Phase 13 final report.

## Output
Every page's final image set, placed by editing that page's existing
`/site/[slug]/index.html` file (written in Phase 6) — filling in each
placeholder `<img data-slot="...">` tag with a real `src` and the technical
fields above, not writing a new file. Ready for Phase 8 QA and Phase 12
validation. Include the image-substitutions list from above (empty if there
were none).
