---
name: hof-cp-control-block
description: Use when wrapping a form field with a label, required marker, or error message in a repo that consumes @openreachtech/furo-vue — "add a label to this field", "show a validation error under the input", "required field marker", "horizontal form layout". Routes to FuroControlBlock.
---

# FuroControlBlock

Labeled wrapper molecule that frames any single form-field atom with a label,
a required marker, and error messages. It has no hint (helper text) of its
own: see [Hint text](#hint-text). It is domain-agnostic: the actual
control (`FuroTextField`, `FuroSelect`, `FuroCheckbox`, etc.) is passed
through its default slot, so `FuroControlBlock` never knows which atom it
wraps and emits no events of its own — the slotted control keeps owning its
own `change-value` / `commit-value` / `update:value` contract.

- Layer: molecule
- Import: `import { FuroControlBlock } from '@openreachtech/furo-vue'`
- Manifest entry: `node_modules/@openreachtech/furo-vue/public/furo-vue/components.json` → `components[].name === 'FuroControlBlock'`

Read the manifest before writing markup if you need to confirm this
information is still current — the library may have added props/events since
this skill was written.

## When NOT to use

- You need the actual input control, not just the label/error frame — pick the atom itself: `hof-cp-text-field`, `hof-cp-textarea`, `hof-cp-checkbox-toggle`, `hof-cp-select`, `hof-cp-date-time`.
- You need a floating tooltip bubble rather than an inline label+error block → use `hof-cp-popover`.
- You need an inline "click to edit" affordance rather than a standing labeled field → use `hof-cp-editable-field`.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `parcel` | `ControlBlockParcel \| null` | `null` | Reactive data object holding the label, control id, error messages, required flag, and orientation. |

## `parcel` fields

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string \| null` | `null` | Label text. When null, no label is rendered. |
| `controlId` | `string \| null` | `null` | Id of the slotted control, rendered as label `for`. When null, the label has no `for`. |
| `errorMessages` | `Array<string>` | `[]` | Error messages. A non-empty array marks the block invalid and renders one line per message. |
| `required` | `boolean` | `false` | When true, renders a required mark (*) after the label. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout of label vs control. `vertical` stacks; `horizontal` places the label beside the control. |

## Events

None. `FuroControlBlock` emits nothing — the slotted control owns its own
`change-value` / `commit-value` / `update:value` events.

## Slots

| Slot | Scoped props | Description |
| --- | --- | --- |
| `default` | `{ errorId: string \| null }` | The control to frame. Pass the same id as the parcel `controlId` so label `for` resolves. `errorId` is the id of the error list, `null` while the block is valid. Slot props exist from furo-vue 2.1.0. |

### Error announcements

The error list carries `role="alert"`, so a message is announced as it
appears. It is rendered only while `errorMessages` is non-empty. From furo-vue
2.1.0 the default slot hands out `errorId`, so bind it on the control to have
the error announced again when focus returns to the field:

```vue
<FuroControlBlock
  :parcel="{
    label: 'Email address',
    controlId: 'email',
    errorMessages: context.emailErrorMessages,
  }"
>
  <template #default="{ errorId }">
    <FuroTextField
      id="email"
      v-model:value="form.email"
      :aria-describedby="errorId"
    />
  </template>
</FuroControlBlock>
```

`errorId` is `` `${controlId}-error` ``, or `` `${id}-error` `` from the block's
own `id` attribute when the parcel has no `controlId`. It is `null` when the
block is valid or has neither id, so give the block a `controlId`. Check the
control's skill for where `aria-describedby` lands. Before 2.1.0 the slot hands
out nothing and the error list has no id, so render your own message element
with an id and bind that id on the control.

### Hint text

`FuroControlBlock` has no hint: no parcel key and no slot holds helper text.
Render the helper text yourself, as an element beside the block or inside the
default slot next to the control (the slot lands in the block's `.control`
wrapper), and give it an id when the control needs it in `aria-describedby`.

## Fallthrough attributes

`class` and `style` compose onto the root. From furo-vue 2.1.0 every other
attribute you write on the component (`id`, `aria-*`, `data-*`) lands on the
root too, and an `id` there is the fallback for `errorId` when the parcel has
no `controlId`. Before 2.1.0 those attributes are dropped and reach no element.

## Usage

```vue
<script>
import {
  FuroControlBlock,
  FuroTextField,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroControlBlock,
    FuroTextField,
  },
}
</script>

<template>
  <FuroControlBlock
    :parcel="{
      label: 'Full name',
      controlId: 'full-name',
      errorMessages: context.fullNameErrorMessages,
      required: true,
    }"
  >
    <FuroTextField
      id="full-name"
      v-model:value="form.fullName"
      :parcel="{ invalid: context.hasFullNameError() }"
    />
  </FuroControlBlock>
</template>
```

Horizontal orientation:

```vue
<template>
  <FuroControlBlock
    :parcel="{
      label: 'Newsletter',
      controlId: 'newsletter-toggle',
      orientation: 'horizontal',
    }"
  >
    <FuroCheckbox
      id="newsletter-toggle"
      v-model:value="form.subscribed"
    />
  </FuroControlBlock>
</template>
```

## Rules (per project conventions)

- `FuroControlBlock` is not a form-control itself, so it has no `value` and no
  `v-model:value` contract — pass `parcel` for label/error/orientation only,
  and put `v-model:value` on the slotted control atom instead.
- Never import the underlying headless primitive — only the public
  `FuroControlBlock` export.
- Compute `errorMessages` and `required` in the page/component Context
  (e.g. a `{field}ErrorMessages` getter), not inline in the template.
- Pass only the `parcel` keys this skill lists. A component reads the keys it
  names and ignores the rest, so a mistyped key changes nothing and reports
  nothing, so check a key against the manifest rather than trusting silence.
