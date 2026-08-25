---
name: hf-cp-dialog
description: Use when building a modal, a confirm/destructive-action prompt, or a side panel, in a repo that consumes @openreachtech/furo-vue — "modal", "confirmation dialog", "are you sure prompt", "side panel", "delete confirmation". Routes to FuroDialog, FuroAlertDialog, FuroDrawer.
---

# FuroDialog / FuroAlertDialog / FuroDrawer

Three organism-layer overlays that block or partially block the page, each for
a different job. `FuroDialog` is the general-purpose modal (or non-modal, via
`parcel.modal: false`) with header/body/footer regions and a close button —
use it for forms, detail views, or any freeform modal content.
`FuroAlertDialog` is a narrower, purpose-built confirmation prompt: no close
button, outside-click never dismisses, and it ships built-in confirm/cancel
buttons (with a `destructive` tone) — use it specifically when you need the
user to make an explicit yes/no decision (e.g. delete confirmation).
`FuroDrawer` is an edge-anchored sliding panel (left/right/top/bottom) with
optional drag handle, swipe-to-dismiss, and snap points — use it for
persistent side panels, mobile sheet-style UI, or content too long/wide for a
centered modal. All three share the same `title` / `description` / `busy` /
`initialFocus` / `closeOnEscape` keys in their `parcel`.

- Layer: organism
- Import: `import { FuroDialog, FuroAlertDialog, FuroDrawer } from '@openreachtech/furo-vue'`
- Manifest entry: `node_modules/@openreachtech/furo-vue/public/furo-vue/components.json` → `components[].name === 'FuroDialog'` / `'FuroAlertDialog'` / `'FuroDrawer'`

Read the manifest before writing markup if you need to confirm this
information is still current — the library may have added props/events since
this skill was written.

## When NOT to use

- Small, click-anchored floating panel that doesn't need to block the page (inline edit, action panel) → use `hf-cp-popover` (`FuroPopover`), not a non-modal `FuroDialog`.
- Simple hover/focus hint text → use `hf-cp-popover` (`FuroTooltip`).
- A menu of discrete actions anchored to a trigger → use `hf-cp-dropdown-menu`.
- Toast-style transient feedback (success/error message, not a decision) → use `hf-cp-toast`.
- Inline expand/collapse of content within the page flow (not an overlay) → use `hf-cp-collapsible`.
- Need a plain "yes/no" without a destructive tone but the decision is trivial and low-stakes — `FuroAlertDialog` is still correct; don't reach for `FuroDialog` + hand-rolled footer buttons just to avoid it, since `FuroAlertDialog` already encodes the "block until decided" behavior (no close button, no outside-click dismiss).

## Props

All three take a single `parcel` prop — no other props.

| Component | Prop | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `FuroDialog` | `parcel` | `FuroDialogParcel \| null` | `null` | Reactive behavior object. |
| `FuroAlertDialog` | `parcel` | `FuroAlertDialogParcel \| null` | `null` | Reactive behavior object. |
| `FuroDrawer` | `parcel` | `FuroDrawerParcel \| null` | `null` | Reactive behavior object. |

## `parcel` fields

### FuroDialog

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `open` | `boolean` | `—` | Controlled open state. When omitted, the dialog manages its own state. |
| `disabled` | `boolean` | `false` | Disables the trigger. |
| `modal` | `boolean` | `true` | `false` renders without the overlay scrim and keeps the page interactive. |
| `title` | `string \| null` | `null` | Heading text. Provide a title (or the title slot) for accessibility. |
| `description` | `string \| null` | `null` | Sub-heading text below the title. |
| `closeText` | `string` | `'Close'` | Accessible label for the built-in close button. |
| `closeOnOutsideClick` | `boolean` | `true` | `false` ignores overlay / outside-click dismissal. |
| `closeOnEscape` | `boolean` | `true` | `false` ignores the Escape key. |
| `size` | `'sm' \| 'default' \| 'lg' \| 'fullscreen'` | `'default'` | Content width variant. `fullscreen` fills the viewport. |
| `busy` | `boolean` | `false` | While true, all dismissal is blocked — use during async work. |
| `initialFocus` | `string \| null` | `null` | CSS selector (scoped to the content) of the element to focus on open. |

