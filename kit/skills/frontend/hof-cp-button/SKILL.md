---
name: hof-cp-button
description: Use when adding a clickable action trigger in a repo that consumes @openreachtech/furo-vue — "submit button", "primary button", "icon button", "loading button", "delete action button". Routes to FuroButton.
---

# FuroButton

Atom-layer action trigger. It is **not** a form-control value component — it
has no `parcel.value` and no `v-model` contract. It exposes a
`variant`/`size` visual system, `disabled`/`loading` interaction states, and
an `asChild` composition mode for merging button behavior onto another
element (e.g. an anchor or a dropdown-menu trigger). Its only contract with
the outside world is the native `click` event.

- Layer: atom
- Import: `import { FuroButton } from '@openreachtech/furo-vue'`
- Manifest entry: `node_modules/@openreachtech/furo-vue/public/furo-vue/components.json` → `components[].name === 'FuroButton'`

Read the manifest before writing markup if you need to confirm this
information is still current — the library may have added props/events since
this skill was written.

## When NOT to use

- You need a menu of multiple actions behind a single trigger → use `hof-cp-dropdown-menu` (its default trigger slot is already `FuroButton`-styled; don't nest a separate `FuroButton` inside it unless overriding the trigger content).
- You need a floating tooltip/panel anchored to a trigger → use `hof-cp-popover`.
- You need a modal/drawer opened from a click → use `hof-cp-dialog` for the panel itself; `FuroButton` is still the right choice for the element that opens it.
- You need a toggle that holds boolean state (pressed/unpressed, checked/unchecked) rather than firing a one-shot action → use `hof-cp-checkbox-toggle` or `hof-cp-toggle-group`.
- You need an inline value editor, not an action → use `hof-cp-editable-field`.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `parcel` | `FuroButtonParcel \| null` | `null` | Furo behavior object. The only public prop; HTML attributes pass through. |

## `parcel` fields

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `FuroButtonVariant` | `'default'` | Visual style preset. Six variants exist: default, secondary, destructive, outline, ghost, link. |
| `size` | `FuroButtonSize` | `'default'` | Size preset. Four sizes exist: default, sm, lg, and a square icon size. |
| `disabled` | `boolean` | `false` | Disables interaction; also respects a fallthrough `disabled` attribute. |
| `loading` | `boolean` | `false` | Shows the loading slot and blocks the click emit. |
| `asChild` | `boolean` | `false` | Merge props and behavior onto a single child element. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button type when not `asChild`. |

## Events

| Event | Payload | Fires when |
| --- | --- | --- |
| `click` | `ButtonEmitPayload` | User activates the button. Not fired while `disabled` or `loading`. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Button label or icon content. |
| `loading` | Custom spinner in the loading overlay (default: `ph:circle-notch`). |

## Usage

```vue
<script>
import {
  FuroButton,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroButton,
  },
}
</script>

<template>
  <FuroButton
    :parcel="{ variant: 'destructive', loading: context.isDeleting }"
    @click="context.onClickDelete({ payload: $event })"
  >
    Delete
  </FuroButton>

  <FuroButton
    :parcel="{ variant: 'outline', size: 'sm', disabled: context.isSubmitDisabled() }"
    type="submit"
  >
    Save changes
  </FuroButton>
</template>
```

With `asChild` composition onto an anchor:

```vue
<template>
  <FuroButton :parcel="{ variant: 'link', asChild: true }">
    <a href="/help">Get help</a>
  </FuroButton>
</template>
```

## Rules (per project conventions)

- `FuroButton` is an action trigger, not a form-control — it carries no
  `parcel.value` and there is no `v-model:value` to wire up. Its only emit
  contract is `click`, which fires a `ButtonEmitPayload` and is suppressed
  automatically while `disabled` or `loading` are true.
- Never import the underlying headless primitive — only the public
  `FuroButton` export.
- Keep the decision of what a click actually does (submit a form, call a
  Submitter, navigate) in the page/component Context as a named method
  (e.g. `onClickDelete`); the template should only forward `$event` to it.
