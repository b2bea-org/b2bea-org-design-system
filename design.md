# B2BEA.org Lovable Design System

This is the AI-executable design system for the B2BEA.org rebuild. It follows the same artifact pattern as `dreamborn-design-system`: a human-readable design brief, canonical CSS, machine-readable JSON, prompt recipes, examples, audits, and official logo assets.

## Source Of Truth

- `design.md`: human-readable design brief and quality bar.
- `b2bea.css`: canonical implementation of tokens and primitive components.
- `b2bea.design.json`: machine-readable contract for agents, builders, audits, and review prompts.
- `design-system.json`: compact manifest with colors, fonts, logos, Cloudflare asset locations, and usage defaults.

## Cloudflare Rule

All B2BEA.org design-system assets use Brett's Cloudflare account.

- Account: `Brett Sinclair DNS`
- Account ID: `3333630b9c90c49aef56730d9513c19f`
- Current logo bucket: `b2bea-guest-packs`
- Current logo namespace: `design-system/logos`

## Design Principle

B2BEA should feel like a professional association operating system for B2B ecommerce practitioners: clear, trusted, useful, and consistent. The Lovable look is the authority for V1 across non-excluded pages.

## Registers

### Public Standard

Use for non-home public pages, directories, topic pages, academy pages, events, jobs, surveys, and forms.

Required signals:

- Blue page header with clear title.
- Useful subtitle when needed.
- Search/filter toolbar where discovery is expected.
- Consistent cards, pills, fields, buttons, and empty states.

### Operational

Use for B2BEA Admin, member dashboard/profile, vendor management portal, company workspace, and account/auth surfaces.

Required signals:

- Current state.
- Owner or account context.
- Clear next action.
- Status pills and lifecycle states.
- Error, loading, empty, and success states.

### Custom HTML

Use for custom landing pages, sponsored pages, and resources that intentionally need a custom look.

Required signals:

- Declared owner.
- Declared route.
- SEO/GEO/social metadata contract.
- Analytics hook.
- Approved logo usage.

## Typography

Use Open Sans for display, body, and UI in the Lovable-era system. Do not use the older Hanken Grotesk heading dependency on target pages unless an exception is explicitly approved.

Standard title scale:

- Standard page title: `clamp(2.25rem, 4vw, 3.75rem)`
- Article/editorial title: `clamp(2.75rem, 6vw, 5rem)`
- Full marketing hero title: `clamp(3rem, 7vw, 6rem)` by exception only

## Core Components

- `b2bea-page-hero`
- `b2bea-button`
- `b2bea-field`
- `b2bea-search`
- `b2bea-pill`
- `b2bea-badge`
- `b2bea-card`
- `b2bea-panel`
- `b2bea-empty`
- `b2bea-alert`
- `b2bea-logo`

## Logo Rules

- Use official logo files from this repo or Brett's Cloudflare account.
- Do not recreate the wordmark in text.
- Do not recolor, rotate, distort, shadow, or add effects.
- Use dark-blue variants on light backgrounds.
- Use white/gray variants on dark blue backgrounds.
- Keep clear space around the logo.

## Metadata Rule

No public page publishes without complete SEO, GEO, social, indexing, and analytics metadata appropriate to its page family.

## Forbidden Patterns

- Oversized standard page titles outside approved hero contexts.
- Legacy Hanken Grotesk on target Lovable pages.
- Negative letter spacing in controls or standard page headings.
- Mixed field radii and one-off form styles.
- Marketing-scale heroes inside admin, portal, profile, or workspace surfaces.
- Cards nested inside decorative cards.
- Unstyled browser default form controls.
- Custom pages without SEO, GEO, social, and analytics metadata.
- Public practitioner company profile pages in V1.

## Quality Bar

Generated or hand-coded work passes only if:

- The correct register is clear.
- `b2bea.css` or equivalent token/component implementation is loaded.
- Fields, search, selects, buttons, pills, and cards match the contract.
- The page title scale is appropriate.
- Official logo assets are used.
- Mobile text wraps without overlap or horizontal scrolling.
- Public pages satisfy metadata requirements.

