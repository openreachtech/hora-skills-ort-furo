---
name: hof-cp-editor
description: Use when building a rich-text editing area in a repo that consumes @openreachtech/furo-vue — "rich text editor", "WYSIWYG field", "comment editor with formatting", "chat composer with mentions". Routes to FuroEditor.
---

# FuroEditor

Rich-text editor organism with a configurable toolbar. It holds controlled
HTML content (`parcel.value` paired with `update:value`), supports a plain
"editor" or bare "plain" appearance, and exposes opt-in hooks for @-mentions
(`parcel.mention.searchMentions`), inline image uploads
(`parcel.image.uploadImage`), file attachments (`parcel.attachedFiles`), and
custom toolbar actions (`parcel.toolbar`, `parcel.actionOverrides`,
`toolbar-start` / `toolbar-end` slots).

- Layer: organism
- Import: `import { FuroEditor } from '@openreachtech/furo-vue'`
- Manifest entry: `node_modules/@openreachtech/furo-vue/public/furo-vue/components.json` → `components[].name === 'FuroEditor'`

Read the manifest before writing markup if you need to confirm this
information is still current — the library may have added props/events since
this skill was written.

## When NOT to use

- Plain multi-line text with no formatting (comment box, description field)
  → use `hof-cp-textarea` instead — it's lighter and string-only.
- A single-line input (name, email, search) → use `hof-cp-text-field`
  instead.
- Needs a label / hint / error message wrapper around it → wrap in
  `FuroControlBlock` (see `hof-cp-control-block`), don't hand-roll a
  `<label>`.
- In-place editing of a single already-displayed value (click to edit, no
  rich formatting) → use `hof-cp-editable-field` instead.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `parcel` | `object \| null` | `null` | Configuration and state. |

## `parcel` fields

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string` | `''` | HTML content. Controlled — pair with `update:value`. |
| `placeholder` | `string` | `''` | Empty-state placeholder. |
| `readOnly` | `boolean` | `false` | Hides the toolbar and makes content non-editable (keeps the bordered surface). |
| `appearance` | `'editor' \| 'plain'` | `'editor'` | `'plain'` renders content as bare text — no toolbar, border, background, or padding. |
| `toolbar` | `Array<Array<string>>` | default | Toolbar layout as groups of action names; separators sit between groups. |
| `attachedFiles` | `Array<*>` | `[]` | Attachment records held for the consumer; shape is the consumer's own. |
| `labels` | `object` | built-in | Partial overrides for toolbar tooltips and dialog text. |
| `mention` | `{ searchMentions }` | absent | Enables @-mentions when present. `searchMentions` is `({ query }) => Promise<Array<{ id, label }>>`. |
| `image` | `{ uploadImage }` | absent | Enables inline images when present. `uploadImage` is `({ file }) => Promise<{ src, alt? }>`. |
| `actionOverrides` | `Record<string, fn>` | `{}` | Override the click behavior of a built-in control by name. |

## Events

| Event | Payload | Fires when |
| --- | --- | --- |
| `update:value` | `string` (HTML) | Content changed (`v-model:value`). |
| `change-value` | `{ value }` | Content changed. |
| `commit-value` | `{ value }` | Editor blurred. |
| `update:attachedFiles` | `Array<*>` | Attachment list changed (e.g. a removal). |
| `mention:add` | `{ id, label }` | A mention was inserted. |

## Slots

| Slot | Scoped props | Description |
| --- | --- | --- |
| `toolbar-start` | `{ command, editor }` | Custom controls prepended to the toolbar. |
| `toolbar-end` | `{ command, editor }` | Custom controls appended to the toolbar. |
| `attachments` | `{ attachedFiles, remove, isEditable }` | Render the attachment UI. `remove` is `({ index }) => void`. |
| `footer` | — | Content rendered below the editor (e.g. submit row). |

## Usage

```vue
<script>
import {
  FuroEditor,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroEditor,
  },
}
</script>

<template>
  <FuroEditor
    v-model:value="form.bodyHtml"
    :parcel="{
      placeholder: 'Write a reply...',
      mention: { searchMentions: context.searchMentionCandidates },
      image: { uploadImage: context.uploadEditorImage },
    }"
    @commit-value="context.onCommitReplyBody({ payload: $event })"
  />
</template>
```

With attachments and a footer submit row:

```vue
<template>
  <FuroEditor
    v-model:value="form.bodyHtml"
    v-model:attachedFiles="form.attachedFiles"
    :parcel="{ placeholder: 'Write a comment...' }"
  >
    <template #footer>
      <FuroButton
        @click="context.onSubmitComment()"
      >
        Send
      </FuroButton>
    </template>
  </FuroEditor>
</template>
```

## Rules (per project conventions)

- Pass `parcel` + use `v-model:value` (and `v-model:attachedFiles` where
  attachments are used) — this is the one documented exception to the
  project's general no-`v-model` rule, which applies only to custom
  in-project components, not to `furo-vue` library components.
- Never import the underlying headless primitive — only the public
  `FuroEditor` export.
- Keep mention search, image upload, and commit/validation logic in the
  page/component Context (`on{Field}Commit`, `search...`, `upload...` style
  methods), not inline in the template.