### FuroAlertDialog

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `open` | `boolean` | `—` | Controlled open state. When omitted, the dialog manages its own state. |
| `disabled` | `boolean` | `false` | Disables the trigger. |
| `title` | `string \| null` | `null` | Heading text. Provide a title (or the title slot) for accessibility. |
| `description` | `string \| null` | `null` | Sub-heading text below the title. |
| `confirmText` | `string` | `'Confirm'` | Label for the built-in confirm button. |
| `cancelText` | `string` | `'Cancel'` | Label for the built-in cancel button. |
| `tone` | `'default' \| 'destructive'` | `'default'` | `destructive` renders the confirm button with the destructive variant. |
| `closeOnEscape` | `boolean` | `true` | `false` ignores the Escape key. |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | Content width variant. |
| `busy` | `boolean` | `false` | While true, dismissal is blocked and the action buttons are disabled (confirm shows a loading state). |
| `initialFocus` | `string \| null` | `null` | CSS selector (scoped to the content) of the element to focus on open. When unset, the cancel button is focused. |

### FuroDrawer

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `open` | `boolean` | `—` | Controlled open state. When omitted, the drawer manages its own state. |
| `disabled` | `boolean` | `false` | Disables the trigger. |
| `modal` | `boolean \| 'trap-focus'` | `true` | `true`: overlay + focus trap + scroll lock. `'trap-focus'`: focus trapped, page interactive. `false`: fully non-modal. |
| `title` | `string \| null` | `null` | Heading text. Provide a title (or the title slot) for accessibility. |
| `description` | `string \| null` | `null` | Sub-heading text below the title. |
| `closeText` | `string` | `'Close'` | Accessible label for the built-in close button. |
| `closeOnOutsideClick` | `boolean` | `true` | `false` ignores overlay / outside-click dismissal. |
| `closeOnEscape` | `boolean` | `true` | `false` ignores the Escape key. |
| `side` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | Edge the panel docks to, slides in from, and is swiped toward to dismiss. |
| `size` | `'sm' \| 'default' \| 'lg' \| 'fullscreen'` | `'default'` | Cross-axis extent: width for left/right, height for top/bottom. `fullscreen` fills the docking axis. |
| `snapPoints` | `Array<number \| string> \| null` | `null` | Preset resting positions: fractions 0–1, pixels > 1, or `'148px'`/`'30rem'` strings. |
| `activeSnapPoint` | `number \| string \| null` | `null` | Controlled active snap point. When set, the parent owns it (`update:activeSnapPoint`). |
| `sequentialSnap` | `boolean` | `false` | `true` snaps one point at a time; `false` snaps to the nearest by distance. |
| `swipeToOpen` | `boolean` | `false` | Renders an edge grab strip so the panel can be swiped open from closed. |
| `dragHandle` | `boolean` | `false` | Renders a drag handle (grab indicator) on the docked edge. |
| `busy` | `boolean` | `false` | While true, all dismissal is blocked — use during async work. |
| `initialFocus` | `string \| null` | `null` | CSS selector (scoped to the drawer content) of the element to focus on open. |

## Events

| Component | Event | Payload | Fires when |
| --- | --- | --- | --- |
| `FuroDialog` | `update:open` | `boolean` | Open state changed — enables `v-model:open`. |
| `FuroDialog` | `open:change` | `{ open: boolean }` | Open state changed (semantic form). |
| `FuroAlertDialog` | `confirm` | `—` | The confirm action was chosen. |
| `FuroAlertDialog` | `cancel` | `—` | The cancel action was chosen (button or Escape). |
| `FuroAlertDialog` | `update:open` | `boolean` | Open state changed — enables `v-model:open`. |
| `FuroAlertDialog` | `open:change` | `{ open: boolean }` | Open state changed (semantic form). |
| `FuroDrawer` | `update:open` | `boolean` | Open state changed — enables `v-model:open`. |
| `FuroDrawer` | `open:change` | `{ open: boolean }` | Open state changed (semantic form). |
| `FuroDrawer` | `update:activeSnapPoint` | `number \| string \| null` | Active snap point changed — enables `v-model:activeSnapPoint`. |
| `FuroDrawer` | `snap:change` | `{ snapPoint: number \| string \| null }` | Active snap point changed (semantic form). |

