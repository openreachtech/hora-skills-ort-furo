---
name: hof-cp-badge
description: Use when labeling a record's state or showing a small count in a repo that consumes @openreachtech/furo-vue (for example "status badge", "state label", "count badge", "tag", "status dot", "pill"). Routes to FuroBadge.
---

# FuroBadge

Presentational atom that labels a record's state, so the same state reads the
same way on every screen. It carries no value, emits nothing, and renders
everything from `parcel`. One component covers four shapes (`text`, `count`,
`state`, `dot`), chosen by `parcel.shape`, and five tones, chosen by
`parcel.tone`. The tone is a color role (`accent`, `neutral`, `success`,
`warning`, `error`), never a domain word: a state name such as "due soon"
stays in your application, mapped onto a tone by your Context.

- Layer: atom
- Import: `import { FuroBadge } from '@openreachtech/furo-vue'`
- Manifest entry: `node_modules/@openreachtech/furo-vue/public/furo-vue/components.json` → `components[].name === 'FuroBadge'`

Written from furo-vue 2.1.0. Read the manifest before writing markup if you
need to confirm this information is still current, because the library may have
added props/events since this skill was written.

## When NOT to use

- A clickable or dismissible control → use `hof-cp-button`. A badge has no events and no interactive state.
- The tokens shown for the selected values inside a multi-select → those belong to `hof-cp-select`, not to `FuroBadge`.
- A placeholder while content loads → use `hof-cp-skeleton`.
- A message about an empty or failed region → use `hof-cp-empty-state`.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `parcel` | `FuroBadgeParcel \| null` | `null` | Everything the badge renders. The only public prop. |

## `parcel` fields

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | `''` | Text shown inside the badge. Ignored by the `count` and `dot` shapes. |
| `count` | `number` | `null` | Number shown by the `count` shape, read instead of `label`. A `count` shape with no `count` renders `0`. |
| `shape` | `'text' \| 'count' \| 'state' \| 'dot'` | `'text'` | `text` is a label on a surface, `count` a number on a surface, `state` a dot beside a colored label with no surface, `dot` a 6px dot with no text. |
| `tone` | `'accent' \| 'neutral' \| 'success' \| 'warning' \| 'error'` | `'accent'` | Color role. `accent` reads the `--color-info` family. |
| `emphasis` | `'solid' \| 'subtle' \| 'outline'` | `'solid'` | Surface treatment. Applies to the `text` and `count` shapes only. |
| `size` | `'large' \| 'medium' \| 'small'` | `'medium'` | Height step. The `count` shape has two steps, so `large` renders the `medium` size. |

A single-digit `count` renders as a circle, and two or more digits widen it
into a pill.

## Events

None. `FuroBadge` emits nothing.

## Slots

| Slot | Scoped props | Description |
| --- | --- | --- |
| `default` | `{ text }` | Replaces the rendered text, for an icon, a truncation or tabular figures beside the state. Not rendered for the `dot` shape. |

## Fallthrough attributes

The root is a `<span>`. Every attribute you write on the component lands on it
(`class`, `style`, `id`, `aria-*`, `data-*`). A `parcel` key that is not one of
the six above is also forwarded to the root as an attribute, so a mistyped key
such as `lable` shows up as a stray attribute and changes nothing visible.

The badge sets no `role` and no ARIA attribute. A `dot` shape has no text at
all, so pair it with visible text elsewhere in the row.

## Appearance

To re-theme a tone, override `--color-info`, `--color-success`,
`--color-warning` or `--color-error` from the app side, as the library token
skill (`hof-lib-tokens`) describes. The badge reads those tokens and holds no
colors of its own. Each family's `-foreground`, `-subtle` and
`-subtle-foreground` tokens sit beside it, so re-point them as well when a
fill or a tint needs a different label color.

## Usage

```vue
<script>
import {
  FuroBadge,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroBadge,
  },
}
</script>

<template>
  <FuroBadge
    :parcel="{
      label: context.orderStatusLabel,
      shape: 'state',
      tone: context.extractOrderStatusTone(),
    }"
  />

  <FuroBadge
    :parcel="{
      shape: 'count',
      count: context.unreadCount,
      tone: 'error',
    }"
  />
</template>
```

## Rules (per project conventions)

- `FuroBadge` is not a form control, so it has no `value` and no
  `v-model:value` contract.
- Never import the underlying headless primitive, only the public
  `FuroBadge` export. The badge uses none, so there is nothing else to import.
- Map a domain state onto a `tone` in the page/component Context (for example
  `extractOrderStatusTone()`), not with a ternary in the template.
- Pass only the `parcel` keys this skill lists. An unlisted key reaches the
  root as an attribute rather than doing what you meant, so check a key against
  the manifest rather than trusting silence.
