---
name: hof-cp-toggle-group
description: Use when building a segmented toggle control or a keyboard-navigable container that groups buttons/toggles/separators, in a repo that consumes @openreachtech/furo-vue — "toggle group", "segmented control", "formatting toolbar", "group of buttons". Routes to FuroToggleGroup, FuroToolBar.
---

# FuroToggleGroup / FuroToolBar

`FuroToggleGroup` is a molecule that turns a set of toggle atoms into one
single- or multiple-selection control (e.g. a text-alignment segmented
control) — it owns a `value` and emits when the selection changes.
`FuroToolBar` is a molecule that groups arbitrary interactive controls
(buttons, toggles, toggle groups, separators) into one keyboard-navigable
region with roving focus — it owns no value and emits nothing; it is purely
a layout/focus container. `FuroToggleGroup` instances are commonly placed
inside a `FuroToolBar`'s default slot alongside buttons and separators.

- Layer: molecule (both)
- Import: `import { FuroToggleGroup, FuroToolBar } from '@openreachtech/furo-vue'`
- Manifest entries: `node_modules/@openreachtech/furo-vue/public/furo-vue/components.json` → `components[].name === 'FuroToggleGroup'` and `=== 'FuroToolBar'`

Read the manifest before writing markup if you need to confirm it's still
current — the library may have added props/events since this skill was
written.

## When NOT to use

- A single boolean on/off control, not a group of options → use `hof-cp-checkbox-toggle` instead.
- Picking one/many values from a long or searchable list → use `hof-cp-select` instead.
- A standalone action button that isn't part of a selection set → use `hof-cp-button`; place it inside `FuroToolBar`'s default slot if it needs to sit next to other controls.
- A visual divider between toolbar sections or panes → `FuroSeparator` (and resizable panes / scroll containers) live in `hof-cp-splitter`.
- Tabbed content regions where each option swaps the visible content below → use `hof-cp-tabs` instead; `FuroToggleGroup` only tracks a selection value, it does not render panels.

## FuroToggleGroup

### Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `parcel` | `FuroToggleGroupParcel \| null` | `null` | Reactive data object holding the selection, options, selection mode, variant, size, orientation, and disabled flag. |

### `parcel` fields

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string \| string[]` | none | Controlled selection. A `parcel` that has the key is controlled, even when it holds `null`; one without it is uncontrolled. A single value in single mode, an array in multiple mode. See [Controlled value](#controlled-value). |
| `selectionMode` | `'single' \| 'multiple'` | `'single'` | Whether one or many options may be pressed at once. |
| `options` | `Array<{ value, label?, disabled? }>` | `[]` | The toggle items. `label` falls back to `value` when omitted. |
| `variant` | `'default' \| 'outline'` | `'default'` | Item styling — outline adds a border. |
| `size` | `'default' \| 'sm' \| 'lg'` | `'default'` | Item height and padding. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction. |
| `disabled` | `boolean` | `false` | Disables the whole group; a per-option `disabled` flag disables a single item. |

### Events

| Event | Payload | Fires when |
| --- | --- | --- |
| `change-value` | `ToggleGroupEmitPayload` | On every selection change. Wraps a CustomEvent exposing `value` and the control element; `isSelected({ value })` reports per-option state. |
| `update:value` | `string \| string[]` | v-model sync of the selection. |

### Slots

| Slot | Scoped props | Description |
| --- | --- | --- |
| `option` | `{ option, pressed }` | Custom item content (e.g. icons). Defaults to the option's label. `pressed` reflects whether the option is selected. |

### Controlled value

A click always emits `change-value` and `update:value` with the new selection.
What the group shows afterwards depends on the version:

| Controlled group (`parcel` has `value`) | Before 1.5.0 | From 1.5.0 |
| --- | --- | --- |
| After a click | Shows the clicked selection at once, whether or not the parent accepts it | Keeps showing `parcel.value` until the parent writes the new value back |
| Parent ignores or rejects the emitted value | The group drifts from `parcel.value`, and returns to it only when `parcel.value` next changes | The group stays on `parcel.value` |
| Click on the pressed item in single mode | Clears the display while the parent still holds the value | Emits `null`; the display clears only when the parent writes `null` back |

An uncontrolled group, whose `parcel` has no `value` key, manages its own
selection in both versions.

From 1.5.0, a controlled group needs its parent to write the emitted value
back, or it never moves:

```vue
<FuroToggleGroup
  :parcel="{
    value: form.textAlign,
    options: context.textAlignOptions,
  }"
  @update:value="context.onUpdateTextAlign({ value: $event })"
