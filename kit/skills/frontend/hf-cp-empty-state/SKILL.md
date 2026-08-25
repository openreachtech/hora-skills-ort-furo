---
name: hf-cp-empty-state
description: Use when showing a placeholder for a region with no records, or a placeholder for a region that failed to load, in a repo that consumes @openreachtech/furo-vue — "no results found", "empty list placeholder", "failed to load error message", "retry after fetch error". Routes to FuroEmptyState, FuroErrorState.
---

# FuroEmptyState / FuroErrorState

Both are presentational molecules sharing the same shape (title,
description, `icon` slot, `action` slot) but signal opposite conditions.
`FuroEmptyState` is for a region that loaded successfully but legitimately
has nothing to show — no records, no search matches, nothing created yet —
paired with an `action` slot such as a create button. `FuroErrorState` is
for a region whose fetch/request failed — its root announces the failure
via `role="alert"` and its `action` slot is typically a retry button rather
than a create button. Neither component fetches data or decides which state
applies; the parent Context inspects the fetch result and chooses which one
to render (or neither, when data is present).

- Layer: molecule (both)
- Import: `import { FuroEmptyState, FuroErrorState } from '@openreachtech/furo-vue'`
- Manifest entries: `node_modules/@openreachtech/furo-vue/public/furo-vue/components.json` → `components[].name === 'FuroEmptyState'` and `=== 'FuroErrorState'`

Read the manifest before writing markup if you need to confirm this
information is still current — the library may have added props/events since
this skill was written.

## When NOT to use

- The region is still loading (request in flight), not empty or failed → use `app-avatar` (`FuroSkeleton`) instead.
- A transient, auto-dismissing notification about success/failure, not a persistent in-region placeholder → use `hf-cp-toast` instead.
- An error severe enough to block the whole flow and require an explicit user decision (e.g. confirm/cancel) → use `hf-cp-dialog` instead of an inline `FuroErrorState`.
- Tabular data with zero rows inside a `FuroTable` — check whether `hf-cp-table` already has a built-in empty-row treatment before adding a separate `FuroEmptyState` on top.

## FuroEmptyState

### Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `parcel` | `EmptyStateParcel \| null` | `null` | Reactive data object holding the title and description text. |

### `parcel` fields

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `string` | — | Heading text. Rendered only when supplied; the consumer owns the wording. |
| `description` | `string` | — | Supporting text under the title. Rendered only when supplied. |

### Events

`FuroEmptyState` has no documented events in the manifest — it carries no value and emits nothing.

### Slots

| Slot | Scoped props | Description |
| --- | --- | --- |
| `icon` | — | Leading icon or illustration above the title. |
| `action` | — | Action controls (for example a create button) below the text. |

## FuroErrorState

### Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `parcel` | `ErrorStateParcel \| null` | `null` | Reactive data object holding the title and description text. |

### `parcel` fields

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `string` | — | Heading text. Rendered only when supplied; the consumer owns the wording. |
| `description` | `string` | — | Supporting text under the title. Rendered only when supplied. |

### Events

`FuroErrorState` has no documented events in the manifest — it carries no value and emits nothing; the root announces the failure via `role="alert"`.

### Slots

| Slot | Scoped props | Description |
| --- | --- | --- |
| `icon` | — | Leading icon or illustration above the title. |
| `action` | — | Action controls (for example a retry button) below the text. |

## Usage

```vue
<script>
import {
  FuroEmptyState,
  FuroErrorState,
  FuroButton,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroEmptyState,
    FuroErrorState,
    FuroButton,
  },
}
</script>

<template>
  <FuroErrorState
    v-if="context.hasFetchError"
    :parcel="{
      title: 'Failed to load members',
      description: context.fetchErrorMessage,
    }"
  >
    <template #action>
      <FuroButton @click="context.onRetryFetchMembers()">
        Retry
      </FuroButton>
    </template>
  </FuroErrorState>

  <FuroEmptyState
    v-else-if="context.hasNoMembers"
    :parcel="{
      title: 'No members yet',
      description: 'Invite your first team member to get started.',
    }"
  >
    <template #action>
      <FuroButton @click="context.onClickInviteMember()">
        Invite member
      </FuroButton>
    </template>
  </FuroEmptyState>
</template>
```

## Rules (per project conventions)

- Neither `FuroEmptyState` nor `FuroErrorState` is a form control: neither
  carries a `value`, exposes a `v-model`, nor emits events. Configure each
  purely through `parcel` (`title`, `description`) and use the `icon` /
  `action` slots for illustration and controls.
- Never import the underlying headless empty-state or error-state primitive
  — only the public `FuroEmptyState` / `FuroErrorState` exports.
- Decide which state applies (loading / empty / error / loaded) in the
  page/component Context and expose simple boolean flags (e.g.
  `hasFetchError`, `hasNoMembers`) for the template to branch on with
  `v-if`/`v-else-if`, rather than embedding fetch-result inspection in the
  template.
