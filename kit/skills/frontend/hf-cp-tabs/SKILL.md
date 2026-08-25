---
name: hf-cp-tabs
description: Use when building tabbed regions in a repo that consumes @openreachtech/furo-vue — "tabs", "tabbed panels", "switch between sections", "segmented control navigation". Routes to FuroTabs.
---

# FuroTabs

`FuroTabs` is a tab-list-and-panels organism built on a headless tabs
primitive with keyboard navigation. It takes a declarative `tabs` array in
`parcel` and renders a trigger row plus one panel per tab via named slots
keyed by each tab's `value` (or a `slotName` override). It supports two
visual variants (underlined `line` with a sliding indicator, or segmented
`solid`), horizontal or vertical orientation, an overflow-scrollable trigger
row, and a panel-less "navigation menu only" mode for router-driven tabs.

- Layer: organism
- Import: `import { FuroTabs } from '@openreachtech/furo-vue'`
- Manifest entry: `node_modules/@openreachtech/furo-vue/public/furo-vue/components.json` → `components[].name === 'FuroTabs'`

Read the manifest before writing markup if you need to confirm it's still
current — the library may have added props/events since this skill was
written.

## When NOT to use

- Show/hide a single region without a trigger row of labeled tabs → use `hf-cp-collapsible`.
- A group of mutually-exclusive toggle buttons that don't each own a content panel (e.g. a view-mode toolbar) → use `hf-cp-toggle-group`.
- Multi-step linear flow with a progress indicator (not freely switchable tabs) → use `hf-cp-stepper`.
- A dropdown list of navigation actions rather than a persistent trigger row → use `hf-cp-dropdown-menu`.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `parcel` | `FuroTabsParcel \| null` | `null` | Reactive behavior object. |

## `parcel` fields

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `tabs` | `Array<FuroTabsTab>` | `[]` | Tab descriptors that drive the trigger row and panel slots. |
| `value` | `string \| null` | `null` | Controlled active tab value. When omitted, the component manages its own active tab, defaulting to the first tab. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction of the trigger row. |
| `variant` | `'line' \| 'solid'` | `'line'` | `line` is an underlined trigger row with a sliding indicator; `solid` is a segmented control. |
| `scrollable` | `boolean` | `false` | When true, the trigger row scrolls and previous/next navigation buttons appear once it overflows. |
| `showPanels` | `boolean` | `true` | When false, no panels render — the component is a navigation menu only. |
| `showIndicator` | `boolean` | `true` | Renders the animated sliding indicator. Applies to the `line` variant only. |
| `disabled` | `boolean` | `false` | Disables the whole tab set. |

`FuroTabsTab` is not further broken out in the manifest as its own table;
inspecting the component source shows each entry carries at least `value` and
`label`, plus optional `disabled` and a `slotName` override (defaults to
`value` when omitted) — confirm current fields against `FuroTabsContext.js`
if the manifest doesn't expand this type.

## Events

| Event | Payload | Fires when |
| --- | --- | --- |
| `update:value` | `string` | Active tab changed — enables `v-model:value`. |
| `tab:change` | `{ value: string }` | Active tab changed. |

## Slots

| Slot | Scoped props | Description |
| --- | --- | --- |
| `<value>` (or `<slotName>`) | — | Panel content for the matching tab. One slot per tab, keyed by the tab's `value` (or its `slotName` override). |
| `label-<value>` | `{ value, label }` | Custom trigger content for the matching tab. When omitted, the trigger shows `label`. |

## Usage

```vue
<script>
import {
  FuroTabs,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroTabs,
  },
}
</script>

<template>
  <FuroTabs
    v-model:value="context.activeTabValue"
    :parcel="{
      tabs: [
        { value: 'overview', label: 'Overview' },
        { value: 'settings', label: 'Settings' },
        { value: 'history', label: 'History', disabled: context.isHistoryDisabled },
      ],
      variant: 'line',
    }"
    @tab:change="context.onTabChange({ payload: $event })"
  >
    <template #overview>
      <MemberOverviewPanel :member="context.member" />
    </template>

    <template #settings>
      <MemberSettingsPanel :member="context.member" />
    </template>

    <template #history>
      <MemberHistoryPanel :member="context.member" />
    </template>
  </FuroTabs>
</template>
```

Navigation-menu-only mode (router-driven, no panels):

```vue
<template>
  <FuroTabs
    :parcel="{
      tabs: context.sectionTabs,
      value: context.activeSectionValue,
      showPanels: false,
    }"
    @tab:change="context.onNavigateToSection({ payload: $event })"
  />
</template>
```

## Rules (per project conventions)

- Use `parcel` + `v-model:value` for the active tab — this is the documented
  exception to the project's general no-`v-model` rule, which applies only to
  custom in-project components, not to `furo-vue` library components.
- Never import the underlying headless primitive (`reka-ui`'s tabs
  components) — only the public `FuroTabs` export.
- Keep tab-change side effects (e.g. lazy-loading a panel's data, router
  navigation in menu-only mode) in the page/component Context's
  `onTabChange`-style method, not inline in the template.
