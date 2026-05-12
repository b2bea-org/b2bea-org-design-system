# Component State Matrix

This matrix defines the states a designer should specify before the design system is considered production-ready.

## Contrast targets (enforced by L1 / L2 audit)

Every token pair below is checked by `checks/audit-contrast.mjs` (L1) against the threshold listed in `b2bea.design.json` → `audit.contrastPairs`. Component compositions in shipped HTML are re-checked by `checks/audit-a11y.mjs` (L2) at a 3:1 floor. Designers should treat these as the minimum bar to meet for each component variant.

| Pair | Token (fg / bg) | Kind | Minimum ratio | Reason |
|---|---|---|---|---|
| Body text on page | text / background | text | 4.5:1 | Body copy on white |
| Body text on tinted surface | text / surface | text | 4.5:1 | Body copy on `b2bea-color-surface` |
| Body text on card | text / card | text | 4.5:1 | Body copy inside `b2bea-card` |
| Muted text on page | muted / background | text | 4.5:1 | Helper/meta copy on white |
| Muted text on tinted surface | muted / surface | text | 4.5:1 | Helper/meta copy on `b2bea-color-surface` |
| Muted text on card | muted / card | text | 4.5:1 | Helper/meta copy inside `b2bea-card` |
| Primary text on page | primary / background | text | 4.5:1 | Links, outline-button labels |
| Primary text on card | primary / card | text | 4.5:1 | Primary-color labels inside cards |
| Inverse text on navy | inverse / primary | text | 4.5:1 | Hero copy, primary-button labels, footer copy |
| Inverse text on primary-hover | inverse / primaryHover | text | 4.5:1 | Primary button label during hover |
| Accent button label | inverse / accent | large-text | 3.0:1 | 14px bold CTA on `b2bea-color-accent` |
| Accent button label on hover | inverse / accentHover | large-text | 3.0:1 | 14px bold CTA during hover |
| Primary default vs hover | primary / primaryHover | ui-state | 3.0:1 | Affordance: hover must be perceptibly different from default |
| Accent default vs hover | accent / accentHover | ui-state | 3.0:1 | Affordance: hover must be perceptibly different from default |

State-change pairs (`ui-state`) follow WCAG 2.1 § 1.4.11 (non-text contrast for state differences). Mid-luminance brand colors (coral) cannot achieve 3:1 with a small darken — `accentHover` is therefore committed at `#781814` (deep coral-burgundy). If the designer prefers a different affordance (border addition, outline, scale), the pair can be relaxed via a `minRatio` override in `audit.contrastPairs` with a written reason.

## Icons (`b2bea-icon`)

