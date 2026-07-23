# Phase 4a — Design System

## Purpose
Nothing before this phase turns the intake's Aesthetic Direction into an
actual look — Phase 4 builds the technical skeleton, Phase 5 onward builds
content. This phase closes that gap: it produces the site's real CSS/
layout, favicon set, and Open Graph image convention, so pages already look
like the client's brand by the time content gets written into them.

Runs once per client, immediately after Phase 4, before Phase 5.

## Task 1 — CSS / layout system
1. Read the intake's Aesthetic Direction section (overall feel, brand
   colors/fonts/logo file, reference sites liked/disliked).
2. Produce a small, consistent design system: color palette (derived from
   the brand colors, with sufficient contrast for body text — WCAG AA
   minimum), typography (heading/body font pairing and a sizing scale),
   spacing/layout grid, and button/CTA/card/section styling used across
   every page template.
   "Consistent and WCAG AA accessible" is the floor, not the target — it
   produces a serviceable but generic result on its own. Build to this
   quality bar by default, regardless of how much aesthetic direction the
   intake provides:
   - **Spacing**: don't stop at a cramped scale. Keep a generous top-tier
     spacing value (roughly 3.5–5.5rem `clamp()`-based) as your ONE unit of
     vertical rhythm — but apply **half of it** as each full-bleed section's
     top+bottom padding, so the gap BETWEEN two adjacent sections totals one
     unit, not two. Every section padding both sides at the full value doubles
     up at each boundary (~7–11rem) and reads as a broken gap, especially where
     backgrounds fail to alternate. Half-unit per side, alternating
     backgrounds, is the fix.
   - **The floor is not the target — reach past generic by default.** The
     baseline below (consistent tokens + WCAG AA) produces a *serviceable but
     bland* result on its own, and with thin intake aesthetic direction it will
     regress straight to that floor unless you deliberately push further. Build
     these in as defaults, not extras, since they cost nothing at runtime
     (pure CSS, no webfonts, no requests): **(a)** a short accent "eyebrow" bar
     above each content-section `<h2>` (`::before`, no markup); **(b)** an
     accent top-border on cards plus a real hover lift; **(c)** actual image
     framing (radius + soft shadow + faint ring) applied to hero/feature
     images via the `hero-media` band — a defined framing style that never
     gets applied is the most common way this regresses; **(d)** a hero that
     is more than a flat gradient — layer a faint CSS dot/grid pattern and a
     soft off-screen accent glow behind the content; **(e)** a display-size
     type jump (larger, tighter-tracked `h1`/`h2`) while staying on the system
     font stack. None of this requires leaving plain static HTML.
   - **Container width**: ~1200–1320px for the structural container is a
     reasonable modern default (vs. older ~1140px conventions), paired with
     a `clamp()`-based side padding so it breathes on ultra-wide screens
     without needing a second breakpoint. Keep long-form body copy narrower
     than the full container (~65–75ch via `max-width` on `p`) for
     readability, independent of how wide the container itself is.
   - **Full-bleed section rhythm**: alternate section background colors
     edge-to-edge (the `<section>` element itself, not just an inner
     `.container`) rather than relying on a single flat, low-contrast
     stripe color — this is what prevents large viewports from reading as
     "boxed" with dead space on either side, more than the container-width
     number itself does.
   - **Typography pairing**: a single system-font stack (per the
     render-blocking rule below) is correct and should stay — but
     differentiate headings from body via weight (700–800), tighter
     letter-spacing (roughly -0.01 to -0.02em) at larger sizes, and a
     clearer size jump, rather than relying on color alone to distinguish
     them.
   - **Depth**: add subtle, low-opacity box-shadows (elevation tiers, e.g.
     a small/medium/large scale) on cards, buttons, and hero/content
     images, plus a modest hover micro-interaction (slight lift + shadow
     increase on buttons/cards) using pure CSS `transition` — no JS. Wrap
     any transform/transition hover treatment in a
     `@media (prefers-reduced-motion: reduce)` override that disables it.
   - **Icons**: simple inline SVG (e.g. via a CSS `mask`/`background`
     data-URI, or literal inline `<svg>` markup) for small decorative
     elements like trust-badge checkmarks are encouraged for visual
     interest — keep them strictly decorative (CSS-injected or
     `aria-hidden`, never given alt text or treated as content), so they
     don't need a Layer 1 image-compliance pass.
   - Re-verify WCAG AA contrast after applying weight/letter-spacing/depth
     changes — those shouldn't change contrast ratios (contrast is a
     function of color, not weight), but confirm rather than assume,
     especially if a client's real brand colors are introduced later.
   - **Button text colour must never be overridable by a section-context
     link rule.** A blanket dark-band rule like `.section-deep a { color:#fff }`
     out-specifies `.btn-secondary`'s own text colour and renders a
     white-background button white-on-white at rest (visible only on
     `:hover`, where the hover rule wins) — a real shipped bug. Scope any
     "make links light on the dark band" rule to exclude buttons, e.g.
     `.section-deep a:not(.btn) { color:#fff }`, so every button keeps its
     own legible colour pairing in every section context. `scripts/
     validate.js` enforces this: it computes the resting-state contrast of
     each button variant against its background *including the colour it
     would inherit inside `.section-deep`*, and hard-fails below WCAG AA
     (3:1 for buttons). The check is the durable backstop — this CSS
     (`main.css`) is generated fresh per client, so the guarantee lives in
     the shared validator, not in any one client's stylesheet.
   - **Button sizing is content/padding-driven — never a fixed width, and the
     label always stays inside the button's edges.** The base `.btn` class
     sizes itself from its own padding + text (`display:inline-flex` +
     `padding`), never a hard `width`/`min-width`. That alone is not enough:
     a long label, a tight flex container, or a longer business name on a CTA
     can still push text past the button's edges. Build these four guards into
     the base `.btn` rule as standing defaults so it holds for *any* label at
     *any* width: `max-width:100%` (never wider than its container),
     `min-width:0` (a flex-item button may shrink so its content wraps instead
     of forcing overflow), `white-space:normal` (the label wraps to a second
     line rather than spilling out), and `overflow-wrap:break-word` (a single
     over-long token breaks instead of overflowing). **Never put
     `white-space:nowrap` on a button** (header CTA included) — it forces the
     label to overflow its box rather than wrap, which is exactly the shipped
     "button text spilling off its edges" bug this prevents. Any per-context
     button styling (header CTA, hero CTA row, dark-band CTA) inherits this
     base rule; don't reintroduce a fixed width or `nowrap` to "tidy up" one
     placement.