/>
```

To refuse a change, such as keeping one option always pressed, skip the write
in the handler. From 1.5.0 the group then stays put; on 1.4.0 it shows the
refused selection anyway.

## FuroToolBar

### Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `parcel` | `ToolBarParcel \| null` | `null` | Reactive data object holding orientation, text direction, and focus-wrap behavior. |

### `parcel` fields

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout axis. Also sets which Arrow keys move focus and the `aria-orientation`. |
| `textDirection` | `'toRight' \| 'toLeft'` | `'toRight'` | Reading direction for the contents (`toRight` → left-to-right, `toLeft` → right-to-left). |
| `loopFocus` | `boolean` | `false` | When true, roving focus wraps from the last control back to the first (and vice versa). |

### Events

`FuroToolBar` has no documented events in the manifest — it carries no value and emits nothing.

### Slots

| Slot | Scoped props | Description |
| --- | --- | --- |
| `default` | — | The controls to group — buttons, toggles, toggle groups, separators. |

## Appearance

The `FuroToggleGroup` outline items and the `FuroToolBar` border read
`--color-border`, the container tier of the library's two border tiers. To
change that edge, override `--color-border` from the app side, as the library
token skill (`hof-lib-tokens`) describes.

## Usage

```vue
<script>
import {
  FuroToggleGroup,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroToggleGroup,
  },
}
</script>

<template>
  <FuroToggleGroup
    v-model:value="form.textAlign"
    :parcel="{
      selectionMode: 'single',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ],
    }"
    @change-value="context.onChangeTextAlign({ payload: $event })"
  />
</template>
```

Grouping buttons, a toggle group, and a separator inside a toolbar:

```vue
<script>
import {
  FuroToolBar,
  FuroToggleGroup,
  FuroSeparator,
  FuroButton,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroToolBar,
    FuroToggleGroup,
    FuroSeparator,
    FuroButton,
  },
}
</script>

<template>
  <FuroToolBar :parcel="{ orientation: 'horizontal', loopFocus: true }">
    <FuroButton @click="context.onClickUndo()">
      Undo
    </FuroButton>

    <FuroSeparator :parcel="{ orientation: 'vertical', decorative: true }" />

    <FuroToggleGroup
      v-model:value="form.textAlign"
      :parcel="{
        selectionMode: 'single',
        options: context.textAlignOptions,
      }"
    />
  </FuroToolBar>
</template>
```

## Rules (per project conventions)

- `FuroToggleGroup` follows the form-control contract: pass `parcel` and use
  `v-model:value` — this is the one documented exception to the project's
  general no-`v-model` rule, which applies only to custom in-project
  components, not to `furo-vue` library components.
- `FuroToolBar` is **not** a form control: it carries no `value`, exposes no
  `v-model`, and emits no events. Configure it only through `parcel`
  (`orientation`, `textDirection`, `loopFocus`) and place child controls in
  its default slot.
- Never import the underlying headless toggle-group or toolbar primitive —
  only the public `FuroToggleGroup` / `FuroToolBar` exports.
- Put selection-change handling and business logic in the page/component
  Context (`on{Field}Change` style method), not inline in the template.
- Pass only the `parcel` keys this skill lists. A component reads the keys it
  names and ignores the rest, so a mistyped key changes nothing and reports
  nothing, so check a key against the manifest rather than trusting silence.
