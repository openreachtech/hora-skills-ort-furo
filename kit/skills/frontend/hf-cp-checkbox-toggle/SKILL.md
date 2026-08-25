---
name: hf-cp-checkbox-toggle
description: Use when building a boolean control in a repo that consumes @openreachtech/furo-vue — "checkbox", "agree to terms checkbox", "on/off switch", "toolbar toggle button", "instant setting switch". Routes to FuroCheckbox, FuroToggle.
---

# FuroCheckbox and FuroToggle

Two boolean-control atoms with different intents. `FuroCheckbox` is for form
fields where the user marks a box as part of a larger submission (agree to
terms, select rows, indeterminate "select all") — it supports an
`indeterminate` third visual state and integrates with `FuroControlBlock` for
labels/errors like any other field. `FuroToggle` is a pressed/unpressed button
for instant, self-contained on/off actions (toolbar buttons, inline settings
switches) built on a headless toggle primitive with `aria-pressed` /
`data-state` semantics — it is not meant to sit inside a validated form and has
no `invalid`/`required` concept. Pick `FuroCheckbox` when the boolean is a
field of a form; pick `FuroToggle` when it's a standalone switch whose effect
applies immediately.

- Layer: atom
- Import:
  - `import { FuroCheckbox } from '@openreachtech/furo-vue'`
  - `import { FuroToggle } from '@openreachtech/furo-vue'`
- Manifest entry: `node_modules/@openreachtech/furo-vue/public/furo-vue/components.json` → `components[].name === 'FuroCheckbox' | 'FuroToggle'`

Read the manifest before writing markup if you need to confirm this
information is still current — the library may have added props/events since
this skill was written.

## When NOT to use

- Grouped, mutually-exclusive or multi-select toolbar buttons → use `hf-cp-toggle-group` instead of wiring multiple `FuroToggle` by hand.
- Needs a label / hint / error message around it → wrap in `FuroControlBlock` (see `hf-cp-control-block`), don't hand-roll a `<label>`.
- Picking a value from a list rather than a plain boolean → use `hf-cp-select`.
- A momentary action trigger (submit, delete, open dialog) rather than a persistent on/off state → use `hf-cp-button`.

## Props

| Component | Prop | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| FuroCheckbox | `parcel` | `FuroCheckboxParcel \| null` | `null` | Furo behavior object. The only public prop; HTML attributes pass through. |
| FuroToggle | `parcel` | `FuroToggleParcel \| null` | `null` | Reactive data object holding the pressed value, variant, size, and disabled flag. |

## `parcel` fields

### FuroCheckbox

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `FuroCheckboxValue` | — | Controlled checked state. Presence of this key (`Object.hasOwn`) enables controlled mode. |
| `indeterminate` | `boolean` | `false` | When true, shows the [-] indicator; `value` still reflects the checked boolean. |
| `invalid` | `boolean` | `false` | `.invalid` class plus `aria-invalid` on the checkbox root. |
| `disabled` | `boolean` | `false` | Disables interaction; also respects a fallthrough `disabled` attribute. |
| `required` | `boolean` | `false` | Forwarded to the root; also respects a fallthrough `required` attribute. |
| `size` | `string` | `'1.125rem'` | Box width and height; the icon uses 8/9 of the box. |

### FuroToggle

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `boolean` | — | Controlled pressed state. Present means controlled; absent means uncontrolled (starts released). |
| `variant` | `'default' \| 'outline'` | `'default'` | `default` is borderless and fills the accent surface when pressed; `outline` adds a border. |
| `size` | `'default' \| 'sm' \| 'lg'` | `'default'` | Control height and padding. |
| `disabled` | `boolean` | `false` | Blocks interaction; also honored from a fallthrough `disabled` attribute. |

## Events

### FuroCheckbox

| Event | Payload | Fires when |
| --- | --- | --- |
| `change-value` | `CheckboxEmitPayload` | Fired on each committed toggle from the checkbox root. |
| `update:value` | `FuroCheckboxValue` | Checked boolean after a toggle (`v-model:value`). |
| `update:indeterminate` | `boolean` | Indeterminate flag after a toggle (`v-model:indeterminate`). |

### FuroToggle

| Event | Payload | Fires when |
| --- | --- | --- |
| `change-value` | `ToggleEmitPayload` | Fired on every press / release; wraps a CustomEvent exposing value and the control element. |
| `update:value` | `boolean` | v-model sync of the pressed state. |

## Slots

- `FuroCheckbox`:
  - `indicator` — checked indicator. Default: `ph:check-bold` when value is true.
  - `indeterminate-indicator` — indeterminate indicator. Default: `ph:minus-bold` when indeterminate.
- `FuroToggle`:
  - `default` (scoped props: `{ pressed }`) — toggle label or icon. `pressed` reflects the current state for conditional content.

## Usage

```vue
<script>
import {
  FuroCheckbox,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroCheckbox,
  },
}
</script>

<template>
  <FuroCheckbox
    v-model:value="form.agreedToTerms"
    :parcel="{ invalid: context.hasAgreementError(), required: true }"
  />
</template>
```

`FuroToggle` for an instant toolbar switch:

```vue
<script>
import {
  FuroToggle,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroToggle,
  },
}
</script>

<template>
  <FuroToggle
    v-model:value="isBoldActive"
    :parcel="{ variant: 'outline', size: 'sm' }"
    @change-value="context.onToggleBold({ payload: $event })"
  >
    Bold
  </FuroToggle>
</template>
```

## Rules (per project conventions)

- Pass `parcel` + use `v-model:value` (and `v-model:indeterminate` for
  `FuroCheckbox`) — this is the one documented exception to the project's
  general no-`v-model` rule, which applies only to custom in-project
  components, not to `furo-vue` library components.
- Never import the underlying headless primitive — only the public
  `FuroCheckbox` / `FuroToggle` exports.
- Put the effect of a `FuroToggle` press (e.g. applying a formatting command,
  flipping a setting) in the page/component Context's `on{Toggle}Change`
  method, not inline in the template.
