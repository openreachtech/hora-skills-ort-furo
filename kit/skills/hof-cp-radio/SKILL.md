---
name: hof-cp-radio
description: Use when choosing exactly one option from a short visible list in a repo that consumes @openreachtech/furo-vue (for example "radio buttons", "radio group", "pick one option", "single choice"). Routes to FuroRadio.
---

# FuroRadio

Atom that renders a whole radio group, not a single button: a lone radio is
not a usable control, because the exclusivity that separates it from a
checkbox only exists across a set. Options are declared as data in
`parcel.options`, the way `FuroSelect` declares its choices. The model is the
`value` of the chosen option (`string | number`), or `null` while nothing is
chosen, so it answers "which one", not "yes or no". Use it when the user
should see every option at once.

- Layer: atom
- Import: `import { FuroRadio } from '@openreachtech/furo-vue'`
- Manifest entry: `node_modules/@openreachtech/furo-vue/public/furo-vue/components.json` → `components[].name === 'FuroRadio'`

Written from furo-vue 2.1.0. Read the manifest before writing markup if you
need to confirm this information is still current, because the library may have
added props/events since this skill was written.

## When NOT to use

- A single yes/no value → use `hof-cp-checkbox-toggle`.
- A long list, or one the user searches → use `hof-cp-select`, which keeps the options behind a trigger.
- Several choices at once → use `hof-cp-checkbox-toggle` per option, or `hof-cp-select` with `multiple`.
- Segmented toolbar-style buttons rather than a form field → use `hof-cp-toggle-group`.
- Needs a label / error message around it → wrap in `FuroControlBlock` (see `hof-cp-control-block`), don't hand-roll a `<label>`.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `parcel` | `FuroRadioParcel \| null` | `null` | Furo behavior object. The only public prop; HTML / form attributes pass through. |

## `parcel` fields

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string \| number \| null` | none | The chosen option's value. Supplying this key at all, even as `null`, makes the group controlled. |
| `options` | `Array<FuroRadioOption>` | `[]` | The choices, rendered in order. |
| `invalid` | `boolean` | `false` | Error appearance plus `aria-invalid` on the group. |
| `disabled` | `boolean` | `false` | Disables every option; also honored as a fallthrough `disabled` attribute. |
| `required` | `boolean` | `false` | Marks the group required; also honored as a fallthrough `required` attribute. |
| `size` | `string` | `'1.125rem'` | Diameter of one circle, as a `rem`, `px` or `em` length. The dot inside is derived from it. Any other unit falls back to the default dot size. |

### `FuroRadioOption`

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | none | Text beside the circle. |
| `value` | `string \| number` | none | The value reported when this option is chosen. Keep it unique in the group, since it is also the render key. |
| `disabled` | `boolean` | `false` | Withdraws this one option and leaves the rest usable. A disabled group disables every option whatever each says. |

## Controlled and uncontrolled

The group is controlled when `parcel` owns a `value` key. A controlled group
never follows its own clicks: it emits, and re-renders only when the parent
sends a new `value` back. Omit the key for an uncontrolled group, which starts
with nothing chosen and then tracks its own choice.

The group reads its chosen value from `parcel.value` only. Put `value` in the
parcel whenever the group must start on an option or follow the parent, and
use `v-model:value` (or `@update:value`) to receive each choice.

## Events

| Event | Payload | Fires when |
| --- | --- | --- |
| `change-value` | `RadioEmitPayload` | The user chooses an option. |
| `update:value` | `string \| number \| null` | Same moment; the `v-model:value` channel. |

`RadioEmitPayload` exposes `value` (the chosen option's value), `controlElement`
(the group's root element, or `null`) and `isSelected()` (`false` when nothing
is chosen).

## Slots

| Slot | Scoped props | Description |
| --- | --- | --- |
| `option-label` | `{ option }` | Replaces the label text of every option, for a description, a price or an icon beside the choice. |

Each option's circle and label sit in one `<label>`, so clicking the text
chooses the option.

## Fallthrough attributes

Every attribute you write on the component (`name`, `id`, `aria-*`,
`data-*`, `class`, `style`) lands on the group root, the element that carries
`aria-invalid`. A `parcel` key that is not one of the six above is forwarded
to the same element.

## Appearance

The chosen state reads the `--color-selected` family, the role meaning "the
user chose this", which is distinct from `--color-primary`. Override
`--color-selected` from the app side, as `hof-lib-tokens` describes, to
re-theme every selection control at once. The circle's size lives in
`--furo-radio-size`, set from `parcel.size`.

## Usage

```vue
<script>
import {
  FuroRadio,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroRadio,
  },
}
</script>

<template>
  <FuroRadio
    v-model:value="form.plan"
    :parcel="{
      value: form.plan,
      options: context.planOptions,
      invalid: context.hasPlanError(),
    }"
  />
</template>
```

With a description beside each choice:

```vue
<template>
  <FuroRadio
    v-model:value="form.plan"
    :parcel="{ value: form.plan, options: context.planOptions }"
  >
    <template #option-label="{ option }">
      <span>{{ option.label }}</span>
      <small>{{ context.extractPlanDescription({ option }) }}</small>
    </template>
  </FuroRadio>
</template>
```

## Rules (per project conventions)

- Pass `parcel` + use `v-model:value`. This is the one documented exception
  to the project's general no-`v-model` rule, which applies only to
  custom in-project components, not to `furo-vue` library components.
- Never import the underlying headless primitive, only the public
  `FuroRadio` export.
- Build `options` in the page/component Context (`{field}Options`), not
  inline in the template.
- Pass only the `parcel` keys this skill lists. An unlisted key reaches the
  group root as an attribute rather than doing what you meant, so check a key
  against the manifest rather than trusting silence.
