---
name: hf-cp-stepper
description: Use when building a multi-step flow indicator in a repo that consumes @openreachtech/furo-vue — "step indicator", "wizard progress", "multi-step form", "checkout steps". Routes to FuroStepper.
---

# FuroStepper

Multi-step progress organism for form sequences. It renders a step rail
(horizontal or vertical) driven by a declarative `steps` array, with an
optional panel per step exposed through named slots keyed by each step's
value. It can run controlled (`parcel.value` + `v-model:value`, 1-based)
or self-managed, and can be reduced to an indicator-strip-only mode
(`showPanels: false`) when the step content lives outside the component.

- Layer: organism
- Import: `import { FuroStepper } from '@openreachtech/furo-vue'`
- Manifest entry: `node_modules/@openreachtech/furo-vue/public/furo-vue/components.json` → `components[].name === 'FuroStepper'`

Read the manifest before writing markup if you need to confirm this
information is still current — the library may have added props/events since
this skill was written.

## When NOT to use

- Mutually exclusive content panels the user switches between freely (not a
  linear progression) → use `hf-cp-tabs` instead.
- A single show/hide region or a list of independently expandable sections →
  use `hf-cp-collapsible` instead.
- A transient status message (e.g. "step saved") → use `hf-cp-toast`
  instead, not the stepper's panel content.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `parcel` | `FuroStepperParcel \| null` | `null` | Reactive behavior object. |

## `parcel` fields

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `steps` | `Array<FuroStepperStep>` | `[]` | Step descriptors that drive the rail and panel slots. |
| `value` | `number \| null` | `null` | Controlled active step (1-based). When omitted, the component manages its own active step, defaulting to the first step. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction of the step rail. |
| `linear` | `boolean` | `false` | When true, steps must be completed in order — forward jumps are blocked. |
| `showPanels` | `boolean` | `true` | When false, no panels render — the component is an indicator strip only. |
| `disabled` | `boolean` | `false` | Disables the whole stepper. |

## Events

| Event | Payload | Fires when |
| --- | --- | --- |
| `update:value` | `number` | Active step changed — enables `v-model:value`. |
| `step:change` | `{ value: number }` | Active step changed. |

## Slots

| Slot | Scoped props | Description |
| --- | --- | --- |
| `<value>` (or `<slotName>`) | `{ value, step }` | Panel content for the matching step. One slot per step, keyed by the step's `value` (or its `slotName` override). |
| `indicator-<value>` | `{ step, value, completed }` | Custom indicator content. When omitted, shows a check icon when completed, else the step number. |
| `title-<value>` | `{ value }` | Custom title content. When omitted, the title shows `title`. |

## Usage

```vue
<script>
import {
  FuroStepper,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroStepper,
  },
}
</script>

<template>
  <FuroStepper
    v-model:value="context.activeStepValue"
    :parcel="{
      steps: context.wizardSteps,
      linear: true,
    }"
    @step:change="context.onWizardStepChange({ payload: $event })"
  >
    <template #1="{ step }">
      <ShippingForm :step="step" />
    </template>

    <template #2="{ step }">
      <PaymentForm :step="step" />
    </template>

    <template #3="{ step }">
      <ConfirmationSummary :step="step" />
    </template>
  </FuroStepper>
</template>
```

Indicator-strip-only mode, where the step content lives in the page itself:

```vue
<template>
  <FuroStepper
    v-model:value="context.activeStepValue"
    :parcel="{
      steps: context.wizardSteps,
      showPanels: false,
    }"
  />

  <section>
    <ShippingForm v-if="context.activeStepValue === 1" />
    <PaymentForm v-if="context.activeStepValue === 2" />
  </section>
</template>
```

## Rules (per project conventions)

- Pass `parcel` + use `v-model:value` for the active step — this is the one
  documented exception to the project's general no-`v-model` rule, which
  applies only to custom in-project components, not to `furo-vue` library
  components.
- Never import the underlying headless primitive — only the public
  `FuroStepper` export.
- Keep the `steps` array and step-transition/validation logic (e.g. whether
  a step may be left) in the page/component Context, not inline in the
  template.
