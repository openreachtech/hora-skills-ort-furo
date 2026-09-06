# Props & Emits

## Props

Object form with `type`, `required`, `default`, and often a `validator`. Attach types via JSDoc `PropType` casts:

```js
// enum-like string prop
color: {
  /** @type {import('vue').PropType<ButtonColor>} */
  type: String,
  required: false,
  default: 'primary',
},

// GraphQL schema entity
orderSummary: {
  /** @type {import('vue').PropType<schema.graphql.OrderSummary>} */
  type: Object,
  required: true,
},

// nullable number
amount: {
  type: [Number, null],
  required: false,
  default: null,
},
```

## Emits

Declare `emits` from a static map on the context — never raw strings — so the event names stay defined in one place:

```js
// Component
emits: [
  CreditCardSelectDialogContext.EMIT_EVENT_NAME.DISMISS,
  CreditCardSelectDialogContext.EMIT_EVENT_NAME.SELECT_CREDIT_CARD,
],
```

```js
// Context
static get EMIT_EVENT_NAME () {
  return {
    DISMISS: 'dismiss',
    SELECT_CREDIT_CARD: 'selectCreditCard',
  }
}
```

The context emits via `this.emit(this.EMIT_EVENT_NAME.SELECT_CREDIT_CARD, payload)`.