Icon library: [Lucide](https://lucide.dev), ISC-licensed, vendored as a single SVG sprite at `icons/lucide/sprite.svg`. The available starter set is enumerated in `b2bea.design.json` → `iconography.available` (12 icons today: search, menu, x, chevron-right, chevron-down, check, alert-triangle, info, user, users, calendar, external-link). To add more, follow the 3-step procedure in `icons/README.md`.

### Sizes

| Class | Width × Height | Use |
|---|---|---|
| `b2bea-icon` | 1em × 1em | Default — scales with surrounding text |
| `b2bea-icon b2bea-icon--lg` | 1.5em × 1.5em | Section headers, prominent affordances |
| `b2bea-icon b2bea-icon--xl` | 2em × 2em | Hero callouts, large empty-state illustrations |

### Color

The SVG stroke is `currentColor` — the icon picks up the parent element's `color`. To color an icon, set the parent's `color` (via a token: `var(--b2bea-color-primary)`, `accent`, `muted`, etc.); the icon follows. Don't try to set `fill` or `stroke` directly on the `<svg>` — that breaks the inheritance contract and the audit can't reason about it.

### Accessibility patterns (audit-enforced)

| Role of the icon | Required markup |
|---|---|
| Decorative (paired with visible text) | `<svg class="b2bea-icon" aria-hidden="true">…</svg>` — hide from assistive tech; the paired text carries meaning. |
| Icon-only interactive (`<button>`/`<a>` with no visible text) | `<button aria-label="Search"><svg class="b2bea-icon" aria-hidden="true">…</svg></button>` — `aria-label` on the parent. The L2 audit (`checks/audit-a11y.mjs`) fails the build if this is missing. |
| Meaningful icon, no paired text | `<svg class="b2bea-icon" role="img" aria-label="Verified">…</svg>` — `role="img"` makes assistive tech treat the SVG as a labeled image. |

### Adding a new icon (3 steps)

1. Pick the icon from [lucide.dev](https://lucide.dev) and note its kebab-case name.
2. Fetch its SVG from `https://unpkg.com/lucide-static@latest/icons/<name>.svg` and copy the inner content (paths, circles, rects) into `icons/lucide/sprite.svg` as a new `<symbol id="lucide-<name>" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">…</symbol>`.
3. Add `"<name>"` to `b2bea.design.json` → `iconography.available` so the contract reflects what's shipped.

## Buttons

| Variant | Default | Hover | Focus | Active | Disabled | Loading |
|---|---|---|---|---|---|---|
| Primary | Navy fill (#00196C), white text. | Lighter cornflower fill (#4D6CDB, 3.29:1 vs default — passes strict ui-state). | Blue focus ring (box-shadow). | Slightly pressed (translateY). | Muted fill/text. | Spinner via `[aria-busy="true"]`. |
| Accent | Coral fill (#EB5444), white text. | Deep darkened coral (#B0382A) — fill-only state change, no outline. White text contrast holds at 6.1:1; state-change vs default is ~1.7:1 (the audit floor is **relaxed to 1.5:1** because the brand's mid-luminance coral can't hit a strict 3:1 fill-to-fill delta while keeping white text readable on the hover — see the `accent vs accentHover` entry in `audit.contrastPairs` for the written reason). | Blue focus ring (box-shadow). | Slightly pressed. | Muted fill/text. | Spinner via `[aria-busy="true"]`. |
| Outline | White fill, border, blue text. | Muted surface. | Blue focus ring. | Pressed border. | Muted border/text. | Spinner or progress label. |
| Ghost | Transparent, muted/blue text. | Muted surface. | Blue focus ring. | Pressed surface. | Muted text. | Spinner or progress label. |

## Fields

| State | Required Design |
|---|---|
| Default | White background, border, 14px text, 2.5rem min height. |
| Hover | Slight border emphasis or surface change. |
| Focus | Blue border and 3px focus ring. |
| Disabled | Muted text, disabled cursor, no interaction ambiguity. |
| Error | Error border, concise message, accessible relationship. |
| Success | Optional positive confirmation when useful. |
| Help | Helper text under field, smaller muted text. |

## Search And Filters

| State | Required Design |
|---|---|
| Empty | Clear placeholder and optional icon. |
| Focused | Same focus contract as fields. |
| Populated | Clear affordance to remove text. |
| Loading | Inline spinner/skeleton without layout shift. |
| No results | Empty state with reset action. |
| Active filter | Primary blue pill with white text. |
| Inactive filter | White pill with muted text and border. |

## Cards

| State | Required Design |
|---|---|
| Static | Border, radius, white background, subtle shadow. |
| Clickable | Hover border/elevation; no jumpy layout. |
| Selected | Clear selected border or surface. |
| Disabled | Muted, no misleading hover. |
| Loading | Skeleton that preserves card dimensions. |
| Error | Inline recovery action or message. |

## Tables

| State | Required Design |
|---|---|
| Default | Clear header, readable cells, dividers. |
| Dense | Admin-safe compact density without cramped text. |
| Hover | Row hover for scannability. |
| Selected | Selected row state. |
| Empty | Table-level empty state. |
| Loading | Skeleton rows or progress state. |
| Error | Retry action and error explanation. |

## Page States

| State | Required Design |
|---|---|
| Loading | Does not flash unstyled content or collapse layout. |
| Empty | Explains what is missing and offers next action. |
| Error | Explains what failed and what to do. |
| Permission denied | Clear ownership/access message. |
| Success | Confirmation after important mutations. |

## Marketing Home Hero (`b2bea-page-hero--home`)

Only permitted in files declaring `<!-- b2bea:exception=home_hero -->`. The audit script enforces this.

| State | Required Design |
|---|---|
| Default | Marketing-scale clamp (3rem → 6rem). Navy background, white text. |
| With sub-CTA | Two buttons side by side; collapse to stacked on mobile. |
| Mobile | Title wraps without overflow; padding tightens; CTAs go full-width. |

## Marketing Nav (`b2bea-marketing-nav`)

| State | Required Design |
|---|---|
| Default | White surface, brand left, links center, actions right. |
| Active link | Bold/primary color treatment for the current section. |
| Mobile | Links collapse behind a menu; brand + primary CTA stay visible. |

## Stat Strip (`b2bea-stat-strip`)

| State | Required Design |
|---|---|
| Default | 3–4 stats, large display value, muted label. |
| On navy | Values use inverse color, labels use 70% white. |
| Loading | Skeleton block for value + label, preserves layout. |
| Mobile | Wraps to two columns then one, never crops digits. |

## Persona Selector (`b2bea-persona-selector`)

| State | Required Design |
|---|---|
| Default | Tile grid, single border, icon block, label, sublabel. |
| Hover | Lift via shadow + 2px translate. |
| Focus | Blue focus ring; outline must not be removed. |
| Selected | Primary border + subtle background tint. |
| Disabled | Muted text, no hover lift. |

## People Card (`b2bea-people-card`)

| State | Required Design |
|---|---|
| Default | Avatar + name + role + tagline. Card chrome from `b2bea-card`. |
| With link | Whole card becomes clickable; same hover as `b2bea-card`. |
| Missing avatar | Initial-circle fallback on neutral surface. |
| Loading | Skeleton circle + two skeleton lines. |
| Empty | Suppress card; render section-level empty state instead. |

## Testimonial (`b2bea-testimonial`)

| State | Required Design |
|---|---|
| Default | Display-weight quote left, attribution right with photo. |
| Without photo | Initial-circle stands in for the photo. |
| Mobile | Single column; attribution sits under the quote. |

## Resource Card (`b2bea-resource-card`)

| State | Required Design |
|---|---|
| Default | Media block, category eyebrow (coral), title, excerpt, footer. |
| Hover | Border emphasis + 2px lift; no jumping layout. |
| Focus | Blue focus ring on the wrapping link. |
| Loading | Skeleton media + skeleton lines. |
| Empty | Section-level `b2bea-empty` rather than empty cards. |
| Error | Inline `b2bea-alert--error` with a retry. |

## Marketing Footer (`b2bea-footer`)

| State | Required Design |
|---|---|
| Default | Navy surface, brand + 3–4 link columns + legal line. |
| Mobile | Columns stack; legal line stays at the bottom. |

## App Shell (`b2bea-app-shell`, `b2bea-app-topbar`, `b2bea-app-sidebar`, `b2bea-app-content`)

| State | Required Design |
|---|---|
| Default | Top-bar fixed; sidebar 16rem; content fills remainder. |
| Sidebar collapsed | Sidebar narrows to icon rail; content reflows. |
| Mobile | Sidebar hides; menu toggle in top-bar reveals it as overlay. |
| Topbar search | Same focus contract as `b2bea-search`; centered, max 28rem. |
| Sidebar active item | Tinted background + primary color text. |
| Sidebar disabled item | Muted text, no hover background. |

## Operational Page Header (`b2bea-page-header`)

| State | Required Design |
|---|---|
| Default | Eyebrow + 1.5–1.875rem title; never marketing-scale. |
| With actions | Title left, action buttons right; collapses to stacked on mobile. |
| With breadcrumb | Breadcrumb sits in the eyebrow slot; primary action stays right. |
| Loading | Skeleton replaces title; eyebrow stays for context. |

## KPI (`b2bea-kpi`)

| State | Required Design |
|---|---|
| Default | Label (caps), large value, optional delta line. |
| Positive delta | `b2bea-kpi__delta--up` arrow; muted color. |
| Negative delta | `b2bea-kpi__delta--down` arrow; coral text. |
| Loading | Skeleton bars for value and label. |
| Empty | Em-dash for value; explainer for label. |

## Activity Row (`b2bea-activity-row`)

| State | Required Design |
|---|---|
| Default | Icon + actor + verb + object + time. |
| Hover | No layout shift; subtle background tint optional. |
| Loading | Skeleton icon + two text lines + time. |
| Empty | Use `b2bea-empty` at the section level. |
| Error | `b2bea-alert--error` with retry. |

## Action List (`b2bea-action-list`)

| State | Required Design |
|---|---|
| Default | Icon + label + arrow, single-row links. |
| Hover | Surface tint + border emphasis. |
| Focus | Blue focus ring. |
| Disabled | Muted text, no hover. |

## Checkbox (`b2bea-checkbox`)

Native `<input type="checkbox">` styled via `appearance: none`. Always paired with a `<label>` whose `for` attribute matches the input's `id`.

| State | Required Design |
|---|---|
| Default | 1.125rem square, border in `--b2bea-color-border`, transparent fill. |
| Hover | Border shifts to primary. |
| Focus | Blue focus ring; border becomes primary. |
| Checked | Primary fill, inverse-white checkmark (SVG-as-background-image). |
| Disabled | Opacity 0.5, no hover; cursor `not-allowed`. |
| Checked + disabled | Filled but muted (combined opacity 0.5). |

## Radio (`b2bea-radio`)

Same approach as checkbox. Group siblings via a shared `name` attribute. Native arrow-key cycling within the group.

| State | Required Design |
|---|---|
| Default | 1.125rem circle, border in `--b2bea-color-border`, transparent fill. |
| Hover | Border shifts to primary. |
| Focus | Blue focus ring; border becomes primary. |
| Checked | Primary fill, inverse-white dot. |
| Disabled | Opacity 0.5; cursor `not-allowed`. |

## Toggle (`b2bea-toggle`)

Styled `<input type="checkbox">` rendered as a sliding pill (2.5rem × 1.375rem). Treat as on/off semantics, not as a checkbox conceptually.

| State | Required Design |
|---|---|
| Off (unchecked) | Surface border, 1rem muted thumb on left. |
| On (checked) | Primary fill, white thumb slides right (1.125rem translate). |
| Focus | Blue focus ring around the pill. |
| Disabled | Opacity 0.5; no hover; cursor `not-allowed`. |

## Slider (`b2bea-slider`)

Native `<input type="range">` styled across `::-webkit-slider-thumb`, `::-moz-range-thumb`, `::-webkit-slider-runnable-track`, `::-moz-range-track`.

| State | Required Design |
|---|---|
| Default | 0.25rem track in `--b2bea-color-border`; 1.125rem primary thumb with 2px white inset border. |
| Focus | Focus ring on the thumb (via `::-webkit-slider-thumb` / `::-moz-range-thumb`). |
| Disabled | Opacity 0.5; cursor `not-allowed`. |

## Date / Time / Range fields

Native `<input type="date|time|range">` with `.b2bea-field` (for date/time) or `.b2bea-slider` (for range). Browser provides the picker UI; cross-browser visual variance is accepted. Use `.b2bea-label` above and `.b2bea-help` below for form composition.

## Form composition (`b2bea-label`, `b2bea-help`, `b2bea-field-row`)

| Class | Role |
|---|---|
| `b2bea-label` | Block label above an input. 0.875rem, 700 weight, `--b2bea-color-text`. |
| `b2bea-help` | Muted helper text below an input. 0.8125rem, `--b2bea-color-muted`. |
| `b2bea-field-row` | Flex row for inline label + control (e.g., checkbox row). |

## Prose (`b2bea-prose`)

Long-form body text wrapper. Constrains line length to `65ch`, sets vertical rhythm via `> * + *`, styles `h2`/`h3`/`a`/`ul`/`ol`/`code`. Use on editorial pages, academy articles, terms/privacy/about.

## Grid (`b2bea-grid`)

Responsive auto-fit grid. Tune the minimum column width per usage:

```html
<div class="b2bea-grid" style="--b2bea-grid-min: 14rem;">…</div>
```

Default `--b2bea-grid-min` is `16rem`; gap is `--b2bea-space-5`.

## Toolbar (`b2bea-toolbar`)

Horizontal control bar that wraps on narrow widths. Use for "search field + filter pills + sort button" patterns above tables/lists. No states of its own — children supply their own states.

## Accordion (`b2bea-accordion`)

Native `<details>`/`<summary>` with card chrome. Zero JS; keyboard space/enter to toggle. Chevron rotates via the `[open]` selector.

| State | Required Design |
|---|---|
| Collapsed (default) | Border + radius + card background; chevron points down. |
| Open | Same chrome; chevron rotates 180° to point up; body padded below. |
| Hover (summary) | Summary text shifts to primary. |
| Focus (summary) | Focus ring on the summary. |

Markup:

```html
<details class="b2bea-accordion" open>
  <summary class="b2bea-accordion__summary">
    Question text
    <svg class="b2bea-icon b2bea-accordion__chevron" aria-hidden="true">
      <use href="../icons/lucide/sprite.svg#lucide-chevron-down"/>
    </svg>
  </summary>
  <div class="b2bea-accordion__body">Answer text.</div>
</details>
```

## Tabs (`b2bea-tabs`)

Pure-CSS radio-input tabs with position-based panel reveal. Native arrow-key cycling. Up to 6 tabs per group via the `:nth-of-type(1..6)` rules in `b2bea.css`.

| State | Required Design |
|---|---|
| Inactive tab | Muted text, transparent bottom border. |
| Active tab (`:checked`) | Primary text, 2px primary bottom border. |
| Hover | Tab text shifts to primary. |
| Focus | Focus ring on the tab label (via the hidden radio's focus). |

Markup contract:

```html
<div class="b2bea-tabs">
  <div class="b2bea-tabs__list" role="tablist" aria-label="…">
    <input type="radio" id="t-1" name="tabs-X" class="b2bea-tabs__radio" checked>
    <label for="t-1" class="b2bea-tabs__tab">Tab 1</label>
    <input type="radio" id="t-2" name="tabs-X" class="b2bea-tabs__radio">
    <label for="t-2" class="b2bea-tabs__tab">Tab 2</label>
  </div>
  <section class="b2bea-tabs__panel">…content 1…</section>
  <section class="b2bea-tabs__panel">…content 2…</section>
</div>
```

**JS hookup contract (optional, for full ARIA tabs):** the pure-CSS pattern offers visual tabs and native radio keyboard nav, but doesn't implement the ARIA tabs pattern (roving `tabindex`, manual activation distinct from selection, `role="tab"`/`role="tabpanel"` semantics, `aria-controls`/`aria-selected` synchronization). To upgrade, add JS that (1) hides the radios from AT via `tabindex="-1"` + `aria-hidden="true"`, (2) adds `role="tab"`/`role="tabpanel"` semantics to labels and panels, (3) implements arrow-key roving tabindex on labels, (4) syncs `aria-selected` and `aria-controls`. The CSS contract stays unchanged.

## Breadcrumb (`b2bea-breadcrumb`)

Always wrap in `<nav aria-label="Breadcrumb">`. Items are `<li class="b2bea-breadcrumb__item">`; the current page item uses `aria-current="page"` and `.b2bea-breadcrumb__item--current` (no link, bold, `--b2bea-color-text`).

| State | Required Design |
|---|---|
| Item link | Muted text; chevron-right separator after (via `::after`). |
| Item hover | Primary text; underline. |
| Current page | `--b2bea-color-text`, 700 weight; no separator after. |

## Pagination (`b2bea-pagination`)

Always wrap in `<nav aria-label="Pagination">`. Current page uses `aria-current="page"` + `.b2bea-pagination__item--current`. Unavailable prev/next uses `aria-disabled="true"` + `.b2bea-pagination__item--disabled`.

| State | Required Design |
|---|---|
| Default item | Min 2.25rem square, transparent background, `--b2bea-color-text`. |
| Hover | `--b2bea-color-surface` fill, border in `--b2bea-color-border`. |
| Focus | Blue focus ring. |
| Current | Primary fill, inverse-white text, `cursor: default`. |
| Disabled | Opacity 0.4; `pointer-events: none`; cursor `not-allowed`. |
| Ellipsis | `.b2bea-pagination__ellipsis` span; muted color; not interactive. |

## Modal (`b2bea-modal`)

Apply to a native `<dialog>` element. Inside, a `<form method="dialog">` wraps the header (with close button), body, and footer. Backdrop styled via `::backdrop`.

| State | Required Design |
|---|---|
| Open | Centered overlay, `box-shadow-md`, max-width 32rem, max-height 80vh, body scrolls. |
| Backdrop | Semi-transparent navy (`--b2bea-backdrop`). |
| Close (form submit) | Native `<form method="dialog">` submit; no JS needed. |

**Opening mechanisms (consumer's choice):**

| Mechanism | Notes |
|---|---|
| `<dialog open>` attribute | Always-visible; no focus trap, no backdrop dimming. Useful for design-board demos and inline modals. |
| `<button popovertarget="…">` + `<div popover>` | Baseline 2024. Pure HTML, ESC dismiss, click-outside dismiss with `popover="auto"`. |
| `dialog.showModal()` from JS | Full focus trap, backdrop dimming, ESC dismiss. The conventional production path. |

The CSS contract is the same across all three; only the trigger differs.

## Tooltip (`b2bea-tooltip`)

Wrapping `<span class="b2bea-tooltip">` around the trigger; sibling `<span class="b2bea-tooltip__bubble" role="tooltip">` is the bubble. Pure CSS — `:hover` and `:focus-within` show the bubble.

| State | Required Design |
|---|---|
| Default | Bubble has opacity 0, slight Y-offset, `pointer-events: none`. |
| Hover or focus-within | Opacity 1, settles to position; transition 120ms. |
| Bubble look | `--b2bea-color-text` background, inverse text, 0.75rem, 600 weight; arrow via `::after`. |

**Documented limits:**
- **Touch devices**: no `:hover`, so the tooltip never shows. For mobile-critical tooltips, render the content statically below the trigger instead (a `<p class="b2bea-help">`-style affordance).
- **Screen readers**: pure-CSS tooltips aren't reliably announced. Always set `aria-describedby` on the trigger pointing at the bubble's `id`, so AT announces the bubble text when the trigger is focused. The audit doesn't enforce this — designer/dev responsibility.

**JS hookup contract (optional, for full a11y):** swap the CSS-only show/hide for a JS-driven open/close that (1) opens on `pointerenter`, `focus`, and (on touch) a tap of the trigger; (2) closes on `pointerleave`, `blur`, ESC, and click-outside; (3) sets `aria-expanded` on the trigger; (4) optionally uses the new HTML `popover` API + anchor positioning for proper layering and viewport collision. CSS stays unchanged.

## Toast (`b2bea-toast`, `b2bea-toast-region`)

Region is `<div class="b2bea-toast-region" aria-live="polite" aria-atomic="true">`, positioned fixed bottom-right with `flex-direction: column-reverse` so newer toasts stack on top. Each toast is `<div class="b2bea-toast" role="status">` with an icon, body (title + message), and optional dismiss button.

| Variant | Use |
|---|---|
| Default (no variant class) | Informational. Border-left in primary; icon in primary. |
| `b2bea-toast--success` | Confirmation. Border-left + icon in `--b2bea-color-success` (green). |
| `b2bea-toast--warning` | Caution. Border-left + icon in `--b2bea-color-warning` (amber). |
| `b2bea-toast--error` | Failure. Border-left + icon in `--b2bea-color-accent` (coral). |

| State | Required Design |
|---|---|
| Visible | Card background, shadow-md, 4px left border in the variant color. |
| Dismiss button | Ghost-style icon-only `<button aria-label>`; hover shifts to surface. |

**JS hookup contract (documented, not shipped):**

- **Show**: append a `<div class="b2bea-toast" role="status">…</div>` to `.b2bea-toast-region`. The `aria-live="polite"` region announces the addition.
- **Dismiss**: remove the node from the DOM. Add an optional CSS exit animation by transitioning `opacity` and `transform`.
- **Auto-hide**: `setTimeout(() => node.remove(), 5000)` is the typical default. Pause the timer on hover/focus.
- **Queue cap**: cap visible toasts at N (e.g., 3). On overflow, remove the oldest (the bottom-most given `column-reverse`).
- **Don't ship JS in the design system**: this lives in the consumer (your app's framework). The CSS provides only the visual contract.

## Spinner (`b2bea-spinner`)

Standalone CSS spinner extracted from the `[aria-busy="true"]::before` pattern. Color via `currentColor`; size via the variant classes.

| Class | Size |
|---|---|
| `b2bea-spinner` | 1em × 1em |
| `b2bea-spinner b2bea-spinner--lg` | 1.5em × 1.5em |
| `b2bea-spinner b2bea-spinner--xl` | 2em × 2em |

Wrap with `role="status"` and `aria-label="Loading"` for screen reader announcement. The legacy `<button aria-busy="true">` hook is unchanged and still renders the shimmer.

