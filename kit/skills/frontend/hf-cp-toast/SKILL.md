---
name: hf-cp-toast
description: Use when showing a transient notification in a repo that consumes @openreachtech/furo-vue — "toast notification", "success/error snackbar", "show a saved message", "notify the user after an action". Routes to FuroToast, FuroToaster.
---

# FuroToast / FuroToaster

`FuroToast` is the controlled toast-stack organism: the parent owns the
notification queue in its own reactive array (`parcel.toasts`) and removes
entries itself in response to the `dismiss` / `action` events. `FuroToaster`
is a zero-prop wrapper around `FuroToast` that is mounted once (typically in
a layout) and driven imperatively from anywhere in the app through the
exported `toast` helper (`toast.show(...)`, `toast.update(...)`,
`toast.hide(...)`, `toast.clear()`, `toast.configure(...)`) instead of a
parent-owned array. Most pages should reach for `FuroToaster` + `toast`;
reach for `FuroToast` directly only when a specific screen must own and
render its own notification queue.

- Layer: organism (both)
- Import: `import { FuroToast } from '@openreachtech/furo-vue'`
- Import: `import { FuroToaster, toast } from '@openreachtech/furo-vue'`
- Manifest entry: `node_modules/@openreachtech/furo-vue/public/furo-vue/components.json` → `components[].name === 'FuroToast'` / `'FuroToaster'`

Read the manifest before writing markup if you need to confirm it's still
current — the library may have added props/events since this skill was
written.

## When NOT to use

- A persistent inline validation error under a field → use
  `hf-cp-control-block` instead, not a toast.
- A modal that blocks interaction until the user responds → use
  `hf-cp-dialog` instead.
- A floating panel anchored to a specific trigger element (not a
  viewport-corner stack) → use `hf-cp-popover` instead.
- A progress indicator for a multi-step flow → use `hf-cp-stepper`
  instead.

## Props

### FuroToast

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `parcel` | `ToastParcel \| null` | `null` | Reactive behavior object. |

### FuroToaster

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| — | — | — | `FuroToaster` takes no props; configure it through `toast.configure()`. |

## `parcel` fields

### FuroToast

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `toasts` | `Array<ToastEntry>` | `[]` | The queue, owned by the parent. Render order follows the array; remove an entry on dismiss. |
| `position` | `'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | `'bottom-right'` | Viewport placement. |
| `durationInMilliseconds` | `number` | `4000` | Default auto-dismiss in ms. Per-toast `durationInMilliseconds` overrides it. |
| `swipeDirection` | `'right' \| 'left' \| 'up' \| 'down'` | derived from `position` | Swipe-to-dismiss direction. When unset, it follows the position. |
| `label` | `string` | `'Notifications'` | Accessible label for the region. |
| `hotkey` | `Array<string> \| null` | `null` | Keyboard shortcut to focus the viewport (e.g. `['F8']`). |
| `maxVisible` | `number` | `3` | Caps how many toasts render at once (the most recent). The rest stay queued. |

### FuroToaster

`FuroToaster` has no `parcel` array — it takes no props at all. Configure
the underlying viewport (position, duration, `maxVisible`, `richColors`,
…) with `toast.configure({ ... })`.

## Events

### FuroToast

| Event | Payload | Fires when |
| --- | --- | --- |
| `dismiss` | `{ key }` | A toast closed (timeout, swipe, or close button). Remove it from your array. |
| `action` | `{ key }` | The action button was clicked. The toast also dismisses afterward. |

### FuroToaster

`FuroToaster` emits no events — it never mutates a parent-owned array. It
forwards its internal `FuroToast`'s `dismiss` / `action` events into its own
`ToastQueue` singleton instead, which is why the `toast` helper needs no
event wiring from the consumer.

## Slots

### FuroToast

| Slot | Scoped props | Description |
| --- | --- | --- |
| `title` | `{ toast }` | Overrides a toast's title region (falls back to `toast.title`). |
| `description` | `{ toast }` | Overrides a toast's description region (falls back to `toast.description`). |

### FuroToaster

`FuroToaster` declares no slots — customize toast content per call through
the fields passed to `toast.show({ ... })` (`title`, `description`, `type`,
`actions`, …), not through slot markup.

## Usage

Imperative usage with `FuroToaster` + `toast` (mount once, call anywhere):

```vue
<!-- layouts/default.vue -->
<script>
import {
  FuroToaster,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroToaster,
  },
}
</script>

<template>
  <div class="unit-layout">
    <slot />

    <FuroToaster />
  </div>
</template>
```

```vue
<!-- any page/component Context, after a mutation succeeds -->
<script>
import {
  toast,
} from '@openreachtech/furo-vue'

export default class SaveIssuePageContext {
  async onSubmitSave () {
    const key = toast.show({
      title: 'Saving...',
      type: 'loading',
    })

    await this.saveIssue()

    toast.update(key, {
      title: 'Saved',
      type: 'success',
    })
  }
}
</script>
```

Controlled usage with `FuroToast`, when a screen must own its own queue:

```vue
<script>
import {
  FuroToast,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroToast,
  },
}
</script>

<template>
  <FuroToast
    :parcel="{ toasts: context.notificationQueue, position: 'top-right' }"
    @dismiss="context.onDismissNotification({ key: $event.key })"
    @action="context.onNotificationAction({ key: $event.key })"
  />
</template>
```

## Rules (per project conventions)

`FuroToast` / `FuroToaster` are not form controls — neither exposes a
`value` parcel field, so there is no `v-model:value` contract here (unlike
`FuroTextarea`/`FuroTextField`). Follow these contracts instead:

- For `FuroToast`, pass `parcel.toasts` down from a page/component
  Context-owned array, and remove the matching entry from that array
  yourself inside the `dismiss` (and, where relevant, `action`) event
  handler — the component never mutates your array for you.
- For `FuroToaster`, never pass props or listen for events — drive it only
  through the imperative `toast.show()` / `toast.update()` / `toast.hide()`
  / `toast.clear()` / `toast.configure()` helper, called from the
  page/component Context (e.g. inside an `on{Action}` method), not inline
  in the template.
- Never import the underlying headless primitive directly. `ToastQueue` is a
  public export of `@openreachtech/furo-vue`, but drive toasts through the
  `toast` helper (`toast.show`/`update`/`hide`/`clear`/`configure`) rather
  than reaching for `ToastQueue` directly, unless you specifically need to
  build a custom queue consumer.
