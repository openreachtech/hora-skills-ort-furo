---
name: hf-cp-date-time
description: Use when building a date and/or time selection control in a repo that consumes @openreachtech/furo-vue — "date picker", "pick a date", "time input", "date and time field", "schedule at". Routes to FuroDatePicker, FuroTimeField, FuroDateTimePicker.
---

# FuroDatePicker / FuroTimeField / FuroDateTimePicker

Three molecule-layer controls for date/time selection. `FuroDatePicker` is a
calendar-backed date field (segments + popover calendar) whose wire value is
a `YYYY-MM-DD` string. `FuroTimeField` is a segmented inline time input (no
popover) whose wire value is `HH:MM:SS`. `FuroDateTimePicker` composes both
of them into a single popover control whose wire value is the combined
`YYYY-MM-DDTHH:MM:SS` string — use it instead of manually pairing a date
picker and a time field side by side. Pick exactly one of the three based on
what the underlying data represents (date only, time only, or a combined
timestamp), not on how you want it to look.

- Layer: molecule (all three)
- Import: `import { FuroDatePicker, FuroTimeField, FuroDateTimePicker } from '@openreachtech/furo-vue'`
- Manifest entries: `node_modules/@openreachtech/furo-vue/public/furo-vue/components.json` → `components[].name` equal to `'FuroDatePicker'`, `'FuroTimeField'`, or `'FuroDateTimePicker'`

Read the manifest before writing markup if you need to confirm this
information is still current — the library may have added props/events since
this skill was written.

## When NOT to use

- Plain single-line text/number input with no calendar/time semantics → use `hf-cp-text-field` instead.
- You need a date range (start + end) rather than a single date — none of these three model a range; check the manifest for a dedicated range component before hand-rolling two `FuroDatePicker`s.
- Needs a label / hint / error message wrapper around it → wrap in `FuroControlBlock` (see `hf-cp-control-block`), don't hand-roll a `<label>`.
- You only need an inline click-to-edit display/edit toggle for an arbitrary value (not specifically a date/time widget) → see `hf-cp-editable-field`.
- The trigger for opening a floating panel is a plain button/icon with arbitrary content (not a date field) → see `hf-cp-popover` or `hf-cp-dropdown-menu`.

## Props

### FuroDatePicker

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `parcel` | `DatePickerParcel \| null` | `null` | Reactive data object. Furo-only keys are stripped before passthrough to the underlying primitive. |
| `triggerParcel` | `Record<string, unknown> \| null` | `null` | Passed to the date field / trigger via `v-bind`. |
| `contentParcel` | `Record<string, unknown> \| null` | `null` | Passed to the popover content via `v-bind`. |

### FuroTimeField

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `parcel` | `TimeFieldParcel \| null` | `null` | Reactive data object. Furo-only keys are stripped before passthrough to the underlying primitive. |

### FuroDateTimePicker

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `parcel` | `DateTimePickerParcel \| null` | `null` | Reactive data object. Molecule-only keys are consumed here and used to derive the child parcels. |

## `parcel` fields

### FuroDatePicker `parcel`

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string \| null` | — | Currently selected date as `YYYY-MM-DD` or null. |
| `invalid` | `boolean` | — | Shows error chrome and sets `aria-invalid`. |
| `placeholder` | `string \| null` | — | Placeholder text for the date field. |
| `disabled` | `boolean` | — | Disables all interaction. |
| `minValue` | `string \| null` | — | Minimum selectable date (`YYYY-MM-DD`). Earlier dates are non-interactive. |
| `maxValue` | `string \| null` | — | Maximum selectable date (`YYYY-MM-DD`). Later dates are non-interactive. |
| `displayFormat` | `string \| null` | — | Reserved for v1.1 localized display format (not yet applied). |
| `timezone` | `string \| null` | `null` | IANA timezone identifier. Interprets Date object inputs before normalization; no effect on `YYYY-MM-DD` strings. |
| `closeOnSelect` | `boolean \| null` | `true` | Whether the popover closes when a date is selected. |
| `locale` | `string \| null` | browser locale | Drives the date field's segment order; falls back to `'en'` outside the browser. |
| `preventDeselect` | `boolean \| null` | `true` | When true, re-selecting the selected date keeps it instead of clearing. |
| `todayButtonText` | `string \| null` | `'Today'` | Label for the footer Today button; pass null to hide it. |
| `clearButtonText` | `string \| null` | `'Clear'` | Label for the footer Clear button; pass null to hide it. |

### FuroTimeField `parcel`

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string \| null` | — | Current time as `HH:MM:SS` (or `HH:MM`) or null. The context also accepts Date / Time at the boundary. |
| `invalid` | `boolean` | — | Forces error chrome and `aria-invalid` (external validation). |
| `placeholder` | `string \| null` | — | Placeholder text for the time field. |
| `disabled` | `boolean` | — | Disables all interaction. |
| `readonly` | `boolean` | — | Segments are focusable but not editable. |
| `minValue` | `string \| null` | — | Minimum time (`HH:MM:SS`). Out-of-range values are flagged, not clamped. |
| `maxValue` | `string \| null` | — | Maximum time (`HH:MM:SS`). Out-of-range values are flagged, not clamped. |
| `timeFormat` | `number \| null` | locale default | `12` or `24`. When unset, the locale default applies. |
| `granularity` | `'hour' \| 'minute' \| 'second' \| null` | `'minute'` | Controls visible segments. |
| `step` | `number \| null` | `1` | Step amount for arrow edits and the buttons; the unit follows granularity. Forwarded as native `step`. |
| `stepSnapping` | `boolean \| null` | — | Optional `stepSnapping`. Forwarded only when explicitly set. |
| `timezone` | `string \| null` | `null` | IANA timezone; normalizes Date inputs to wall-clock parts in that zone. Never forwarded to the primitive. |

