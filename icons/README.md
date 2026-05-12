# Icons

The design system uses [Lucide](https://lucide.dev) icons, vendored as a single SVG sprite at `lucide/sprite.svg`. No npm dependency — the icons ship as a static asset alongside `b2bea.css`.

## Available icons

The starter set is enumerated in `b2bea.design.json` → `iconography.available`. As of this writing:

`search`, `menu`, `x`, `chevron-right`, `chevron-down`, `check`, `alert-triangle`, `info`, `user`, `users`, `calendar`, `external-link`.

## Usage

Three markup patterns, depending on the icon's role:

```html
<!-- Decorative icon paired with visible text — aria-hidden -->
<a class="b2bea-button b2bea-button--primary" href="/join">
  <svg class="b2bea-icon" aria-hidden="true"><use href="../icons/lucide/sprite.svg#lucide-user"/></svg>
  Become a member
</a>

<!-- Icon-only interactive element — aria-label on the parent -->
<button class="b2bea-button b2bea-button--ghost" aria-label="Search">
  <svg class="b2bea-icon" aria-hidden="true"><use href="../icons/lucide/sprite.svg#lucide-search"/></svg>
</button>

<!-- Meaningful icon with no paired text — role + aria-label on the <svg> -->
<svg class="b2bea-icon b2bea-icon--lg" role="img" aria-label="Verified vendor">
  <use href="../icons/lucide/sprite.svg#lucide-check"/>
</svg>
```

Sizes: default `1em`, `.b2bea-icon--lg` is `1.5em`, `.b2bea-icon--xl` is `2em`. Color is inherited via `currentColor` — the icon's stroke takes the parent element's text color.

The L2 a11y audit (`checks/audit-a11y.mjs`) enforces the second pattern: an icon-only `<button>` or `<a>` without an accessible name is a hard failure.

## Adding a new icon

1. Pick the icon from [lucide.dev](https://lucide.dev) and note its name (kebab-case, e.g. `bookmark`).
2. Fetch its SVG: `curl -sLfo /tmp/bookmark.svg https://unpkg.com/lucide-static@latest/icons/bookmark.svg`. Open the file, locate the inner content (the `<path>` / `<circle>` / `<rect>` etc. between the opening `<svg ...>` tag and the closing `</svg>`).
3. Paste that inner content into `lucide/sprite.svg` as a new `<symbol>`, following the existing shape:

```xml
<symbol id="lucide-bookmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <!-- paste the inner paths/circles/rects here -->
</symbol>
```

Then add `"bookmark"` to `b2bea.design.json` → `iconography.available` so the contract reflects what's shipped.

## License

Lucide icons are ISC-licensed. The full license text is in `lucide/LICENSE` and must be kept whenever the sprite is redistributed.
