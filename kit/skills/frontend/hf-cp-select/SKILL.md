---
name: hf-cp-select
description: Use when picking one or more values from a list in a repo that consumes @openreachtech/furo-vue — "dropdown select", "pick from a list", "searchable dropdown", "typeahead field", "multi-select with search". Routes to FuroSelect, FuroAutocompleteField.
---

# FuroSelect and FuroAutocompleteField

Two molecules for choosing from a list, differing in how the user finds an
option. `FuroSelect` is a plain dropdown: it renders a fixed `options` array
(with optional groups) in a popover and the user picks by clicking/keyboard
navigation — no text filtering. `FuroAutocompleteField` is a text-input-driven
combobox: the user types to filter (client-side via `localCompare`, or against
a parent-owned/API-driven list when `localCompare: false`), with debounced
`search-keyword` emission, optional "select all", and optional "create new
option" rows. Use `FuroSelect` for short, known lists (status, role); use
`FuroAutocompleteField` when the list is long, searched, or fetched
asynchronously.

- Layer: molecule
- Import:
  - `import { FuroSelect } from '@openreachtech/furo-vue'`
  - `import { FuroAutocompleteField } from '@openreachtech/furo-vue'`
- Manifest entry: `node_modules/@openreachtech/furo-vue/public/furo-vue/components.json` → `components[].name === 'FuroSelect' | 'FuroAutocompleteField'`

Read the manifest before writing markup if you need to confirm this
information is still current — the library may have added props/events since
this skill was written.

## When NOT to use

- Free-form text entry, not a pick from a list → use `hf-cp-text-field`.
- A menu of actions to trigger (not a value to store) → use `hf-cp-dropdown-menu`.
- A simple boolean choice → use `hf-cp-checkbox-toggle`.
- Needs a label / hint / error message around it → wrap in `FuroControlBlock` (see `hf-cp-control-block`), don't hand-roll a `<label>`.
- Grouped toolbar-style toggle buttons rather than a value-bearing field → use `hf-cp-toggle-group`.

## Props

### FuroSelect

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `parcel` | `object \| null` | `null` | Root behavior and Furo fields. |
| `triggerParcel` | `object \| null` | `null` | Extra attributes applied to the trigger part. |
| `portalParcel` | `object \| null` | `null` | Extra attributes applied to the portal part. |
| `contentParcel` | `object \| null` | `null` | Extra attributes applied to the content part (side-offset defaults to 4). |

### FuroAutocompleteField

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `parcel` | `FuroAutocompleteFieldParcel \| null` | `null` | Furo behavior. The only public prop; HTML / form attributes pass through to the root. |

## `parcel` fields

