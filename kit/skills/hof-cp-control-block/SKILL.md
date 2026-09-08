---
name: hof-cp-control-block
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

Each manifest record also carries a `types` array beside `slots`. When a prop,
`parcel` field, or event payload names a nested type
(`Array<FuroSelectOption>`, `FuroTableColumn`, …), read that name from the same
record's `types` array — each entry carries the authored `definition` plus a
parsed `fields` list (`name`, `type`, `required`) for an object shape, or
`values` for a string union. Read the shape from the manifest, not from
component source.

## When NOT to use

- You need the actual input control, not just the label/error frame — pick the atom itself: `hof-cp-text-field`, `hof-cp-textarea`, `hof-cp-checkbox-toggle`, `hof-cp-select`, `hof-cp-date-time`.
- You need a floating tooltip/hint bubble rather than an inline label+error block → use `hof-cp-popover`.
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
| `default` | `{ errorId: string \| null }` | The control to frame. Pass the same id as the parcel `controlId` so label `for` resolves, and bind `errorId` onto the control's `aria-describedby` so the error text is announced again when focus returns to the field. |

### `errorId`

The block cannot set attributes on a slot child, so it hands the id of its error
region to the default slot and you bind it on the control you own.

- `` `${controlId}-error` `` when the parcel carries a `controlId`, otherwise
  `` `${id}-error` `` from an `id` written on the block.
- `null` while the block is valid, or when it has neither id. Vue drops an
  attribute bound to `null`, so no guard is needed on your side and
  `aria-describedby` never points at an element that is not rendered.
- Nothing is generated: with neither id you get `null`, not an invented value.
  A non-string `id` is refused rather than coerced.
- It ships untyped — a TypeScript consumer destructuring it gets `any`.

## Fallthrough attributes

`class` and `style` compose onto the root. Every other DOM attribute you write
on the component — `id`, `aria-*`, `data-*` — lands on its rendered root
element, so a `<label for>` resolves and an `aria-describedby` reference points
at something real.

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
    <template #default="{ errorId }">
      <FuroTextField
        id="full-name"
        v-model:value="form.fullName"
        :parcel="{ invalid: context.hasFullNameError() }"
        :aria-describedby="errorId"
      />
    </template>
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
- Take the `errorId` scoped slot prop and bind it to the slotted control's
  `aria-describedby` whenever the block can render error messages. `role="alert"`
  announces a message as it appears; `aria-describedby` is what re-announces it
  when focus returns to the field.
- Pass only the `parcel` keys this skill lists. A component reads the keys it
  names and ignores the rest, so a mistyped key changes nothing and reports
  nothing. Some components warn in development through Vue's warning channel,
  naming the unknown key and the accepted ones — but not every component does,
  so check a key against the manifest rather than trusting silence.
