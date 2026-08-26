---
name: hof-cp-popover
description: Use when building a floating panel anchored to a trigger, or a hover/focus hint, in a repo that consumes @openreachtech/furo-vue — "floating panel", "inline edit popup", "action panel", "hover hint", "tooltip". Routes to FuroPopover, FuroTooltip.
---

# FuroPopover / FuroTooltip

Both are floating-overlay molecules anchored to a `trigger` slot, but they solve
different problems. `FuroPopover` is a click-triggered surface that holds any
interactive content (inline cell edit forms, action menus, small panels) and can
be modal (focus-trapped). `FuroTooltip` is a hover/focus-only hint —
non-interactive by convention, shows short text (or a rich `content` slot), and
opens after a configurable delay. Pick based on trigger interaction (click vs.
hover/focus) and content interactivity (form/buttons vs. plain text), not on
visual similarity.

- Layer: molecule
- Import: `import { FuroPopover, FuroTooltip } from '@openreachtech/furo-vue'`
- Manifest entry: `node_modules/@openreachtech/furo-vue/public/furo-vue/components.json` → `components[].name === 'FuroPopover'` / `'FuroTooltip'`

Read the manifest before writing markup if you need to confirm this
information is still current — the library may have added props/events since
this skill was written.

## When NOT to use

- Needs a menu of discrete actions (not a click-anchored surface with slot content) → use `hof-cp-dropdown-menu`.
- Content must block the whole page or demand an explicit decision → use `hof-cp-dialog` (`FuroDialog` / `FuroAlertDialog`), not a modal `FuroPopover`.
- Needs a persistent side panel → use `hof-cp-dialog` (`FuroDrawer`).
- Plain collapsible section inline in the page flow (no floating/anchored positioning) → use `hof-cp-collapsible`.
- Just want a static text hint with no hover behavior (e.g. always-visible helper text next to a field) → use `hof-cp-control-block`'s hint area, not `FuroTooltip`.

## Props

Both components take a single `parcel` prop — no other props.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `parcel` | `PopoverParcel \| null` (FuroPopover) / `TooltipParcel \| null` (FuroTooltip) | `null` | Reactive data object holding positioning, disabled, and optional controlled open state. `FuroPopover`'s also has `modal`; `FuroTooltip`'s also has `text` and `delayDuration`. |

## `parcel` fields

### FuroPopover

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Edge of the trigger the content prefers. |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment along the chosen side. |
| `sideOffset` | `number` | `4` | Gap in pixels between trigger and content. |
| `disabled` | `boolean` | `false` | When true, the trigger never opens the popover. |
| `modal` | `boolean` | `false` | When true, focus is trapped and outside interaction is blocked while open. |
| `open` | `boolean \| null` | `null` | When set (non-null), open state is controlled by the consumer; otherwise the component manages it internally. |

### FuroTooltip

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | `string` | `null` | Tooltip body shown when no content slot is supplied. |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Edge of the trigger the content prefers. |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment along the chosen side. |
| `sideOffset` | `number` | `4` | Gap in pixels between trigger and content. |
| `delayDuration` | `number` | `200` | Delay in milliseconds before the tooltip opens on hover. |
| `disabled` | `boolean` | `false` | When true, the tooltip never opens. |
| `open` | `boolean \| null` | `null` | When set (non-null), open state is controlled by the consumer; otherwise the component manages it internally. |

## Events

| Component | Event | Payload | Fires when |
| --- | --- | --- | --- |
| `FuroPopover` | `open:change` | `{ open: boolean }` | Whenever the open state changes (trigger click, outside click, or Escape). |
| `FuroTooltip` | `open:change` | `{ open: boolean }` | Whenever the open state changes (hover, focus, or dismissal). |

## Slots

### FuroPopover

| Slot | Description |
| --- | --- |
| `trigger` | The element the popover is anchored to. Focusable by default (rendered as a button). |
| `content` | The popover body. Holds any interactive content. |

### FuroTooltip

| Slot | Description |
| --- | --- |
| `trigger` | The element the tooltip is anchored to. Focusable by default (rendered as a button). |
| `content` | Rich tooltip body. Falls back to `parcel.text` when omitted. |

## Usage

```vue
<script>
import {
  FuroPopover,
  FuroTooltip,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroPopover,
    FuroTooltip,
  },
}
</script>

<template>
  <FuroPopover
    :parcel="{ side: 'bottom', align: 'start', modal: true }"
    @open:change="context.onEditPopoverOpenChange({ payload: $event })"
  >
    <template #trigger>
      Edit price
    </template>

    <template #content>
      <form @submit.prevent="context.onSubmitPriceEdit()">
        <input
          v-model="context.priceFormValue"
          type="number"
        >
        <button type="submit">
          Save
        </button>
      </form>
    </template>
  </FuroPopover>

  <FuroTooltip :parcel="{ text: 'Shows the total including tax', side: 'top' }">
    <template #trigger>
      <span>Total</span>
    </template>
  </FuroTooltip>
</template>
```

## Rules (per project conventions)

- Neither component follows the form-control (`parcel.value` + `v-model:value`)
  contract — they are overlay/visibility components. Drive open state either
  uncontrolled (omit `parcel.open`) or controlled via `parcel.open` +
  listening to `open:change` (there is no `update:open` event on these two,
  unlike `FuroDialog`/`FuroDrawer` — do not assume `v-model:open` works here).
- Never import the underlying headless primitive (`reka-ui`'s `PopoverRoot`,
  etc.) — only the public `FuroPopover` / `FuroTooltip` exports.
- Keep business logic (what happens on open/close, what the popover form
  submits) in the page/component Context, not inline in the template.
