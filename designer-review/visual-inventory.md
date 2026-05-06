# Visual Inventory

Use this as the checklist of system pieces that need designer review.

## Foundations

| Area | Current Direction | Designer Review Needed |
|---|---|---|
| Color | Dark blue `#00196C`, coral `#EB5444`, white, light gray, muted text. | Confirm palette, secondary/support colors, state colors, contrast. |
| Typography | Open Sans for display/body/UI. | Confirm whether Open Sans is sufficient or propose stronger production typography. |
| Type scale | Standard H1 `clamp(2.25rem, 4vw, 3.75rem)`. | Confirm hierarchy across public, editorial, and operational surfaces. |
| Radius | `0.75rem` default, `999px` pills. | Confirm if radius feels too soft/shadcn-like or just right. |
| Elevation | Low blue-tinted shadows. | Confirm shadow strength and hover motion. |
| Spacing | 1400px container, 2rem side padding, 1.25rem panels. | Confirm density for public vs admin surfaces. |

## Components

| Component | States Needed |
|---|---|
| Buttons | default, hover, focus, active, disabled, loading |
| Fields | default, hover, focus, disabled, error, success |
| Search | default, populated, focused, empty result |
| Selects | default, focus, disabled, error |
| Textareas | default, focus, error, character help |
| Pills/filters | default, hover, active, disabled |
| Badges/status | neutral, info, success, warning, error, pro, verified |
| Cards | default, hover/clickable, selected, disabled, loading |
| Tables | header, row, hover, selected, empty, dense |
| Page headers | standard public, editorial, operational |
| Navigation | desktop, mobile, dropdown, active, logged-in |
| Empty states | no data, no results, no permission, first-use |
| Error states | validation, load failure, permission denied, system unavailable |
| Loading states | page, card, table row, button |

## Page Families

| Page Family | Why It Matters |
|---|---|
| Standard public page | The default Sanity page pattern. |
| Directory/listing page | Vendors, people, resources, jobs, courses. |
| Detail/profile page | Vendor profiles, person profiles, course detail, job detail. |
| Article/resource page | Reading, attribution, sponsorship, gated/free content. |
| Form page | Membership, vendor claim, surveys, intake. |
| Admin dashboard | Dense internal operations. |
| Member dashboard/profile | Individual self-service. |
| Vendor portal | Vendor self-service plus review boundaries. |
| Company workspace | Private practitioner company workspace. |
| Custom landing/resource | Deliberately custom HTML import path. |

## Design Review Questions

- Does the system feel distinctive enough without becoming decorative?
- Does the same system work for public marketing pages and dense operational screens?
- Are forms/search/filter controls obvious and consistent?
- Are page headers too large, too plain, or about right?
- Is the logo guidance clear enough for designers and builders?
- Are there enough states for production work?