### FuroSelect

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string \| number \| object \| null` | `null` | Controlled value; an array when multiple. Objects are supported. |
| `defaultValue` | same as `value` | — | Uncontrolled initial value. |
| `options` | `Array<FuroSelectOption>` | `[]` | Unified list of groups and leaf rows. |
| `invalid` | `boolean` | `false` | Invalid visual state plus `aria-invalid` on the trigger. |
| `loading` | `boolean` | `false` | Loading state on the trigger; suppresses the empty row. |
| `placeholder` | `string` | `''` | Placeholder shown in the value display. |
| `textDirection` | `'toRight' \| 'toLeft'` | `'toRight'` | Maps to the root `dir` (ltr / rtl). |
| `multiple` | `boolean` | `false` | Enables multi-select on the root. |
| `disabled` | `boolean` | `false` | Disables the whole control; may also be set as a fallthrough attribute. |

### FuroAutocompleteField

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `FuroAutocompleteOption \| FuroAcceptableValue \| Array \| null` | — | Controlled selection; synced to the internal value, with fallthrough `value` as fallback. |
| `options` | `Array<FuroAutocompleteOption \| FuroAcceptableValue>` | `[]` | List rows (groups and leaves). |
| `placeholder` | `string` | `'Select an option'` | Input placeholder. |
| `loading` | `boolean` | `false` | Input spinner; filtered list returns empty and the empty state is suppressed. |
| `invalid` | `boolean` | `false` | Root invalid class. |
| `disabled` | `boolean` | `false` | Disables the combobox. |
| `textDirection` | `'toRight' \| 'toLeft'` | `'toRight'` | Maps to the primitive's `dir` (ltr / rtl). |
| `multiple` | `boolean` | `false` | Multi-select; chips in the anchor. |
| `showClear` | `boolean` | `true` | Clear control shown when a value is selected. |
| `localCompare` | `boolean` | `true` | `true` filters on the client; `false` uses the parent-owned options. |
| `debounceMilliseconds` | `number` | `300` | Debounce for `search-keyword` (TimerClerk). |
| `openOnClick` | `boolean` | `true` | Passed through to the root. |
| `showSelectAll` | `boolean` | `false` | Multi only; sentinel select-all row. |
| `selectAllText` | `string` | `'Select All'` | Select-all row label. |
| `emptyText` | `string` | `'No options.'` | Default empty-slot copy. |
| `creatable` | `boolean` | `false` | Show a create row when the trimmed keyword has no exact label/value match. |
| `createOptionText` | `string` | `'Create "{keyword}"'` | Create-row text template; `{keyword}` is replaced with the trimmed keyword. |
| `searchKeyword` | `string` | — | Partial: parent to internal input via watch; no `update:search-keyword`. |
| `open` | `boolean` | — | Not implemented; the template open uses the internal popover ref. |

## Events

### FuroSelect

| Event | Payload | Fires when |
| --- | --- | --- |
| `change-value` | `SelectEmitPayload` | Fired on selection. |
| `commit-value` | `SelectEmitPayload` | Same gesture as `change-value`; selection is the commit point. |
| `update:value` | `string \| number \| object \| null` | Primary selected value; first selected value for multi-select. |

### FuroAutocompleteField

| Event | Payload | Fires when |
| --- | --- | --- |
| `change-value` | `AutocompleteEmitPayload` | Select option, select-all, clear, or chip remove. |
| `update:value` | Option object, array, or null | Same gesture as `change-value`; suitable for `v-model:value`. |
| `search-keyword` | `string` | After debounce while the popover is open; also `''` on clear. |
| `create-option` | `AutocompleteEmitPayload` | Select the create row (creatable); read the typed value via `extractTrimmedSearchKeyword()`. |

Note: `FuroAutocompleteField` has no `commit-value` — `change-value` already
fires at the selection point.

## Slots

### FuroSelect

| Slot | Scoped props | Description |
| --- | --- | --- |
| `trigger-content` | — | Value display and trigger icon area. |
| `group` | `{ group, groupIndex }` | Group label and its child options. |
| `option` | `{ option, optionIndex, group?, groupIndex? }` | Option row text and indicator. |
| `empty` | — | Shown when `options` is empty and not loading. Default text: `No options`. |

### FuroAutocompleteField

| Slot | Scoped props | Description |
| --- | --- | --- |
| `trigger-left` | — | Optional leading anchor content. |
| `trigger-right` | — | Caret icon inside the trigger part. |
| `select-all` | — | Select-all label text (scoped checked / indeterminate / disabled not wired). |
| `group` | `{ group, groupIndex }` | Group and its children. |
| `group-label` | `{ group, groupIndex }` | Group header text. |
| `option` | `{ option, optionIndex, group?, groupIndex? }` | Row and indicator. |
| `option-text` | `{ option, optionIndex }` | Label text. |
| `empty` | `{ searchKeyword, loading }` | Shown when the filtered list is empty and not loading; defaults to `emptyText`. |
| `loading` | `{ searchKeyword }` | Spinner shown in the list. |
| `create-option` | `{ searchKeyword }` | `createOptionText` with `{keyword}` replaced; shown only when `creatable` and no exact match. |

## Usage

```vue
<script>
import {
  FuroSelect,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroSelect,
  },
}
</script>

<template>
  <FuroSelect
    v-model:value="form.status"
    :parcel="{
      options: context.statusOptions,
      placeholder: 'Select status',
      invalid: context.hasStatusError(),
    }"
  />
</template>
```

`FuroAutocompleteField` against a server-driven list:

```vue
<script>
import {
  FuroAutocompleteField,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroAutocompleteField,
  },
}
</script>

<template>
  <FuroAutocompleteField
    v-model:value="form.assignee"
    :parcel="{
      options: context.assigneeOptions,
      loading: context.isSearchingAssignees,
      localCompare: false,
      placeholder: 'Search assignee',
    }"
    @search-keyword="context.onSearchAssignee({ payload: $event })"
  />
</template>
```

## Rules (per project conventions)

- Pass `parcel` + use `v-model:value` — this is the one documented exception
  to the project's general no-`v-model` rule, which applies only to
  custom in-project components, not to `furo-vue` library components.
- Never import the underlying headless primitive — only the public
  `FuroSelect` / `FuroAutocompleteField` exports.
- Keep option-list fetching, filtering (when `localCompare: false`), and
  create-option persistence in the page/component Context
  (`on{Field}SearchKeyword`, `on{Field}CreateOption` style methods), not
  inline in the template.
