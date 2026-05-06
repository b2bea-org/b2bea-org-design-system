# B2BEA.org Design System

AI-executable Lovable-era design system for the B2BEA.org rebuild.

This repo intentionally emulates the `dreamborn-design-system` structure:

- `design.md`
- `b2bea.css`
- `b2bea.design.json`
- `design-system.json`
- `logos/`
- `examples/`
- `recipes/`
- `prompts/`
- `checks/`

## Cloudflare

B2BEA.org assets should use Brett's Cloudflare account.

- Account name: `Brett Sinclair DNS`
- Account ID: `3333630b9c90c49aef56730d9513c19f`
- Current R2 bucket: `b2bea-guest-packs`
- Logo namespace: `design-system/logos`

The official logo files are stored locally in `logos/` and uploaded to R2 under the keys listed in `design-system.json`.

## Files

| File | Purpose |
|---|---|
| `design.md` | Human-readable design brief. |
| `b2bea.css` | Canonical CSS tokens and primitive components. |
| `b2bea.design.json` | Machine-readable design contract for agents and audits. |
| `design-system.json` | Compact manifest for colors, fonts, logos, Cloudflare, and usage defaults. |
| `examples/standard-page.html` | Static example showing the system in use. |

## Usage

```html
<link rel="stylesheet" href="./b2bea.css">
<body data-register="public_standard">
```

Run the local audit:

```bash
npm run audit
```

