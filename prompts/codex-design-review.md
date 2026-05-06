# Codex Prompt: B2BEA.org Design Review

Review the target page, component, or repo against the B2BEA.org Lovable Design System.

Use `design.md`, `b2bea.design.json`, `design-system.json`, and `b2bea.css` as the source of truth.

Check:

1. The correct register is declared: `public_standard`, `operational`, or `custom_html`.
2. `b2bea.css` or equivalent token/component implementation is loaded.
3. Official logo assets are referenced from this repo or Brett's Cloudflare account.
4. Standard page titles use `clamp(2.25rem, 4vw, 3.75rem)` unless the page is an approved exception.
5. Fields, search, selects, filters, buttons, pills, cards, and panels follow the Lovable contract.
6. Public pages satisfy SEO, GEO, social, indexing, and analytics metadata requirements.
7. Forbidden patterns are absent.
8. Mobile text wraps cleanly without overlap or horizontal scrolling.

Return findings first, ordered by severity, with file and line references when available. Then summarize what follows the system well and what should be improved next.

