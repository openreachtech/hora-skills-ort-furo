# Base class

Every context extends `BaseAppContext` (`app/vue/contexts/BaseAppContext.js`), which extends `BaseFuroContext` from
`@openreachtech/furo-nuxt`. Put commonly used methods in `BaseAppContext` so pages can reuse them.

```js
import {
  BaseFuroContext,
} from '@openreachtech/furo-nuxt'

/**
 * BaseAppContext
 *
 * @template {typeof import('@openreachtech/furo-nuxt').BaseFuroContextAccessor<*> | null} [A = null] - ContextAccessor class.
 * @template {import('vue').ComponentCustomProps} [P = {}] - Props.
 * @template {string | null} [EE = null] - emit() event names.
 * @extends {BaseFuroContext<A, P, EE>}
 */
export default class BaseAppContext extends BaseFuroContext {}
```

## Generic params `BaseAppContext<A, P, EE>`

- `A` — ContextAccessor class, or `null`.
- `P` — component Props typedef, or `{}`.
- `EE` — union of `emit()` event names, or `null`.

Examples: `ErrorPageContext extends BaseAppContext<null, ComponentProps, null>`, `AnnouncementsPageContext extends BaseAppContext<null, {}, null>`.

## Inherited helpers (from `BaseFuroContext`)

`this.props`, `this.componentContext`, `this.attrs`, `this.slots`, `this.emit`, `this.expose` (Vue's `expose`), `this.watch` (Vue's `watch`), `this.$` (ContextAccessor), `this.EMIT_EVENT_NAME`, `this.Ctor`.
