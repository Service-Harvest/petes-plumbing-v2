# Phase 10 — GHL Embed Integration

## Purpose
Insert the GHL-hosted functionality (chat widget, lead form, review widget,
GBP embed) into the finished static site. GHL remains the backend for these
specific features — only the embed snippets live in the static site; nothing
else about GHL integrates here.

## From intake, insert:
- Chat widget embed code — sitewide (every page), placed once near the end
  of `<body>` so it doesn't block rendering of surrounding content.
- Free estimate / lead form embed code — the popup widget itself is
  included once per page, sitewide (same footprint as the chat widget), but
  configured as a **click-triggered** popup (`data-trigger-type="click"`,
  `data-trigger-value` set to a shared CSS selector, e.g.
  `.request-estimate-cta`) rather than an always-show popup. Every existing
  "Request a Free Estimate" (or equivalent free-estimate/lead-form) CTA
  button or link across the site — top-of-page hero CTA, mid-page CTA
  banners, and final CTA banners, on every page — gets that shared trigger
  class added, so clicking any of them opens the same popup in place. Keep
  each CTA's existing `href` (e.g. `/contact` or `#free-estimate`) as a
  graceful-degradation fallback destination in case the popup script fails
  to load — don't replace working links with a bare `#`.
- Google review widget embed code (homepage, and optionally category pages)
- Google Business Profile embed code (homepage, in the placeholder already
  present in the Phase 6 draft)

## Known gotcha: the free-estimate popup's `data-trigger-type="click"` is not
## actually respected by GHL's own script
Setting `data-trigger-type="click"` on the embed (per the bullet above) is
still the correct config to set, but **do not assume it works on its own —
verify it live before considering this phase done.** Confirmed by direct
testing: GHL's `form_embed.js` can auto-create and auto-show the popup's
wrapper/overlay elements on page load regardless of this config value. The
attribute is present and correct in the DOM; the third-party script simply
doesn't honor it. There is no known documented flag that reliably fixes
this — the only verified fix is to stop trusting the embed's own trigger
system and take direct control of the DOM elements it creates:

1. Add a small inline script, sitewide alongside the embed (same place as
   the chat widget script), that uses a `MutationObserver` to detect the
   instant the widget creates or shows its wrapper/overlay elements
   (`#[POPUP_ID]-wrapper` and `#[POPUP_ID]-overlay` — find the exact IDs by
   inspecting the live popup once, since they're derived from the embed's
   own form ID) and immediately force them hidden via
   `style.setProperty("display", "none", "important")`, until a genuine
   click on the shared trigger class (e.g. `.request-estimate-cta`) is
   detected — at which point suppression is lifted for the rest of that
   page view and the popup is allowed to show.
2. **Second gotcha, only visible once you test the click-to-open behavior
   itself**: after suppressing the auto-show, a real click may *still* not
   visibly open the popup. This is because the widget's own injected CSS
   gives its overlay element a default of `display: none` — so merely
   removing your suppression override (e.g. `style.removeProperty("display")`)
   falls back to that same hidden default rather than actually showing it.
   The click handler must explicitly set the display values the widget
   itself uses when it auto-shows (confirmed by inspecting the live DOM
   while the popup was open: `display: flex` on the overlay element,
   `display: block` on the wrapper element) — not just clear your own
   override.

Reference implementation (adapt the `POPUP_ID` and trigger selector, verify
the wrapper/overlay ID suffixes match what the actual embed generates):

```html
<script>
(function () {
  var POPUP_ID = "popup-XXXXXXXXXXXXXXXXXXXXXX"; // match the embed's real form ID
  var allowShow = false;
  function popupEls() {
    return [document.getElementById(POPUP_ID + "-wrapper"), document.getElementById(POPUP_ID + "-overlay")].filter(Boolean);
  }
  function hidePopup() {
    if (allowShow) return;
    popupEls().forEach(function (el) {
      el.style.setProperty("display", "none", "important");
    });
  }
  // The embed can auto-show its wrapper/overlay regardless of the
  // data-trigger-type config above (confirmed by live testing) — suppress
  // that immediately and keep watching, since it can render asynchronously.
  var observer = new MutationObserver(hidePopup);
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["style"] });
  hidePopup();
  [50, 200, 500, 1000, 2000, 4000].forEach(function (ms) { setTimeout(hidePopup, ms); });

  document.addEventListener("click", function (e) {
    if (e.target.closest(".request-estimate-cta")) {
      e.preventDefault();
      allowShow = true;
      popupEls().forEach(function (el) {
        // The widget's own CSS gives its overlay a default of display:none
        // (used to keep it hidden until genuinely opened), so simply
        // removing our override falls back to that same hidden state.
        // Set the display values it actually needs explicitly instead.
        var isOverlay = el.id.indexOf("-overlay") !== -1;
        el.style.setProperty("display", isOverlay ? "flex" : "block", "important");
      });
    }
  });
})();
</script>
```

3. **Verify both behaviors live in-browser before calling this phase
   done** — load a fresh page and confirm the popup does NOT auto-open,
   then click a `.request-estimate-cta` link and confirm it DOES open and
   is visually correct. Don't just confirm the config attribute is present
   in the HTML; that alone doesn't prove the behavior works, per the
   gotcha above.

## Technical check on each embed (before accepting it)
- Does it block rendering of the surrounding page content? If so, load it
  async/deferred so it doesn't compromise the "no client-rendered content"
  requirement for everything around it.
- Does it introduce layout shift? If so, reserve space for it in the layout.
- Does it work without breaking the page if it fails to load (graceful
  degradation, since this is now the one piece of the site that depends on
  an external script)?

## Output
Finished pages with all embeds in place, each checked against the above
before being accepted — flag anything that can't be made to comply cleanly
rather than silently shipping something that violates Layer 1 rules (see
`phase-04-repo-scaffold.md` for the full Layer 1 checklist).