### FuroDateTimePicker `parcel`

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string \| null` | — | Combined value as `YYYY-MM-DDTHH:MM:SS` or null. Split into date/time parts and recombined on change. |
| `invalid` | `boolean` | — | Shows error chrome and `aria-invalid` on the unit shell; also forwarded to both atoms. |
| `placeholder` | `string \| null` | — | Placeholder text for the date field. |
| `disabled` | `boolean` | — | Disables all interaction. |
| `minValue` | `string \| null` | — | Minimum selectable datetime (`YYYY-MM-DDTHH:MM:SS`). See cross-field rule in features. |
| `maxValue` | `string \| null` | — | Maximum selectable datetime (`YYYY-MM-DDTHH:MM:SS`). See cross-field rule in features. |
| `timezone` | `string \| null` | `null` | IANA timezone identifier forwarded to both atoms. |
| `granularity` | `'hour' \| 'minute' \| 'second' \| null` | — | Visible time segments. Does not change the wire format (always second precision). |
| `step` | `number \| null` | — | Step amount for the time field's increment / decrement buttons. |
| `timeFormat` | `number \| null` | locale default | `12` or `24`. When unset, the locale default applies. |

## Events

### FuroDatePicker

| Event | Payload | Fires when |
| --- | --- | --- |
| `change-value` | `DatePickerEmitPayload` | Fired when the user selects a date. |
| `commit-value` | `DatePickerEmitPayload` | Fired on the same selection event (single-date close-on-select UX). |
| `update:value` | `string \| null` | ISO `YYYY-MM-DD` string or null. Suitable for `v-model:value`. |

### FuroTimeField

| Event | Payload | Fires when |
| --- | --- | --- |
| `change-value` | `TimeFieldEmitPayload` | Fired when the user edits a segment. |
| `commit-value` | `TimeFieldEmitPayload` | Fired on the same edit event (inline single-region UX). |
| `update:value` | `string \| null` | `HH:MM:SS` string or null. Suitable for `v-model:value`. |

### FuroDateTimePicker

| Event | Payload | Fires when |
| --- | --- | --- |
| `change-value` | `DateTimePickerEmitPayload` | Fired when either the date or time part changes. |
| `commit-value` | `DateTimePickerEmitPayload` | Fired on the same change event. |
| `update:value` | `string \| null` | Combined `YYYY-MM-DDTHH:MM:SS` string. Selecting a date sets `12:00:00`; null only while no date is set. |

## Slots

### FuroDatePicker

| Slot | Description |
| --- | --- |
| `trigger-icon` | Replaces the default calendar icon inside the trigger. |
| `prev-icon` | Replaces the left-arrow icon in the calendar header. |
| `next-icon` | Replaces the right-arrow icon in the calendar header. |
| `field-suffix` | Custom content inside the trigger field, after the segments and before the trigger icon. |
| `content-footer` | Custom content inside the popover, below the calendar. |

### FuroTimeField

No slots — the manifest lists an empty `slots` array for this component.

### FuroDateTimePicker

No slots — the manifest lists an empty `slots` array for this component.

## Usage

```vue
<script>
import {
  FuroDatePicker,
  FuroTimeField,
  FuroDateTimePicker,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroDatePicker,
    FuroTimeField,
    FuroDateTimePicker,
  },
}
</script>

<template>
  <FuroDatePicker
    v-model:value="form.dueDate"
    :parcel="{ invalid: context.hasDueDateError(), minValue: context.todayIsoDate }"
    placeholder="Select due date"
    @commit-value="context.onCommitDueDate({ payload: $event })"
  />

  <FuroTimeField
    v-model:value="form.startTime"
    :parcel="{ invalid: context.hasStartTimeError(), granularity: 'minute' }"
    placeholder="Select start time"
  />

  <FuroDateTimePicker
    v-model:value="form.scheduledAt"
    :parcel="{ invalid: context.hasScheduledAtError() }"
    placeholder="Select date and time"
  />
</template>
```

With a label/hint/error wrapper:

```vue
<template>
  <FuroControlBlock :parcel="{ label: 'Due date', error: context.dueDateError }">
    <FuroDatePicker
      v-model:value="form.dueDate"
      :parcel="{ invalid: context.hasDueDateError() }"
    />
  </FuroControlBlock>
</template>
```

## Rules (per project conventions)

- Pass `parcel` + use `v-model:value` — this is the one documented exception
  to the project's general no-`v-model` rule, which applies only to
  custom in-project components, not to `furo-vue` library components.
- Never import the underlying headless primitive — only the public
  `FuroDatePicker` / `FuroTimeField` / `FuroDateTimePicker` exports.
- Put commit/validation logic in the page/component Context
  (`on{Field}Commit` style method), not inline in the template.
- Prefer `FuroDateTimePicker` over composing `FuroDatePicker` and
  `FuroTimeField` yourself whenever the underlying data model is a single
  combined timestamp — it keeps the calendar single-sourced and normalizes
  the wire format for you.
