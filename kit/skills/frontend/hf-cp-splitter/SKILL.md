---
name: hf-cp-splitter
description: Use when building resizable side-by-side panes, a styled scrollable container, or a visual divider line, in a repo that consumes @openreachtech/furo-vue — "resizable panes", "split view", "scrollable sidebar", "custom scrollbar", "divider line between sections". Routes to FuroSplitter, FuroScrollArea, FuroSeparator.
---

# FuroSplitter / FuroScrollArea / FuroSeparator

These three molecules solve three different layout problems and are easy to
confuse because they all live in the "pane/space division" family.
`FuroSplitter` lays out two or more resizable panes with a draggable handle
between them and reports pane sizes outward — use it when the user should be
able to drag to resize regions. `FuroScrollArea` wraps a single region of
overflowing content with a styled, cross-browser scrollbar — use it when
content inside a fixed-size box needs to scroll, with no resizing involved.
`FuroSeparator` is a purely visual divider line (with correct
`role`/`aria-orientation`) drawn between sibling content — use it when you just
need a visual/semantic line, not an interactive boundary. A `FuroSplitter` pane
commonly contains a `FuroScrollArea` for its overflowing content, and a
`FuroSeparator` is often placed inside a `FuroToolBar` between groups of
controls (unrelated to `FuroSplitter`'s own drag handle).

- Layer: molecule (all three)
- Import: `import { FuroSplitter, FuroScrollArea, FuroSeparator } from '@openreachtech/furo-vue'`
- Manifest entries: `node_modules/@openreachtech/furo-vue/public/furo-vue/components.json` → `components[].name === 'FuroSplitter'`, `=== 'FuroScrollArea'`, `=== 'FuroSeparator'`

Read the manifest before writing markup if you need to confirm this
information is still current — the library may have added props/events since
this skill was written.

## When NOT to use

- Grouping buttons/toggles into one keyboard-navigable toolbar → use `hf-cp-toggle-group` (`FuroToolBar`) instead; its separators between control groups are the same `FuroSeparator`, but the surrounding container is not `FuroSplitter`.
- A show/hide region that collapses to nothing (not a fixed-size resizable pane) → use `hf-cp-collapsible` instead.
- Tabular data with its own scroll and pagination behavior → use `hf-cp-table` instead of wrapping it manually in `FuroScrollArea`.
- Swapping which content is visible via a tab strip, rather than showing both regions side by side → use `hf-cp-tabs` instead of `FuroSplitter`.
- A floating panel anchored to a trigger element → use `hf-cp-popover` instead; `FuroSplitter`/`FuroScrollArea` are for fixed in-flow layout, not overlays.

## FuroSplitter

### Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `parcel` | `FuroSplitterParcel \| null` | `null` | Reactive configuration object. Non-Furo keys (`autoSaveId`, `aria-label`) forward to the group element. |

### `parcel` fields

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction the panes are arranged in. |
| `appearance` | `'default' \| 'plain'` | `'default'` | `default` shows a divider line between panes; `plain` hides it so panes read as separated cards. |
| `panels` | `Array<FuroSplitterPanel>` | `[]` | One descriptor per pane. A resize handle is inserted between consecutive panes. |

### Events

| Event | Payload | Fires when |
| --- | --- | --- |
| `change-value` | `SplitterEmitPayload` | A handle is dragged and the layout changes. Use `payload.layout` and `payload.extractPaneSize({ index })`. |
| `update:value` | `Array<number>` | Same moment as `change-value`; powers one-way `v-model:value` for persisting the layout. |

### Slots

| Slot | Scoped props | Description |
| --- | --- | --- |
| `panel` | `{ panel, index, id }` | Content for each pane. Switch on `id` or `index` to render the right region. |
| `handle` | `{ index }` | Custom resize handle between panes. Defaults to a centered grip. |

## FuroScrollArea

### Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `parcel` | `FuroScrollAreaParcel \| null` | `null` | Reactive data object holding orientation and scrollbar visibility. |

### `parcel` fields

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `orientation` | `'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | Which scrollbars render, and which axes are scrollable. `both` also renders the corner where they meet. |
| `scrollbarVisibility` | `'hover' \| 'scroll' \| 'glimpse' \| 'auto' \| 'always'` | unset (`'hover'`) | When the scrollbar appears — it does not affect whether the content scrolls. When unset, the primitive default (`hover`) applies. |
| `scrollHideDelay` | `number` | unset | Milliseconds before the scrollbar hides after the trigger ends (applies to `hover` / `scroll` / `glimpse`). Forwarded to the primitive. |

### Events

`FuroScrollArea` has no documented events in the manifest — it carries no value and emits nothing.

### Slots

| Slot | Scoped props | Description |
| --- | --- | --- |
| `default` | — | The overflowing content placed inside the scroll viewport. |

## FuroSeparator

### Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `parcel` | `SeparatorParcel \| null` | `null` | Reactive data object holding orientation and the decorative flag. |

### `parcel` fields

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction the divider runs. `horizontal` spans the full inline width; `vertical` stretches to the parent's height. |
| `decorative` | `boolean` | `false` | When true, the divider is purely visual and drops the separator role so assistive tech ignores it. |

### Events

`FuroSeparator` has no documented events in the manifest — it carries no value and emits nothing.

### Slots

`FuroSeparator` has no documented slots in the manifest.

## Usage

```vue
<script>
import {
  FuroSplitter,
  FuroScrollArea,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroSplitter,
    FuroScrollArea,
  },
}
</script>

<template>
  <FuroSplitter
    v-model:value="context.paneSizes"
    :parcel="{
      orientation: 'horizontal',
      panels: context.splitterPanels,
    }"
    @change-value="context.onChangeLayout({ payload: $event })"
  >
    <template #panel="{ panel, id }">
      <FuroScrollArea :parcel="{ orientation: 'vertical' }">
        <component :is="context.resolvePanelComponent({ id })" />
      </FuroScrollArea>
    </template>
  </FuroSplitter>
</template>
```

A separator used purely for visual division, unrelated to the splitter:

```vue
<template>
  <FuroSeparator :parcel="{ orientation: 'horizontal', decorative: true }" />
</template>
```

## Rules (per project conventions)

- `FuroSplitter` is a one-way form-control: pass `parcel` and use
  `v-model:value` to persist the pane layout — this is the one documented
  exception to the project's general no-`v-model` rule, which applies only
  to custom in-project components, not to `furo-vue` library components.
- `FuroScrollArea` and `FuroSeparator` are **not** form controls: neither
  carries a `value` nor emits events. Configure them only through `parcel`
  and, for `FuroScrollArea`, place overflowing content in its default slot.
- Never import the underlying headless splitter, scroll-area, or separator
  primitive — only the public `FuroSplitter` / `FuroScrollArea` /
  `FuroSeparator` exports.
- Put layout-persistence logic (e.g. saving `payload.layout` to a user
  preference) in the page/component Context, not inline in the template.
