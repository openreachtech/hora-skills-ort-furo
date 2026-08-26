---
name: hof-cp-editable-field
description: Use when building an inline click-to-edit value display in a repo that consumes @openreachtech/furo-vue — "inline edit", "click to edit", "edit in place", "edit this cell without a form". Routes to FuroEditableField.
---

# FuroEditableField

Molecule-layer inline read-to-edit field: it shows a preview surface, opens
an editor on activation (double-click, focus, or a visible Edit trigger),
and commits or cancels the draft. It defaults to a `FuroTextField` editor,
but the `#editor` slot can host any other atom (number field, select,
checkbox, file input) for cases where the edited value isn't plain text.
Unlike the single-line/multi-line text controls, it owns its own
preview-vs-edit lifecycle and does not use `v-model:value` — the parent is
required to update `parcel.value` after a `commit-value` event.

- Layer: molecule
- Import: `import { FuroEditableField } from '@openreachtech/furo-vue'`
- Manifest entry: `node_modules/@openreachtech/furo-vue/public/furo-vue/components.json` → `components[].name === 'FuroEditableField'`

Read the manifest before writing markup if you need to confirm this
information is still current — the library may have added props/events since
this skill was written.

## When NOT to use

- The value is always in edit mode (a normal form field, no preview state) → use `hof-cp-text-field` or `hof-cp-textarea` directly instead.
- You need a persistent labeled field wrapper (label/hint/error) around a normal input → use `hof-cp-control-block`.
- You need a floating panel/tooltip anchored to a trigger that isn't about editing a value → see `hof-cp-popover`.
- The interaction is picking a date/time rather than an arbitrary value → use `hof-cp-date-time`.
- You need a menu of discrete actions, not a value editor → use `hof-cp-dropdown-menu`.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `parcel` | `FuroEditableFieldParcel \| null` | `null` | Furo behavior and forwarded edit-lifecycle keys. The only public prop; attributes pass through. |

## `parcel` fields

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `FuroEditableValue` | — | Committed value. The parent should update this after `commit-value`. |
| `invalid` | `boolean` | `false` | Passed to the default `FuroTextField`; use `#editor` for custom invalid UI. |
| `disabled` | `boolean` | `false` | Also respected from the fallthrough `disabled` attribute. |
| `required` | `boolean` | `false` | Also respected from the fallthrough `required` attribute. |
| `readonly` | `boolean` | `false` | Forwarded to the root. |
| `placeholder` | `string \| { edit: string, preview: string }` | fallthrough or empty | Default text editor placeholder. |
| `emptyPreviewText` | `string` | `'---'` | Shown when the value is empty and no `#preview` slot is provided. |
| `showActions` | `boolean` | `false` | Show the Edit trigger and enable the action-button row. |
| `showEditing` | `boolean` | `false` | On mount, sets the internal editing flag used for editor positioning. |
| `showUndoChange` | `boolean` | `false` | Show the undo control when the committed value diverges from the mount snapshot. |
| `collisionBoundary` | `HTMLElement \| Ref<HTMLElement \| null> \| null` | — | Bounding rect for editor collision; the viewport is used when omitted. |
| `activationMode` | `'dblclick' \| 'focus' \| 'none'` | — | Primitive-forwarded: how the preview enters edit mode. |
| `submitMode` | `'blur' \| 'enter' \| 'both' \| 'none'` | — | Primitive-forwarded: when the primitive auto-submits the draft. |

## Events

| Event | Payload | Fires when |
| --- | --- | --- |
| `commit-value` | `EditableEmitPayload` | On successful submit and on undo. `$event.value` is the committed value. |
| `update-editing-state` | `EdittingState` | The editing lifecycle state: `'edit'`, `'cancel'`, or `'submit'`. |

There is no `update:value` event in the manifest — do not wire `v-model:value`
onto this component; it does not exist.

## Slots

| Slot | Description |
| --- | --- |
| `preview` | Used when the value is not empty; overrides the default preview text. Scoped props: root props + `committedValue`, `draftValue`, `updateDraftValue`, `undoChange`. |
| `editor` | Replaces the default `FuroTextField`; hosts custom atoms. Same scoped props as `preview`. |
| `edit-trigger` | Custom edit trigger (as-child when provided). Same scoped props as `preview`. |
| `submit-trigger` | Inside the editor actions; visible while editing. Same scoped props as `preview`. |
| `cancel-trigger` | Inside the editor actions; visible while editing. Same scoped props as `preview`. |
| `undo-trigger` | Shown when `showUndoChange` and the value changed since mount. Same scoped props as `preview`. |

## Usage

```vue
<script>
import {
  FuroEditableField,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroEditableField,
  },
}
</script>

<template>
  <FuroEditableField
    :parcel="{
      value: form.nickname,
      invalid: context.hasNicknameError(),
      showActions: true,
      showUndoChange: true,
    }"
    placeholder="Enter a nickname"
    @commit-value="context.onCommitNickname({ payload: $event })"
  />
</template>
```

With a custom `#editor` slot for a non-text control:

```vue
<template>
  <FuroEditableField
    :parcel="{ value: form.status, showActions: true }"
    @commit-value="context.onCommitStatus({ payload: $event })"
  >
    <template #editor="{ draftValue, updateDraftValue }">
      <FuroSelect
        :parcel="{ value: draftValue, options: context.statusOptions }"
        @update:value="updateDraftValue"
      />
    </template>
  </FuroEditableField>
</template>
```

## Rules (per project conventions)

- This component does **not** follow the `v-model:value` form-control
  contract — the manifest has no `update:value` event. Pass the current
  value through `parcel.value` and update that same source-of-truth
  property yourself inside a Context method bound to `commit-value`
  (e.g. `onCommitNickname`); do not attempt `v-model:value`.
- Never import the underlying headless primitive — only the public
  `FuroEditableField` export.
- Keep commit/validation/undo-decision logic in the page/component Context,
  not inline in the template — the template should only call a Context
  method from `@commit-value`.