## Slots

### FuroDialog

| Slot | Description |
| --- | --- |
| `trigger` | Optional element that opens the dialog, rendered via as-child. Omit when opened via controlled `open`. |
| `title` | Overrides the heading (falls back to `parcel.title`). |
| `description` | Overrides the description (falls back to `parcel.description`). |
| `default` (scoped: `{ close }`) | Dialog body content. Receives a `close()` slot prop to dismiss from inside. |
| `footer` (scoped: `{ close }`) | Footer region. Receives a `close()` slot prop so action buttons can dismiss the dialog. |
| `close` | Content of the built-in close button (defaults to ✕). |

### FuroAlertDialog

| Slot | Description |
| --- | --- |
| `trigger` | Optional element that opens the dialog, rendered via as-child. Omit when opened via controlled `open`. |
| `title` | Overrides the heading (falls back to `parcel.title`). |
| `description` | Overrides the description (falls back to `parcel.description`). |
| `default` | Optional body content rendered between the heading and the footer. |
| `footer` (scoped: `{ confirm, cancel }`) | Overrides the built-in confirm / cancel buttons. Receives `confirm()` and `cancel()` slot props. |

### FuroDrawer

| Slot | Description |
| --- | --- |
| `trigger` | Optional element that opens the drawer (rendered via as-child). Omit when opened via controlled `open` or swipe-to-open. |
| `title` | Overrides the heading (falls back to `parcel.title`). |
| `description` | Overrides the description (falls back to `parcel.description`). |
| `default` (scoped: `{ close }`) | Drawer body content. Receives a `close()` slot prop to dismiss from inside. |
| `footer` (scoped: `{ close }`) | Footer region (e.g. action buttons). Receives a `close()` slot prop. |
| `close` | Content of the built-in close button (defaults to ✕). |

## Usage

```vue
<script>
import {
  FuroDialog,
  FuroAlertDialog,
  FuroDrawer,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroDialog,
    FuroAlertDialog,
    FuroDrawer,
  },
}
</script>

<template>
  <FuroDialog
    v-model:open="context.isEditDialogOpen"
    :parcel="{ title: 'Edit member', busy: context.isSubmitting }"
  >
    <template #trigger>
      <button type="button">
        Edit
      </button>
    </template>

    <template #default="{ close }">
      <MemberEditForm @submitted="close()" />
    </template>
  </FuroDialog>

  <FuroAlertDialog
    v-model:open="context.isDeleteConfirmOpen"
    :parcel="{
      title: 'Delete this member?',
      description: 'This action cannot be undone.',
      tone: 'destructive',
      busy: context.isDeleting,
    }"
    @confirm="context.onConfirmDelete()"
    @cancel="context.onCancelDelete()"
  />

  <FuroDrawer
    v-model:open="context.isFilterDrawerOpen"
    :parcel="{ side: 'right', title: 'Filters', dragHandle: true }"
  >
    <template #default>
      <FilterForm @apply="context.onApplyFilters({ payload: $event })" />
    </template>
  </FuroDrawer>
</template>
```

## Rules (per project conventions)

- All three use `parcel` + `v-model:open` for open/close state — this is the
  documented exception to the project's general no-`v-model` rule, which
  applies only to custom in-project components, not to `furo-vue` library
  components. `FuroDrawer` also supports `v-model:activeSnapPoint`.
- None of the three follow the form-control (`parcel.value`) contract — they
  are visibility/overlay components, not inputs.
- `FuroAlertDialog` is not a generic modal: it has no `update:open`-driven
  close button and no outside-click dismissal by design. Its real contract is
  the `confirm` / `cancel` events — always handle both, and do the actual
  destructive action (e.g. the delete mutation) inside the `confirm` handler
  in the page/component Context, never inline in the template.
- Never import the underlying headless primitives (`reka-ui`'s `DialogRoot`,
  etc.) — only the public `FuroDialog` / `FuroAlertDialog` / `FuroDrawer`
  exports.
- Keep business logic (what happens on confirm/cancel/close, what data the
  dialog body submits) in the page/component Context, not inline in the
  template.
