---
name: hof-cp-text-field
description: Use when building a single-line text input in a repo that consumes @openreachtech/furo-vue — "text input", "email field", "password field", "number input", "file upload". Routes to FuroTextField, FuroEmailField, FuroPasswordField, FuroNumberField, FuroFileField.
---

# FuroTextField and typed variants

Single-line text input atoms. `FuroTextField` is the plain generic input;
`FuroEmailField`, `FuroPasswordField`, `FuroNumberField`, and `FuroFileField` are
typed variants that hard-code the underlying input semantics (`type="email"`,
`type="password"`, a numeric spinbutton, `type="file"`) rather than relying on a
parent passing a native `type` attribute onto `FuroTextField`. Pick the typed
variant that matches the data you're collecting instead of
`FuroTextField type="email"` — the typed variants bake in the right payload
helpers, ARIA/ validation semantics, and (for number/file) a materially different
internal structure that `FuroTextField` lacks.

- Layer: atom
- Import:
  - `import { FuroTextField } from '@openreachtech/furo-vue'`
  - `import { FuroEmailField } from '@openreachtech/furo-vue'`
  - `import { FuroPasswordField } from '@openreachtech/furo-vue'`
  - `import { FuroNumberField } from '@openreachtech/furo-vue'`
  - `import { FuroFileField } from '@openreachtech/furo-vue'`
- Manifest entry: `node_modules/@openreachtech/furo-vue/public/furo-vue/components.json` → `components[].name === 'FuroTextField' | 'FuroEmailField' | 'FuroPasswordField' | 'FuroNumberField' | 'FuroFileField'`

Read the manifest before writing markup if you need to confirm it's still
current — the library may have added props/events since this skill was
written.

## When NOT to use

- Multi-line text (comments, descriptions) → use `hof-cp-textarea` (`FuroTextarea`) instead.
- Needs a label / hint / error message around it → wrap in `FuroControlBlock` (see `hof-cp-control-block`), don't hand-roll a `<label>`.
- Picking a value from a fixed or searchable list rather than typing free text → use `hof-cp-select` (`FuroSelect` / `FuroAutocompleteField`).
- An in-place edit of an already-displayed value → use `hof-cp-editable-field`.
- Date/time entry → use `hof-cp-date-time`, not `FuroTextField` with manual formatting.

## Props

All five components declare only `parcel` as a public prop; native HTML
attributes pass through as fallthrough attrs.

| Component | Prop | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| FuroTextField | `parcel` | `FuroTextFieldParcel \| null` | `null` | Behavior-controlling props as one object. Native HTML attributes pass through. |
| FuroEmailField | `parcel` | `FuroEmailFieldParcel \| null` | `null` | Behavior-controlling props as one object. Native HTML attributes pass through. |
| FuroPasswordField | `parcel` | `FuroPasswordFieldParcel \| null` | `null` | Behavior-controlling props as one object. Native HTML attributes pass through. |
| FuroNumberField | `parcel` | `FuroNumberFieldParcel \| null` | `null` | The only declared prop; v-bind spread onto the root plus Furo extensions. Other attributes are read from attrs. |
| FuroFileField | `parcel` | `FuroFileFieldParcel \| null` | `null` | Behavior-controlling props as one object. No value key. Native HTML attributes pass through. |

## `parcel` fields

### FuroTextField

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string \| number \| null` | `null` | Controlled value, synced to the internal ref. |
| `invalid` | `boolean` | `false` | Applies the invalid / error visual state. |

### FuroEmailField

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string \| null` | `null` | Controlled value, synced to the internal ref. |
| `invalid` | `boolean` | `false` | Applies the invalid / error visual state. |

