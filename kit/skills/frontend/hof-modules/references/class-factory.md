# Class factory pattern

## Example modules

```
app/modules/TimerClerk.js         # class: manages a setTimeout lifecycle
```

## Behavioral class with the `create()` factory idiom

Class modules use `export default class`, a `constructor({ ... })` taking a single destructured object, and a static
`create()` factory that is the intended construction path (constructors are not called directly). The factory uses the
self-typing idiom shared across Furo apps (identical in Context classes — see [[hof-furo-context-patterns]],
[[hoc-jsdoc]]):

```js
export default class TimerClerk {
  /**
   * Constructor.
   *
   * @param {{
   *   callback: Function
   *   timeInMilliseconds: number
   * }} params - Parameters
   */
  constructor ({
    callback,
    timeInMilliseconds,
  }) {
    this.callback = callback
    this.timeInMilliseconds = timeInMilliseconds
    this.lastTimer = null
  }

  /**
   * Factory method to create a new instance of this class.
   *
   * @template {X extends typeof TimerClerk ? X : never} T, X
   * @param {{
   *   callback: Function
   *   timeInMilliseconds: number
   * }} params - Parameters
   * @returns {InstanceType<T>}
   * @this {T}
   */
  static create ({
    callback,
    timeInMilliseconds,
  }) {
    return /** @type {InstanceType<T>} */ (
      new this({
        callback,
        timeInMilliseconds,
      })
    )
  }
}
```

### Dependency injection with factory defaults

`create()` can default collaborators, making the class testable by injection. Type `FactoryParams` as `Partial<...Params>` (or `RequiredExcept`) accordingly:

```js
static create ({
  resolveCardBrand = determineCardType,
  getCardTypeDefinition = determineCardType.getTypeInfo,
  cardBrands = determineCardType.types,
} = {}) {
  return /** @type {InstanceType<T>} */ (
    new this({
      resolveCardBrand,
      getCardTypeDefinition,
      cardBrands,
    })
  )
}

// at file bottom:
/**
 * @typedef {{
 *   resolveCardBrand: typeof determineCardType
 *   getCardTypeDefinition: typeof determineCardType.getTypeInfo
 *   cardBrands: typeof determineCardType.types
 * }} CardBrandDetectorParams
 */

/**
 * @typedef {Partial<CardBrandDetectorParams>} CardBrandDetectorFactoryParams
 */
```
