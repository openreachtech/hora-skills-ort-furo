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

Each manifest record also carries a `types` array beside `slots`. When a prop,
`parcel` field, or event payload names a nested type
(`Array<FuroSelectOption>`, `FuroTableColumn`, …), read that name from the same
record's `types` array — each entry carries the authored `definition` plus a
parsed `fields` list (`name`, `type`, `required`) for an object shape, or
`values` for a string union. Read the shape from the manifest, not from
component source.

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
| `disabled` | `boolean` | `false` | Disables interaction; also respects a fallthrough `disabled` attribute. With `asChild`, that attribute is consumed rather than forwarded to the child. |
| `loading` | `boolean` | `false` | Shows the loading slot and blocks the click emit. |
| `asChild` | `boolean` | `false` | Merge props and behavior onto a single child element. `disabled` and `type` are **not** bound on that child. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button type. Withheld with `asChild`, so write `type` on the child itself. |

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

## `asChild`: the attribute contract

The slot child is rendered as the element itself, so `disabled` and `type` are
not bound on it — whether they arrive through the `parcel` or as a fallthrough
attribute. `<a>` has no `disabled` attribute, and forcing `type="button"` would
override a child `<button>`'s own semantics. Write `type` on the child.

`class`, `aria-disabled`, `aria-busy` and every other fallthrough attribute do
reach the child. The child's own props win over the button's, except event
handlers, which run alongside — the button's first.

## `asChild`: a disabled child cannot be activated

While `disabled` or `loading` is true the child also gets `tabindex="-1"`, and
the default action of `click` and of Enter / Space `keydown` is prevented — so a
"disabled" `<a href>`, `RouterLink` or `NuxtLink` does not navigate.

Pass an element child, or a component that binds `$attrs` on its root. A
component with `inheritAttrs: false` that never re-binds `$attrs` receives none
of this — no `tabindex`, no `aria-disabled`, not even the class — and neither
guard runs.

## Appearance

The `outline` variant's border reads `--color-input`, the stronger of the
library's two border tiers. The loading spinner stops under
`prefers-reduced-motion: reduce`, while `loading` still blocks the click emit.

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
- With `parcel.asChild`, pass an element (or a component that binds `$attrs` on
  its root) and write `type` on that child. Never rely on a disabled `asChild`
  link staying navigable.
- Pass only the `parcel` keys this skill lists. A component reads the keys it
  names and ignores the rest, so a mistyped key changes nothing and reports
  nothing. Some components warn in development through Vue's warning channel,
  naming the unknown key and the accepted ones — but not every component does,
  so check a key against the manifest rather than trusting silence.