### FuroPasswordField

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string \| null` | `null` | Controlled value, synced to the internal ref. |
| `invalid` | `boolean` | `false` | Applies the invalid / error visual state. |

### FuroNumberField

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `number \| null` | `null` | Controlled value, watched and synced into an internal ref. |
| `invalid` | `boolean` | `false` | Applies the invalid / error visual state and `aria-invalid`. |
| `min` | `number` | — | Smallest value allowed; also reflected on the inner input as the `min` attribute. |
| `max` | `number` | — | Largest value allowed; also reflected on the inner input as the `max` attribute. |
| `step` | `number` | (primitive default) | Step for increment and decrement. |
| `stepSnapping` | `boolean` | — | When false, avoids snapping to step increments. |
| `formatOptions` | `Intl.NumberFormatOptions` | — | Formatting for the displayed value (currency, percent, decimals). |
| `locale` | `string` | — | BCP 47 locale tag for formatting (e.g. `'en-US'`, `'ja-JP'`). |
| `inputParcel` | `object` | — | Props and HTML attributes passed to the input part. |
| `decrementParcel` | `object` | — | Props passed to the decrement part. |
| `incrementParcel` | `object` | — | Props passed to the increment part. |

### FuroFileField

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `invalid` | `boolean` | `false` | Applies the invalid / error visual state. |

Note: `FuroFileField` has no `value` field — browsers forbid scripting a file
input's value, so selection is read from the event payload instead.

## Events

### FuroTextField

| Event | Payload | Fires when |
| --- | --- | --- |
| `change-value` | `TextFieldEmitPayload` | Emitted on every input event (each keystroke). |
| `commit-value` | `TextFieldEmitPayload` | Emitted on blur or Enter key press. |
| `update:value` | `string \| null` | Raw string value emitted alongside `change-value` and `commit-value` for `v-model:value`. |

### FuroEmailField

| Event | Payload | Fires when |
| --- | --- | --- |
| `change-value` | `EmailFieldEmitPayload` | Emitted on every input event (each keystroke). |
| `commit-value` | `EmailFieldEmitPayload` | Emitted on blur or Enter key press. |
| `update:value` | `string \| null` | Raw string value emitted alongside the above for `v-model:value`. |

### FuroPasswordField

| Event | Payload | Fires when |
| --- | --- | --- |
| `change-value` | `PasswordFieldEmitPayload` | Emitted on every input event (each keystroke). |
| `commit-value` | `PasswordFieldEmitPayload` | Emitted on blur or Enter key press. |
| `update:value` | `string \| null` | Raw string value emitted alongside the above for `v-model:value`. |

### FuroNumberField

| Event | Payload | Fires when |
| --- | --- | --- |
| `change-value` | `NumberFieldEmitPayload` | Emitted when the model updates: typing, stepping, arrow keys, or wheel. |
| `commit-value` | `NumberFieldEmitPayload` | Emitted on blur of the inner input or on Enter. |
| `update:value` | `number \| null` | Bare number or null emitted alongside `change-value` and `commit-value` for `v-model:value`. |

### FuroFileField

| Event | Payload | Fires when |
| --- | --- | --- |
| `change-value` | `FileFieldEmitPayload` | Emitted when the set of selected files changes (native change event). |

Note: `FuroFileField` has no `commit-value` and no `update:value` — there is
no `v-model:value` support for this component.

## Slots

- `FuroTextField`, `FuroEmailField`, `FuroPasswordField`, `FuroFileField`: no slots.
- `FuroNumberField`:
  - `decrement` (scoped props: `{ value }`) — replaces the default decrement icon. Default: `ph:minus`.
  - `increment` (scoped props: `{ value }`) — replaces the default increment icon. Default: `ph:plus`.

## Usage

```vue
<script>
import {
  FuroEmailField,
  FuroPasswordField,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroEmailField,
    FuroPasswordField,
  },
}
</script>

<template>
  <FuroEmailField
    v-model:value="form.email"
    :parcel="{ invalid: context.hasEmailError() }"
    placeholder="you@example.com"
    @commit-value="context.onCommitEmail({ payload: $event })"
  />

  <FuroPasswordField
    v-model:value="form.password"
    :parcel="{ invalid: context.hasPasswordError() }"
    placeholder="Password"
    @commit-value="context.onCommitPassword({ payload: $event })"
  />
</template>
```

`FuroNumberField` and `FuroFileField` example:

```vue
<script>
import {
  FuroNumberField,
  FuroFileField,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroNumberField,
    FuroFileField,
  },
}
</script>

<template>
  <FuroNumberField
    v-model:value="form.quantity"
    :parcel="{ min: 1, max: 99, step: 1 }"
  />

  <FuroFileField
    :parcel="{ invalid: context.hasAttachmentError() }"
    accept="image/png,image/jpeg"
    @change-value="context.onChangeAttachment({ payload: $event })"
  />
</template>
```

## Rules (per project conventions)

- Pass `parcel` + use `v-model:value` where the field supports it (`FuroTextField`,
  `FuroEmailField`, `FuroPasswordField`, `FuroNumberField`) — this is the one
  documented exception to the project's general no-`v-model` rule, which
  applies only to custom in-project components, not to `furo-vue` library
  components. `FuroFileField` has no `value`/`update:value` — read the selected
  files from the `change-value` payload instead of trying to bind `v-model:value`.
- Never import the underlying headless primitive — only the public
  `FuroTextField` / `FuroEmailField` / `FuroPasswordField` / `FuroNumberField` /
  `FuroFileField` exports.
- Put commit/validation logic in the page/component Context
  (`on{Field}Commit` style method), not inline in the template.
