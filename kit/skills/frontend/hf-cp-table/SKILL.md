---
name: hf-cp-table
description: Use when building tabular data with row selection/sorting, plus its page-navigation companion, in a repo that consumes @openreachtech/furo-vue — "data table", "sortable table", "paginated list", "select rows in a table", "page navigation". Routes to FuroTable, FuroPagination.
---

# FuroTable / FuroPagination

`FuroTable` is a slot-based, controlled data-table organism: it takes a
`columns` + `rows` parcel and renders a native `<table>`, with controlled sort,
row selection, loading/error/empty states, and optional virtual scrolling —
it holds no fetch logic itself. `FuroPagination` is a domain-agnostic page
navigation molecule (prev/next + numbered pages, ellipsis collapsing) that
knows nothing about `FuroTable` or GraphQL; it emits which page was picked and
the consumer wires that to a refetch. The two are commonly used together:
`FuroTable` even reserves a dedicated `pagination` slot to host a
`FuroPagination` right below the rows.

- Layer: organism (`FuroTable`), molecule (`FuroPagination`)
- Import: `import { FuroTable, FuroPagination } from '@openreachtech/furo-vue'`
- Manifest entry: `node_modules/@openreachtech/furo-vue/public/furo-vue/components.json` → `components[].name === 'FuroTable'` / `'FuroPagination'`

Read the manifest before writing markup if you need to confirm this
information is still current — the library may have added props/events since
this skill was written.

## When NOT to use

- Non-tabular list of cards/rows with no columns/sorting needs → a plain `v-for` list is simpler than forcing it into `FuroTable`.
- A single value that toggles between display and edit inline (not a whole table row) → use `hf-cp-editable-field`.
- Multi-step progress display, not row data → use `hf-cp-stepper`.
- Need a floating panel or hover hint inside a cell → use `hf-cp-popover`, and put it inside the `cell` slot rather than rebuilding table markup.
- Need a modal to confirm a row action (e.g. delete) → use `hf-cp-dialog` (`FuroAlertDialog`), triggered from the `cell` slot's action button.

## Props

Both take a single `parcel` prop — no other props.

| Component | Prop | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `FuroTable` | `parcel` | `FuroTableParcel \| null` | `null` | Closed-set, JSON-serializable table state. |
| `FuroPagination` | `parcel` | `FuroPaginationParcel \| null` | `null` | Reactive behavior object. |

## `parcel` fields

### FuroTable

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `columns` | `Array<FuroTableColumn>` | `[]` | Column configuration. |
| `rows` | `Array<object>` | `[]` | Raw row records, rendered in the order given. |
| `rowKey` | `string` | `'id'` | Field used as each row's unique key. |
| `selectable` | `boolean` | `false` | Show the selection column and select-all checkbox. |
| `selectedRowKeys` | `Array<string \| number> \| null` | `null` | Controlled selection. `null` = uncontrolled (table holds its own selection). |
| `sort` | `{ field: string, direction: 'asc' \| 'desc' } \| null` | `null` | Active sort indicator (controlled). |
| `loading` | `boolean` | `false` | Render the loading state. |
| `errorMessage` | `string \| null` | `null` | When set, render the error state (takes precedence over loading/empty/rows). |
| `emptyText` | `string` | `'No records'` | Text for the default empty state. |
| `virtual` | `FuroTableVirtual \| null` | `null` | When set, fixed-height virtual scrolling. |
| `totalRecords` | `number \| null` | `null` (falls back to `rows.length`) | Full dataset size — drives total scroll height in virtual mode. |
| `rowOffset` | `number` | `0` | Global index of `rows[0]` — lets `rows` be a sparse window in virtual mode. |
| `resizable` | `boolean` | `false` | Show drag handles on column edges. |
| `compact` | `boolean` | `false` | Compact density — denser rows, tighter padding, smaller text. |
| `gridLines` | `boolean` | `false` | Vertical borders between columns. |

`FuroTableColumn` is not further broken out in the manifest as its own table;
inspecting the component source shows each entry carries at least `field` and
`label` (label falls back to `field` when omitted), plus optional `align`,
`sortable`, and `width` — confirm current fields against
`FuroTableContext.js` if the manifest doesn't expand this type.

### FuroPagination

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `page` | `number \| null` | `null` | Controlled current page (1-based). When omitted, the component manages its own page. |
| `offset` | `number \| null` | `null` | Controlled current page as a zero-based record offset. The page is derived via `floor(offset / limit) + 1`. When both `page` and `offset` are set, `page` takes precedence. Provide only one. |
| `limit` | `number` | `20` | Records per page. Combined with `totalRecords` to compute the page count. |
| `totalRecords` | `number` | `0` | Total record count across all pages. |
| `siblingCount` | `number` | `2` | Pages shown on each side of the current page before collapsing into an ellipsis. |
| `showEdges` | `boolean` | `true` | When true, the first and last pages stay pinned with ellipsis gaps. `false` renders a plain contiguous range. |
| `disabled` | `boolean` | `false` | Disables the whole control. |

