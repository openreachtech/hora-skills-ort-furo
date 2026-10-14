# Classes & Factories

The Furo Context and `app/modules/` class conventions.

## The Params / FactoryParams typedef pair

Every class that has a `create()` factory declares a `<ClassName>Params` typedef and a derived `<ClassName>FactoryParams`. Context params extend `BaseFuroContextParams`:

```js
/**
 * @typedef {BaseFuroContextParams & {
 *   customerStore: CustomerStore
 *   errorMessageHashReactive: Reactive<ErrorMessageHash>
 *   formClerk: ReturnType<typeof useFormClerk>
 * }} UpdateEmailSubmitterContextParams
 */

/**
 * @typedef {UpdateEmailSubmitterContextParams} UpdateEmailSubmitterContextFactoryParams
 */
```

When `create()` defaults some keys via DI, make those optional in FactoryParams with `RequiredExcept` (an ambient global helper — see below):

```js
/**
 * @typedef {BaseFuroContextParams<ComponentProps> & {
 *   currencyFormatter: Intl.NumberFormat
 * }} OrderDetailProductContextParams
 */

/**
 * @typedef {RequiredExcept<OrderDetailProductContextParams, 'currencyFormatter'>} OrderDetailProductContextFactoryParams
 */
```

Common variants: `RequiredExcept<..., 'currencyFormatter'>`, `RequiredExcept<..., 'eventListenerAbortController'>`, `RequiredExcept<..., 'dateTimeFormatter' | 'currencyFormatter'>`, `RequiredExcept<..., FactoryOmittedKeys>` (a named union). When no keys are optional, FactoryParams simply aliases Params.

## The `create()` factory template idiom

Identical in Context classes and `app/modules/` classes ([[hof-furo-context-patterns]], [[hof-modules]]):

```js
/**
 * @template {X extends typeof OrderDetailProductContext ? X : never} T, X
 * @override
 * @param {OrderDetailProductContextFactoryParams} params
 * @returns {InstanceType<T>} Instance of this class.
 * @this {T}
 */
static create ({
  // ...
}) {
  return /** @type {InstanceType<T>} */ (
    new this({
      // ...
    })
  )
}
```

## Class-level annotations

- **`@template` with constraints** in generics: `@template {(...args: Array<unknown>) => void} T`, `@template {GraphqlType.LauncherCtor} L`.
- **`@extends`** on the class doc: `@extends {BaseAppContext<null, ComponentProps, null>}` for contexts; `@extends {BaseGraphqlCapsule<D>}` with `@template D` for capsules.
- **`@override`** on overridden statics/getters — notably `static create`, `static get EMIT_EVENT_NAME`, `static get document`.
- **Class field types** via `@property` in the class-level doc, or captured through the constructor's params typedef:

```js
/**
 * Timer Clerk
 *
 * @property {NodeJS.Timeout | number | null} lastTimer - Last timer
 */
```
