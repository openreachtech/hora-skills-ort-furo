---
name: hof-cp-textarea
description: Use when building a multi-line text input in a repo that consumes @openreachtech/furo-vue — "multi-line text", "textarea", "long text field", "comment box", "description field". Routes to FuroTextarea.
---

# FuroTextarea

Multi-line text input atom. Mirrors the `FuroTextField` contract but the
underlying element is a native `<textarea>`, so `parcel.value` is
string-only (no numeric shortcut) and there is no `type` variant.

- Layer: atom
- Import: `import { FuroTextarea } from '@openreachtech/furo-vue'`
- Manifest entry: `node_modules/@openreachtech/furo-vue/public/furo-vue/components.json` → `components[].name === 'FuroTextarea'`

Read the manifest before writing markup if you need to confirm it's still
current — the library may have added props/events since this skill was
written.

Each manifest record also carries a `types` array beside `slots`. When a prop,
`parcel` field, or event payload names a nested type
(`Array<FuroSelectOption>`, `FuroTableColumn`, …), read that name from the same
record's `types` array — each entry carries the authored `definition` plus a
parsed `fields` list (`name`, `type`, `required`) for an object shape, or
`values` for a string union. Read the shape from the manifest, not from
component source.

## When NOT to use

- Single-line input (name, email, number, password, file) → use `hof-cp-text-field` (`FuroTextField` and its typed variants) instead.
- Needs a label / hint / error message around it → wrap in `FuroControlBlock` (see `hof-cp-control-block`), don't hand-roll a `<label>`.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `parcel` | `FuroTextareaParcel \| null` | `null` | Behavior-controlling props as one object. Native `<textarea>` attributes (e.g. `placeholder`, `rows`, `maxlength`, `disabled`) pass through as fallthrough attrs, not through `parcel`. |

## `parcel` fields

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string \| null` | `null` | Controlled value, synced to the internal ref. Omit to run uncontrolled. |
| `invalid` | `boolean` | `false` | Applies the invalid / error visual state (red border). Drive this from validation state, not CSS. |

## Events

| Event | Payload | Fires when |
| --- | --- | --- |
| `change-value` | `TextareaEmitPayload` | Every input event (each keystroke/edit). |
| `commit-value` | `TextareaEmitPayload` | Blur only. **Enter inserts a newline and does NOT commit** — this differs from single-line fields, where Enter commits. |
| `update:value` | `string \| null` | Raw string, emitted alongside the two above, for `v-model:value` sync. |

`TextareaEmitPayload` exposes the same trimmed-value and emptiness helpers as
`FuroTextField`'s payload — read the payload class if you need those.

## Appearance

This component's control boundary reads `--color-input`, the stronger of the
library's two border tiers. If your app pinned a lighter edge, override
`--color-input` from the app side — see the library token skill
(`hof-lib-tokens`).

## Usage

```vue
<script>
import {
  FuroTextarea,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroTextarea,
  },
}
</script>

<template>
  <FuroTextarea
    v-model:value="form.description"
    :parcel="{ invalid: context.hasDescriptionError() }"
    placeholder="Describe the issue"
    rows="4"
    @commit-value="context.onCommitDescription({ payload: $event })"
  />
</template>
```

With a label/hint/error wrapper:

```vue
<template>
  <FuroControlBlock :parcel="{ label: 'Description', error: context.descriptionError }">
    <FuroTextarea
      v-model:value="form.description"
      :parcel="{ invalid: context.hasDescriptionError() }"
      placeholder="Describe the issue"
    />
  </FuroControlBlock>
</template>
```

## Rules (per project conventions)

- Pass `parcel` + use `v-model:value` — this is the one documented exception
  to the project's general no-`v-model` rule, which applies only to
  custom in-project components, not to `furo-vue` library components.
- Never import the underlying headless primitive — only the public
  `FuroTextarea` export.
- Put commit/validation logic in the page/component Context
  (`on{Field}Commit` style method), not inline in the template.
- Pass only the `parcel` keys this skill lists. A component reads the keys it
  names and ignores the rest, so a mistyped key changes nothing and reports
  nothing. Some components warn in development through Vue's warning channel,
  naming the unknown key and the accepted ones — but not every component does,
  so check a key against the manifest rather than trusting silence.