## Events

### FuroTable

| Event | Payload | Fires when |
| --- | --- | --- |
| `sort:change` | `{ field: string, direction: 'asc' \| 'desc' \| null }` | A sortable header is clicked. Cycles asc → desc → null (direction null restores the default order). |
| `selection:change` | `{ selectedRowKeys: Array<string \| number> }` | A row or the select-all checkbox toggles. |
| `update:selectedRowKeys` | `Array<string \| number>` | `v-model:selectedRowKeys` sync (fires with `selection:change`). |
| `range:change` | `{ first: number, last: number }` | Virtual mode only — the visible global row window moved. |
| `row:click` | `{ row: object, rowKey: string \| number \| null }` | A data row is clicked. Interactive cell-slot content should `@click.stop` to opt out. |

### FuroPagination

| Event | Payload | Fires when |
| --- | --- | --- |
| `update:page` | `number` | Selected page changed — enables `v-model:page`. |
| `page:change` | `{ page: number, offset: number, limit: number }` | Selected page changed. `offset` (`(page - 1) * limit`) and `limit` are provided so offset/limit data sources can use the payload directly. |

## Slots

### FuroTable

| Slot | Scoped props | Description |
| --- | --- | --- |
| `header-cell` | `{ column }` | Header cell content. Falls back to `column.label`. |
| `cell` | `{ row, column, value }` | Cell content. Falls back to the raw cell value. |
| `loading` | — | Loading state content. Falls back to a spinner icon. |
| `empty` | — | Empty state content. Falls back to `parcel.emptyText`. |
| `error` | `{ message }` | Error state content. Falls back to `parcel.errorMessage`. |
| `placeholder` | `{ index }` | Unloaded virtual row. Falls back to a shimmer skeleton bar. |
| `pagination` | — | Host a `FuroPagination` here. Empty by default. |

### FuroPagination

| Slot | Scoped props | Description |
| --- | --- | --- |
| `previous` | — | Content of the previous-page button (defaults to a left-caret icon). |
| `next` | — | Content of the next-page button (defaults to a right-caret icon). |
| `ellipsis` | — | Content of the gap marker (defaults to a three-dots icon). |
| `page` | `{ page }` | Custom content for each page entry. Rendered via as-child, so the slot may supply an anchor for SEO — the click still drives `page:change`. |

## Usage

```vue
<script>
import {
  FuroTable,
  FuroPagination,
} from '@openreachtech/furo-vue'

export default {
  components: {
    FuroTable,
    FuroPagination,
  },
}
</script>

<template>
  <FuroTable
    :parcel="{
      columns: context.memberColumns,
      rows: context.memberRows,
      rowKey: 'id',
      selectable: true,
      selectedRowKeys: context.selectedMemberIds,
      sort: context.activeSort,
      loading: context.isLoadingMembers,
      errorMessage: context.membersErrorMessage,
    }"
    @sort:change="context.onSortChange({ payload: $event })"
    @update:selected-row-keys="context.onSelectionChange({ payload: $event })"
    @row:click="context.onRowClick({ payload: $event })"
  >
    <template #cell="{ row, column, value }">
      <button
        v-if="column.field === 'actions'"
        type="button"
        @click.stop="context.onEditMember({ member: row })"
      >
        Edit
      </button>
      <span v-else>
        {{ value }}
      </span>
    </template>

    <template #pagination>
      <FuroPagination
        v-model:page="context.currentPage"
        :parcel="{ limit: context.pageLimit, totalRecords: context.totalMemberCount }"
        @page:change="context.onPageChange({ payload: $event })"
      />
    </template>
  </FuroTable>
</template>
```

## Rules (per project conventions)

- Neither component follows the single-value form-control (`parcel.value`)
  contract. `FuroTable` uses `parcel.selectedRowKeys` +
  `v-model:selectedRowKeys` for selection; `FuroPagination` uses `parcel.page`
  + `v-model:page`. Both are the documented exception to the project's
  general no-`v-model` rule, which applies only to custom in-project
  components, not to `furo-vue` library components.
- Never import the underlying rendering internals — only the public
  `FuroTable` / `FuroPagination` exports.
- Keep data fetching, sort/selection/page state, and row-action handlers in
  the page/component Context (e.g. `onSortChange`, `onPageChange`); the
  template only binds `parcel` and forwards events. `FuroTable` is
  presentational and holds no GraphQL, router, or fetch logic of its own —
  that responsibility belongs to the Context per the parent-component data
  flow policy.
