---
name: hof-cp-skeleton
description: Use when showing a placeholder while content loads in a repo that consumes @openreachtech/furo-vue (for example "loading skeleton", "shimmer placeholder", "content placeholder", "avatar placeholder", "card placeholder"). Routes to FuroSkeleton.
---

# FuroSkeleton

Presentational molecule: a single styled box that stands in for content that
is still being fetched. The shape comes from `parcel.variant` and the size from
optional `width` / `height` overrides. A shimmer sweeps across it unless the
parcel turns it off, or the user prefers reduced motion. It carries no value,
emits nothing, and has no slots, so build a placeholder layout by placing
several boxes in your own markup.

- Layer: molecule
- Import: `import { FuroSkeleton } from '@openreachtech/furo-vue'`
- Manifest entry: `node_modules/@openreachtech/furo-vue/public/furo-vue/components.json` → `components[].name === 'FuroSkeleton'`

Written from furo-vue 2.1.0. Read the manifest before writing markup if you
need to confirm this information is still current, because the library may have
added props/events since this skill was written.

## When NOT to use

- A region that loaded and has no records, or failed → use `hof-cp-empty-state` (`FuroEmptyState`, `FuroErrorState`).
- The loading state of a whole table → set `loading` on `FuroTable` and see `hof-cp-table`. Its `loading` slot and its `placeholder` slot (virtual rows) already draw the state.
- A loading spinner inside a button → use the loading state of `hof-cp-button`.
- A short status label such as "Pending" → use `hof-cp-badge`.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `parcel` | `FuroSkeletonParcel \| null` | `null` | Variant, size overrides and animation flag. The only public prop. |

## `parcel` fields

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `'text' \| 'circle' \| 'rectangle'` | `'text'` | Placeholder shape. `circle` is round, `text` and `rectangle` have a small radius. |
| `width` | `string` | by variant | A CSS length. Defaults to `100%` for `text` and `rectangle`, `2.5rem` for `circle`. |
| `height` | `string` | by variant | A CSS length. Defaults to `1rem` for `text` and `rectangle`, `2.5rem` for `circle`. |
| `animated` | `boolean` | `true` | `true` shimmers. Under `prefers-reduced-motion: reduce` the placeholder is static whatever this says. |

`width` and `height` take a CSS length string such as `'3rem'`. A `null` or
omitted value keeps the variant default.

## Events

None. `FuroSkeleton` emits nothing.

## Slots

None.

## Accessibility

The box carries `aria-hidden="true"`, so a screen reader never sees it.
Announce the loading state on the surrounding region instead (for example
`aria-busy="true"` on the container while the placeholders show).

## Fallthrough attributes

The root is a `<div>`. Every attribute you write on the component lands on it,
`class` and `style` included, after the `aria-hidden` the component sets.

## Usage

```vue
<script>
import {
  FuroSkeleton,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroSkeleton,
  },
}
</script>

<template>
  <div
    v-if="context.isLoadingProfile"
    :aria-busy="true"
  >
    <FuroSkeleton :parcel="{ variant: 'circle', width: '3rem', height: '3rem' }" />
    <FuroSkeleton :parcel="{ variant: 'text' }" />
    <FuroSkeleton :parcel="{ variant: 'rectangle', height: '8rem' }" />
  </div>
</template>
```

A static placeholder:

```vue
<template>
  <FuroSkeleton :parcel="{ animated: false }" />
</template>
```

## Rules (per project conventions)

- `FuroSkeleton` is not a form control, so it has no `value` and no
  `v-model:value` contract.
- Never import the underlying headless primitive, only the public
  `FuroSkeleton` export. The skeleton uses none, so there is nothing else to
  import.
- Decide whether the placeholders show in the page/component Context
  (`isLoading{Content}`), and swap them for the real content with `v-if` /
  `v-else` on that one flag.
- Pass only the `parcel` keys this skill lists. A component reads the keys it
  names and ignores the rest, so a mistyped key changes nothing and reports
  nothing, so check a key against the manifest rather than trusting silence.
