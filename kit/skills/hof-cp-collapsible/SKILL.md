---
name: hof-cp-collapsible
description: Use when building a show/hide region or a stack of expandable sections in a repo that consumes @openreachtech/furo-vue — "collapsible section", "expand/collapse", "accordion", "FAQ list", "show more details". Routes to FuroCollapsible, FuroAccordion.
---

# FuroCollapsible / FuroAccordion

`FuroCollapsible` toggles exactly one region with one trigger — a single
"show more" / "show details" block. `FuroAccordion` manages a stack of
sections, each with its own header, where either a single section
(`selectionMode: 'single'`) or several sections (`selectionMode: 'multiple'`)
can be open at once. Reach for `FuroCollapsible` when there is only one
region to hide; reach for `FuroAccordion` as soon as there is a list of
sections declared via `parcel.options` (e.g. an FAQ list).

- Layer: molecule (both)
- Import: `import { FuroCollapsible } from '@openreachtech/furo-vue'`
- Import: `import { FuroAccordion } from '@openreachtech/furo-vue'`
- Manifest entry: `node_modules/@openreachtech/furo-vue/public/furo-vue/components.json` → `components[].name === 'FuroCollapsible'` / `'FuroAccordion'`

Read the manifest before writing markup if you need to confirm this
information is still current — the library may have added props/events since
this skill was written.

## When NOT to use

- Content should be hidden behind a modal/drawer overlay rather than expand
  in place → use `hof-cp-dialog` instead.
- Content should switch between mutually exclusive panels that are always
  visible as tabs (not stacked/collapsed) → use `hof-cp-tabs` instead.
- You need a floating panel anchored to a trigger (tooltip/menu popup), not
  an inline expanding region → use `hof-cp-popover` instead.
- You need a multi-step wizard indicator, not a collapse/expand list →
  use `hof-cp-stepper` instead.

## Props

### FuroCollapsible

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `parcel` | `FuroCollapsibleParcel \| null` | `null` | Reactive configuration object. Non-Furo keys (`aria-label`) forward to the root element. |

### FuroAccordion

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `parcel` | `FuroAccordionParcel \| null` | `null` | Reactive configuration object. Non-Furo keys (`aria-label`) forward to the root element. |

## `parcel` fields

### FuroCollapsible

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `boolean` | unset (`false`) | Open state. When present, the component is controlled; when absent, it manages its own state. |
| `disabled` | `boolean` | `false` | Disables the trigger; the region stays in its current state. |

### FuroAccordion

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `options` | `Array<FuroAccordionOption>` | `[]` | The sections. `value` is the unique key; `label` is the default header; `disabled` disables one section. |
| `value` | `string \| Array<string> \| null` | unset | Expanded section(s). A single value in single mode, an array in multiple mode. Present = controlled. |
| `selectionMode` | `'single' \| 'multiple'` | `'single'` | Whether one or several sections can be open at once. |
| `collapsible` | `boolean` | `true` | single mode only: whether the open section can close. multiple mode is always collapsible. |
| `disabled` | `boolean` | `false` | Disables the whole accordion. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout and keyboard navigation axis. |

## Events

### FuroCollapsible

| Event | Payload | Fires when |
| --- | --- | --- |
| `change-value` | `CollapsibleEmitPayload` | The open state changes. Use `payload.value` (boolean) and `payload.isOpen()`. |
| `update:value` | `boolean` | Same moment as `change-value`; powers `v-model:value` for the open state. |

### FuroAccordion

| Event | Payload | Fires when |
| --- | --- | --- |
| `change-value` | `AccordionEmitPayload` | Expansion changes. Use `payload.value` and `payload.isExpanded({ value })`. |
| `update:value` | `string \| Array<string> \| null` | Same moment as `change-value`; powers `v-model:value` for the expanded section(s). |

## Slots

### FuroCollapsible

| Slot | Scoped props | Description |
| --- | --- | --- |
| `trigger` | `{ open }` | Trigger content (label plus optional indicator) rendered inside the toggle button. |
| `default` | `{ open }` | The collapsible content revealed when open. |

### FuroAccordion

| Slot | Scoped props | Description |
| --- | --- | --- |
| `header` | `{ option, expanded }` | Header content for a section. Defaults to `option.label` (or `option.value`). |
| `content` | `{ option, expanded }` | Body content revealed when the section is open. |

## Usage

Single region with `FuroCollapsible`:

```vue
<script>
import {
  FuroCollapsible,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroCollapsible,
  },
}
</script>

<template>
  <FuroCollapsible
    v-model:value="isDetailOpen"
    :parcel="{ disabled: context.isCollapsibleDisabled() }"
  >
    <template #trigger="{ open }">
      {{ open ? 'Hide details' : 'Show details' }}
    </template>

    <template #default>
      <p>{{ context.detailText }}</p>
    </template>
  </FuroCollapsible>
</template>
```

Multi-section list with `FuroAccordion`:

```vue
<script>
import {
  FuroAccordion,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroAccordion,
  },
}
</script>

<template>
  <FuroAccordion
    v-model:value="openSectionKeys"
    :parcel="{
      options: context.faqOptions,
      selectionMode: 'multiple',
    }"
    @change-value="context.onFaqSectionChange({ payload: $event })"
  >
    <template #header="{ option }">
      {{ option.label }}
    </template>

    <template #content="{ option }">
      <p>{{ option.value }}</p>
    </template>
  </FuroAccordion>
</template>
```

## Rules (per project conventions)

- Pass `parcel` + use `v-model:value` — this is the one documented exception
  to the project's general no-`v-model` rule, which applies only to
  custom in-project components, not to `furo-vue` library components.
- Never import the underlying headless primitive — only the public
  `FuroCollapsible` / `FuroAccordion` exports.
- Put section data (`options`) and open-state change handling in the
  page/component Context, not inline in the template.