3. Implement this as a single stylesheet at `/site/assets/css/main.css`,
   linked identically from every page's `<head>` (a plain `<link
   rel="stylesheet">` reference — no build step needed to share one static
   file across many pages). Never page-specific inline styling that would
   have to be maintained separately per page. Keep the nav/footer markup in
   `/snippets/` (Task 1's structure) and this stylesheet's classes in sync.
4. Keep it render-blocking-free per Phase 4 Task 13: inline critical CSS or
   a single minimal stylesheet, no heavy framework, no `@import` chains.
5. If "liked" reference sites were listed in intake, use them for
   directional inspiration only (layout rhythm, tone, spacing) — never copy
   their actual content, code, or distinctive visual identity.

## Task 2 — Favicon set
1. If a logo file was provided in intake, derive the favicon set from it:
   export the standard sizes/formats (16×16, 32×32, 180×180 apple-touch-icon,
   plus a web app manifest icon set if applicable).
2. If no logo file was provided, generate a simple, brand-appropriate icon
   via Gemini (e.g., a monogram or simple mark using the palette from Task
   1) instead. Flag this in the Phase 13 final report as a placeholder — a
   generated favicon is not a substitute for the client's real brand mark,
   and the client should replace it once a logo exists.
3. Place the complete set where the Phase 4 template's `<link rel="icon">`
   tags already point.

## Task 3 — Open Graph image convention
1. Establish, per page type (homepage, category, service, about, contact),
   which image slot serves as that page's Open Graph/Twitter card image.
   Default convention: each page's designated LCP/hero image doubles as its
   OG image, sized/cropped to 1200×630.
2. Record this convention (a short note is enough — it doesn't need its own
   ledger) so that Phase 7 generates/sizes that specific image slot with OG
   usage in mind on every page, and Phase 4's OG tags have a real image to
   point to once Phase 7 runs.

## Output
A working CSS/layout system applied across every Phase 4 template partial,
a complete favicon set in place, and a documented OG-image convention —
ready for Phase 5 research and Phase 6 content to be dropped into a site
that already looks and feels like the client's brand.
