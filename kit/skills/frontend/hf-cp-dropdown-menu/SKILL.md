---
name: hf-cp-dropdown-menu
description: Use when building a menu of actions triggered from a button or icon in a repo that consumes @openreachtech/furo-vue — "actions menu", "kebab menu", "context menu", "dropdown menu", "three-dot menu". Routes to FuroDropdownMenu.
---

# FuroDropdownMenu

Molecule-layer trigger-plus-floating-menu component. It renders a native
trigger button (styled like `FuroButton`, overridable via the `#trigger`
slot) that opens a floating menu built declaratively from a `parcel.options`
array. Rows can be plain actions, checkbox rows, submenus, or separators —
row kind is resolved automatically by priority (separator, then submenu,
then checkbox, then default action). It does not use `v-model`: the menu
only emits selection/toggle events, and the parent owns any persistent
checked state for checkbox rows.

- Layer: molecule
- Import: `import { FuroDropdownMenu } from '@openreachtech/furo-vue'`
- Manifest entry: `node_modules/@openreachtech/furo-vue/public/furo-vue/components.json` → `components[].name === 'FuroDropdownMenu'`

Read the manifest before writing markup if you need to confirm this
information is still current — the library may have added props/events since
this skill was written.

## When NOT to use

- A single one-shot action with no menu of choices → use `hf-cp-button` directly instead.
- A floating panel that shows arbitrary content or a tooltip rather than a list of discrete actions → use `hf-cp-popover`.
- A modal/drawer that takes over the flow (confirmation, form) → use `hf-cp-dialog`.
- Picking one/many values from a list as part of a form field (not an actions menu) → use `hf-cp-select`.
- Persistent boolean options rendered inline rather than behind a trigger → use `hf-cp-checkbox-toggle` or `hf-cp-toggle-group`.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `parcel` | `FuroDropdownMenuParcel \| null` | `null` | Menu behavior and declarative rows. |
| `triggerParcel` | `object \| null` | `null` | Default trigger appearance tokens (`variant`, `size`) aligned with `FuroButton`. |

## `parcel` fields

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `open` | `boolean` | uncontrolled | Controlled open state; omit for internal state. |
| `disabled` | `boolean` | `false` | Disables trigger and menu. |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Which edge of the trigger the menu opens against. |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | How the menu aligns along that edge. |
| `sideOffset` | `number` | `4` | Gap between trigger and menu, in rem-equivalent pixels. |
| `options` | `Array<FuroDropdownMenuOption>` | `[]` | Declarative menu rows. |

## Events

| Event | Payload | Fires when |
| --- | --- | --- |
| `open:change` | `{ open: boolean }` | Menu open state changes. |
| `option:select` | `DropdownMenuOptionSelectEmitPayload` | User selects an enabled action row. |
| `option:checked-change` | `{ option: FuroDropdownMenuOption, checked: boolean }` | User toggles a checkbox row. |

There is no `update:value` event in the manifest — this component does not
follow the `v-model` form-control contract; own the checked state of any
checkbox rows yourself and pass it back in via `parcel.options`.

## Slots

| Slot | Description |
| --- | --- |
| `trigger` | Native button labeled "Menu" (`FuroButton`-compatible styling). Override with label content. |
| `option-label` | Override row label rendering. Scoped props: `{ option, index }`. Defaults to `option.label` text. |
| `default` | Append custom menu content (advanced). |

## Usage

```vue
<script>
import {
  FuroDropdownMenu,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroDropdownMenu,
  },
}
</script>

<template>
  <FuroDropdownMenu
    :parcel="{ options: context.rowActionOptions, align: 'end' }"
    @option:select="context.onSelectRowAction({ payload: $event })"
  >
    <template #trigger>
      Actions
    </template>
  </FuroDropdownMenu>
</template>
```

With a checkbox row whose checked state is owned by the Context:

```vue
<template>
  <FuroDropdownMenu
    :parcel="{ options: context.columnVisibilityOptions }"
    @option:checked-change="context.onToggleColumnVisibility({ payload: $event })"
  />
</template>
```

## Rules (per project conventions)

- This component does not follow the `v-model:value` form-control contract
  — there is no `update:value` event. Its emit contract is `option:select`
  for one-shot actions, `option:checked-change` for checkbox rows (the
  parent must feed the updated `checked` state back into
  `parcel.options`), and `open:change` if you choose to control `open`
  yourself instead of letting the menu manage it internally.
- Never import the underlying headless primitive — only the public
  `FuroDropdownMenu` export.
- Build the `options` array and every `on...` handler (`onSelectRowAction`,
  `onToggleColumnVisibility`, etc.) in the page/component Context, not
  inline in the template.
