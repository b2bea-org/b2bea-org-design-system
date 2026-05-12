# Page Family Checklist

Use this to review whether the design system works across the actual B2BEA.org rebuild surfaces.

## Home (Marketing)

The home page is the only public surface allowed to use the marketing-scale hero clamp, and only via the `b2bea-page-hero--home` modifier plus the `<!-- b2bea:exception=home_hero -->` marker. Audit fails otherwise.

- Marketing nav (`b2bea-marketing-nav`) with brand, primary links, and conversion CTA.
- Marketing-scale hero with one clear value statement and 1–2 CTAs.
- Persona selector that respects who actually reads the site.
- Stat strip — only when numbers are real and current.
- Resource grid with category eyebrow + practitioner voice.
- People-to-know section (`b2bea-people-card`) for network credibility.
- Testimonial with attribution and photo (or initial fallback).
- Logo wall — grayscale, low opacity, real members only.
- Membership CTA block before the footer.
- Marketing footer with 3–4 link columns + legal line.
- Full SEO + GEO + social metadata block in `<head>`.

## Standard Public Page

- Blue page header.
- Standard title scale.
- Optional subtitle.
- Content sections with consistent spacing.
- SEO/GEO/social metadata fields represented in authoring workflow.

## Directory / Listing Page

- Blue page header.
- Search bar.
- Filter pills or select controls.
- Card or table layout.
- Active filter state.
- Empty/no-results state.
- Mobile filter behavior.

## Detail / Profile Page

- Header/profile summary.
- Metadata and status badges.
- Content sections.
- Sidebar/action panel if needed.
- Related items.
- Public/private visibility cues.

## Article / Resource Page

- Readable article header.
- Source/author/vendor attribution.
- Sponsor/resource metadata where relevant.
- Gated/free state.
- Social sharing preview compatibility.
- Related content.

## Form Page

- Clear title and purpose.
- Field grouping.
- Validation states.
- Required/optional labels.
- Submit/loading/success/error states.
- Mobile one-column behavior.

## Admin Dashboard

- Compact operational header.
- Tables/cards/tabs.
- Status pills.
- Search/filter.
- Bulk or row actions.
- Empty/loading/error states.
- No marketing-scale hero.

## Member Dashboard / Profile

- Operational app shell (`b2bea-app-shell` + `b2bea-app-topbar` + `b2bea-app-sidebar` + `b2bea-app-content`).
- Operational page header (`b2bea-page-header`) — no marketing-scale hero.
- Personal account context (greeting line, member badge, company).
- Profile completion state surfaced in the quick-actions list.
- KPI strip (`b2bea-kpi`) for connections / resources / events / messages.
- Activity feed (`b2bea-activity-row`) with default, loading, empty, and error states.
- Suggested-people block (`b2bea-people-card`) for network growth.
- Action list (`b2bea-action-list`) for quick next steps.
- Editable fields and public profile projection rules linked from the dashboard.
- `robots: noindex,nofollow` in `<head>`; SEO/GEO/social metadata not required for logged-in surfaces.

## Vendor Portal

- Vendor account context.
- Profile update submission state.
- Content submission state.
- Analytics cards/tables.
- Leads/billing/team placeholders if not implemented.
- Admin-review boundary visible.

## Company Workspace

- Private workspace only.
- Employee seats.
- Academy/careers access.
- Entitlements.
- Team progress/reporting.
- No public company profile pattern in V1.

## Custom Landing / Resource

- Declared owner.
- Declared route.
- Approved logo usage.
- SEO/GEO/social metadata.
- Analytics hook.
- Rollback/archive behavior.

