# Component State Matrix

This matrix defines the states a designer should specify before the design system is considered production-ready.

## Buttons

| Variant | Default | Hover | Focus | Active | Disabled | Loading |
|---|---|---|---|---|---|---|
| Primary | Blue fill, white text. | Darker blue. | Blue focus ring. | Slightly pressed. | Muted fill/text. | Spinner or progress label. |
| Accent | Coral fill, white text. | Darker coral. | Blue focus ring. | Slightly pressed. | Muted fill/text. | Spinner or progress label. |
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

