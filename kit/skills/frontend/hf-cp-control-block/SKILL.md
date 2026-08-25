---
name: hf-cp-control-block
description: Use when wrapping a form field with a label, hint, or error message in a repo that consumes @openreachtech/furo-vue — "add a label to this field", "show a validation error under the input", "required field marker", "horizontal form layout". Routes to FuroControlBlock.
---

# FuroControlBlock

Labeled wrapper molecule that frames any single form-field atom with a label,
a required marker, and error messages. It is domain-agnostic: the actual
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

- You need the actual input control, not just the label/error frame — pick the atom itself: `hf-cp-text-field`, `hf-cp-textarea`, `hf-cp-checkbox-toggle`, `hf-cp-select`, `hf-cp-date-time`.
- You need a floating tooltip/hint bubble rather than an inline label+error block → use `hf-cp-popover`.
- You need an inline "click to edit" affordance rather than a standing labeled field → use `hf-cp-editable-field`.

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

- `default` — the control to frame. Pass the same id as the parcel `controlId` so label `for` resolves.

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
