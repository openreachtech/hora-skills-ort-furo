---
name: hof-cp-dropdown-menu
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

- A single one-shot action with no menu of choices → use `hof-cp-button` directly instead.
- A floating panel that shows arbitrary content or a tooltip rather than a list of discrete actions → use `hof-cp-popover`.
- A modal/drawer that takes over the flow (confirmation, form) → use `hof-cp-dialog`.
- Picking one/many values from a list as part of a form field (not an actions menu) → use `hof-cp-select`.
- Persistent boolean options rendered inline rather than behind a trigger → use `hof-cp-checkbox-toggle` or `hof-cp-toggle-group`.

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
| `preventCloseAutoFocus` | `boolean` | `false` | When `true`, focus stays where the option handler left it (for example a text editor) instead of returning to the trigger when the menu closes. |
| `options` | `Array<FuroDropdownMenuOption>` | `[]` | Declarative menu rows. |

## `FuroDropdownMenuOption` fields

| Field | Type | Notes |
| --- | --- | --- |
| `label` | `string` | Visible row label. |
| `value` | `string` | Stable identifier your handler reads from the emitted payload. |
| `disabled` | `boolean` | Non-interactive row. Neither `option:select` nor `option:checked-change` fires for it. On a submenu row it disables the submenu trigger. |
| `separator` | `boolean` | Renders a separator line instead of a row. Other fields are ignored. |
| `variant` | `'default' \| 'destructive'` | `'destructive'` styles an action or checkbox row for a delete-type action. See [Destructive rows](#destructive-rows). |
| `type` | `'action' \| 'checkbox' \| 'submenu'` | Row kind. Omit for an action row. |
| `checked` | `boolean` | Checkbox row only. The checked state, owned by the parent. |
| `keepOpen` | `boolean` | Action row only. Keeps the menu open after the row is selected. |
| `options` | `Array<FuroDropdownMenuOption>` | Nested rows for `type: 'submenu'`. A `'submenu'` row without an `options` array renders as a plain action row. |

Row kind is resolved in this order, so the first match wins: `separator: true`,
then `type: 'submenu'` with an `options` array, then `type: 'checkbox'`, then
an action row.

- An action row closes the menu on select unless `keepOpen: true`.
- A checkbox row never closes the menu. It does not flip itself: it emits
  `option:checked-change` and shows whatever `checked` you pass back in
  `parcel.options`.
- Give every selectable row a `value`. The handler reads
  `payload.option.value`, and a row without one cannot be told apart.
- The `option:select` payload is a `DropdownMenuOptionSelectEmitPayload`
  holding `option` (the row you passed), `rawEvent`, `controlElement`, and
  `isDefaultPrevented()`.

## Destructive rows

`variant: 'destructive'` changes only the look. The row text takes the
destructive text color, and a highlighted row switches to the destructive
background with its foreground color. It adds no confirmation step and no
extra event, so a delete action still arrives through `option:select`. Open a
confirmation through `hof-cp-dialog` from the handler when the action cannot
be undone. A submenu row ignores `variant`.

```js
{ label: 'Delete', value: 'delete', variant: 'destructive' }
```

## Keyboard and ARIA

From the underlying primitive (Reka UI 2.11.0, the version furo-vue 2.1.0
declares), through the public component:

| Key | Where | Effect |
| --- | --- | --- |
| `Enter`, `Space`, `ArrowDown` | Focused trigger | Opens the menu. |
| `ArrowDown`, `ArrowUp` | Open menu | Moves focus between rows. |
| `Home`, `PageUp` / `End`, `PageDown` | Open menu | Focuses the first / last row. |
| `Enter`, `Space` | Focused row | Selects it (an action row emits `option:select`, a checkbox row toggles). |
| `ArrowRight` | Focused submenu row | Opens the submenu (`ArrowLeft` in a right-to-left page). |
| `ArrowLeft` | Inside a submenu | Closes the submenu and returns to its row (`ArrowRight` in a right-to-left page). |
| A character key | Open menu | Moves focus to the next row whose text starts with it (typeahead). |
| `Escape` | Open menu | Closes the menu. |

| Element | ARIA |
| --- | --- |
| Trigger | `aria-haspopup="menu"` from Furo, `aria-expanded` from the primitive. |
| Menu | `role="menu"`, `aria-orientation="vertical"`. |
| Action row | `role="menuitem"`. |
| Checkbox row | `role="menuitemcheckbox"` with `aria-checked`. |
| Submenu row | `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`. |

Disabled rows are skipped by keyboard navigation and emit nothing, so a caller
needs no extra guard. Furo adds no ARIA attribute beyond the trigger's
`aria-haspopup`, so a trigger that holds only an icon needs its own accessible
name inside the `#trigger` slot (visually hidden text, for example).

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

## Row height

| | Before 1.5.0 | From 1.5.0 |
| --- | --- | --- |
| Minimum height of a menu row | Fixed at `calc(var(--size-input-height) - 0.5rem)` in the component's CSS | Reads `--size-option-height`, which defaults to the same value, 24px |
| Override from the app | Declaring the token changes nothing, because the component never reads it | Redefine the token, and every row follows |

From 1.5.0, an app raises the rows to a larger touch target by overriding the
token as `/hof-lib-tokens` describes, never the menu's CSS. The token holds one
value in both themes, so put it on `:root`, either unlayered or in
`@layer app`:

```css
:root {
  --size-option-height: 2.5rem;
}
```

`FuroSelect` option rows read the same token, so the override raises them too.

## Fallthrough attributes

`class` and `style` compose onto the root. Every other attribute you write on
the component (`id`, `aria-*`, `data-*`) is dropped and reaches no element.

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
- Pass only the `parcel` keys this skill lists. A component reads the keys it
  names and ignores the rest, so a mistyped key changes nothing and reports
  nothing, so check a key against the manifest rather than trusting silence.
