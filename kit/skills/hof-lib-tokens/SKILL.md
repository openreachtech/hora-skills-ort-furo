---
name: hof-lib-tokens
description: Use when re-theming or overriding the component library's own semantic tokens from a consumer app, such as "change the library's primary colour", "make the field borders lighter", "our brand red", "retime the library's transitions". Covers where an override sits in the cascade, the published token prefixes, the two border tiers, the intent roles, the text roles, the easing tokens and the control size tokens.
---

# The component library's semantic tokens

This is about the tokens **the component library itself** publishes and reads —
not the host app's own `assets/css/variables.css` tokens, which are a separate
vocabulary with separate rules. Reach for this skill when a library component
renders in the wrong colour, weight or timing and the fix belongs in the token
layer rather than in a component's `<style>`.

The library ships its own token reference under `docs/` inside the installed
package. Read it before overriding anything — it is the authority, and it
carries the reasoning behind each role.

## How a consumer re-themes

Redefine **semantic** tokens only, never a `--palette-*` primitive and never a
library component's CSS, and keep the light and dark blocks in sync so both
schemes stay legible. Where the override sits depends on the library version:

| | Before 1.5.0 | From 1.5.0 |
| --- | --- | --- |
| Library tokens | Declared outside any cascade layer | Declared inside `@layer furo` |
| Unlayered override file | Wins only when it loads after the library stylesheet | Wins wherever it loads |
| Override inside `@layer app`, which `/hof-css-layers` orders after `furo` | Loses to the library tokens, because an unlayered declaration beats every layered one | Wins |
| Override on bare `:root` | Competes with the library's `[data-theme="..."]` blocks on load order and specificity | Beats both theme blocks, so the token holds one value in both themes |

Before 1.5.0:

1. Keep the override file outside any cascade layer, and load it **after** the
   library stylesheet.
2. Write the override under `[data-theme="light"]` / `[data-theme="dark"]`, not
   bare `:root`, whenever the app sets `data-theme`.

From 1.5.0:

1. Keep the override file outside any layer, where its load order no longer
   matters, or put it in `@layer app`, declared after `furo`.
2. Write a token that differs per theme under `[data-theme="light"]` /
   `[data-theme="dark"]`. Put a token that holds in both themes, such as a
   size, on `:root`.

## The published prefixes

A library component reads these and nothing else. `--palette-*` is off limits in
component CSS, and a non-colour value never carries `--color-`.

| Prefix | Holds |
| --- | --- |
| `--color-*` | Semantic colour roles |
| `--size-*` | Spacing, radius, layout sizes |
| `--font-*` | Family, size, weight, line height, and the composite text roles |
| `--shadow-*` | Elevation |
| `--transition-*` | Duration and easing |
| `--value-*` | Constants, and the z-index layers |

Two narrowing rules apply on top: `gap` takes `--size-space-*`, and text is set
through a composite `--font-*` role rather than a bare `font-size`.

## The two border tiers

| Token | What reads it |
| --- | --- |
| `--color-border` | Container outlines and dividers: menus, overlays, table rules, separators, toolbar and stepper outlines, outline toggles and toggle group items, a scrollbar thumb, a splitter grip, a column-resize bar |
| `--color-input` | Control boundaries: field, textarea, select and editor borders, radio and checkbox boxes, outline buttons, the switch off track |

There is no `--color-border-strong`. A control that needs the stronger edge
reads `--color-input`.

## The intent roles

Each intent family ships these roles:

| Role | Read as |
| --- | --- |
| `--color-{destructive,error,info,success,warning}` | The fill and the border of an invalid control. Before 1.6.0 it was also the family read as text |
| `--color-{destructive,info,warning}-text` | From 1.6.0, the family read as text on the page. See [The text roles](#the-text-roles) |
| `--color-…-foreground` | A label sitting **on** that fill |
| `--color-{error,info,success,warning}-subtle` | A tinted surface, such as a badge |
| `--color-…-subtle-foreground` | Text sitting on that tinted surface |

`--color-error` and `--color-success` ship no `-text` sibling, because the
library's contrast check finds no `color:` declaration that reads either. Text
set through a `--furo-*` knob sits outside that check, so an app that paints
either as text checks the contrast itself.

## The text roles

Text on the page has to clear 4.5:1 against `--color-background`. Before 1.6.0
several roles the library paints as text fell short in the light theme, and the
fill of a family doubled as its text. From 1.6.0 each role below clears 4.5:1 in
both themes, except the glyph role, which is held to 3:1.

| Role | Before 1.6.0 | From 1.6.0, light | From 1.6.0, dark | Read by, from 1.6.0 |
| --- | --- | --- | --- | --- |
| `--color-destructive-text` | Absent. Text read `--color-destructive`, `--palette-rose-500`, 3.67:1 | `--palette-rose-600`, 4.70:1 | `--palette-rose-500`, 5.14:1 | The `FuroControlBlock` message and required mark, `FuroErrorState`, the destructive `FuroDropdownMenu` item, the `FuroTable` error row |
| `--color-warning-text` | Absent. Text read `--color-warning`, `--palette-orange-500`, 2.80:1 | `--palette-orange-700`, 5.18:1 | `--palette-orange-400`, 8.34:1 | The unresolved-name glyph of `FuroIcon` |
| `--color-info-text` | Absent. Text read `--color-info`, `--palette-blue-500`, 3.68:1 | `--palette-blue-600`, 5.17:1 | `--palette-blue-400`, 7.43:1 | The `FuroAttachment` spinner |
| `--color-link` | `--palette-blue-500`, 3.68:1 | `--palette-blue-600`, 5.17:1 | `--palette-blue-500`, 5.13:1, unchanged | The `FuroButton` link variant, links inside `FuroEditor` content |
| `--color-foreground-glyph` | Absent. Glyphs read `--color-foreground-tertiary` | `--palette-gray-600`, 3.09:1 | `--palette-gray-300`, 12.84:1 | The `FuroSidebar` caret, the `FuroSearchField` icon, the `FuroBreadcrumb` separator and overflow marker |
| `--color-foreground-secondary` | `--palette-gray-700`, 5.27:1. The `FuroSidebar` group label and section button read `--color-foreground-tertiary` instead, at 3.09:1 | Unchanged value | Unchanged value | Also the `FuroSidebar` group label and section button |

- **The fill roles keep their values.** `--color-destructive`, `--color-warning`
  and `--color-info` still resolve to the same palette steps, because darkening
  a fill would push its `-foreground` label under 4.5:1. `--palette-gray-950` on
  `--palette-rose-600` is 4.02:1.
- **`--color-foreground-tertiary` did not move.** It stays `--palette-gray-600`
  in light and `--palette-gray-300` in dark. At 3.09:1 in light it is below the
  text floor, so no library component reads it from 1.6.0. Set text with
  `--color-foreground-secondary`, never with the tertiary or the glyph role.
- **`--color-foreground-glyph` is for an icon, a caret or a separator only.**
  Its 3:1 floor is the one WCAG sets for a graphic, and the library cannot tell
  a glyph from text, so only review keeps text off it.

No colour role was renamed or removed between 1.4.0 and 1.6.0, and every value
in the table was the same in 1.4.0 and 1.5.0. Re-pointing a family depends on
the version:

| | Before 1.6.0 | From 1.6.0 |
| --- | --- | --- |
| AA-passing danger text | Re-point `--color-destructive` to a darker step, such as `--palette-rose-700` (6.29:1), and accept that the fill and the invalid border darken with it | No override needed, because `--color-destructive-text` already clears 4.5:1 |
| Recolor the danger family to a brand red | Re-point `--color-destructive` | Re-point `--color-destructive` **and** `--color-destructive-text`, or messages keep the library's rose |
| Same for warning and info | Re-point `--color-warning` or `--color-info` | Re-point the fill and its `-text` sibling together |
| Link colour in light | `--palette-blue-500`, 3.68:1 | `--palette-blue-600`, 5.17:1 |

A `-text` override differs per theme, so write it under `[data-theme="light"]`
and `[data-theme="dark"]` and check it clears 4.5:1 on `--color-background` in
each.

## Easing

`--transition-timer` is the one name for the transition **time** axis. Two
easing tokens sit beside it:

| Token | For |
| --- | --- |
| `--transition-easing` | The default curve |
| `--transition-easing-emphasized` | A large surface entering or leaving |

Neither is redefined for the dark theme — a curve carries no colour.

## Control size tokens

From 1.5.0 the library publishes three size tokens, so an app can raise a row
or a close button to a larger touch target without touching component CSS:

| Token | Default | What reads it |
| --- | --- | --- |
| `--size-option-height` | `calc(var(--size-input-height) - 0.5rem)`, 24px | The minimum height of a `FuroSelect` option row and a `FuroDropdownMenu` row |
| `--size-close-button-small` | `1.25rem`, 20px | The `FuroToast` close button |
| `--size-close-button-medium` | `1.75rem`, 28px | The `FuroDialog` and `FuroDrawer` close buttons |

Before 1.5.0 these tokens do not exist, and the components fix the same values
in their own CSS, so declaring the tokens there changes nothing. No token was
renamed or removed between 1.4.0 and 1.5.0.

## Rules

- Override a semantic role, never a `--palette-*` primitive and never a library
  component's CSS. A component's own rules live inside a cascade layer, so an app
  stylesheet outside that layer already wins where it needs to — reaching into
  the component is never the fix.
- Re-point an intent family's fill and its `-foreground` companion together,
  and check the label still clears 4.5:1 on the new fill. From 1.6.0, also
  re-point the `-text` sibling of the destructive, warning and info families,
  and check it clears 4.5:1 on `--color-background`.
- A colour a component needs but the token layer does not publish is a library
  gap worth reporting, not a hex value to inline in the app.
- Do not invent a token name in the library's namespace. A new prefix is a change to
  the library's own token layers, not something an app declares.
