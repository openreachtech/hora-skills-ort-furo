# Applications (`APP`)

## Excluded from this flow

| Operation | Reason |
| --- | --- |
| `purgeApplication` | Operations-only; reachable from the maintenance CLI, never from the UI |

## Scenarios

### APP-01 — A member submits an application and can see it afterwards

- **Actor**: member
- **State**: active
- **Covers**: `createApplication`, `applications`, `application`
- **Success condition**: the application appears in the member's own list with status "submitted"

### APP-04 — *retired*

- **State**: retired 2026-03-11 — the paper-form upload it covered was removed from the product.
