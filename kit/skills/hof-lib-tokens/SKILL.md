---
name: hof-lib-tokens
description: Use when re-theming or overriding the component library's own semantic tokens from a consumer app — "change the library's primary colour", "make the field borders lighter", "our brand red", "retime the library's transitions". Covers the published token prefixes, the two border tiers, the intent text tier and the easing tokens.
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

1. Load your override file **after** the library stylesheet.
2. Redefine **semantic** tokens only — never a `--palette-*` primitive, and
   never a library component's CSS.
3. Write the override under `[data-theme="light"]` / `[data-theme="dark"]`, not
   bare `:root`, whenever the app sets `data-theme`. The library's own theme blocks are
   attribute-scoped, so a bare `:root` rule loses to them.
4. Keep the light and dark blocks in sync, so both schemes stay legible.

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
| `--color-border` | Container outlines and dividers — cards, menus, overlays, table rules, separators |
| `--color-input` | Control boundaries, and the graphical controls a reader drags — field, textarea and select borders, radio and checkbox boxes, outline buttons and toggles, the switch off track, a scrollbar thumb, a splitter grip, a column-resize bar |

There is no `--color-border-strong`. A control that needs the stronger edge
reads `--color-input`.

## The intent text tier

Each intent family ships three roles, and re-pointing the family means moving
all three — the `-text` tier does **not** follow the fill.

| Role | Read as |
| --- | --- |
| `--color-{destructive,error,info,success,warning}` | The fill, and the border of an invalid control |
| `--color-…-foreground` | A label sitting **on** that fill |
| `--color-…-text` | The family read as text or as a surfaceless graphic — a validation message, a required marker, a table's error row, a badge label or dot |

A fill is not legible as text, which is why the text tier is a role of its own.
Re-pointing `--color-destructive` alone leaves every validation message on
the library's own step.

## Easing

`--transition-timer` is the one name for the transition **time** axis. Two
easing tokens sit beside it:

| Token | For |
| --- | --- |
| `--transition-easing` | The default curve |
| `--transition-easing-emphasized` | A large surface entering or leaving |

Neither is redefined for the dark theme — a curve carries no colour.

## Rules

- Override a semantic role, never a `--palette-*` primitive and never a library
  component's CSS. A component's own rules live inside a cascade layer, so an app
  stylesheet outside that layer already wins where it needs to — reaching into
  the component is never the fix.
- Re-point an intent family's fill, its `-foreground` companion and its `-text`
  tier together, or leave all three alone.
- A colour a component needs but the token layer does not publish is a library
  gap worth reporting, not a hex value to inline in the app.
- Do not invent a token name in the library's namespace. A new prefix is a change to
  the library's own token layers, not something an app declares.
