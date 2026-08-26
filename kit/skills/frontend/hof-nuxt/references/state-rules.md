# Rules

- **`useState` key** is a unique global lowercase string (`'customer'`, `'toast'`).
- **State ref** is named `<domain>StateRef` (the `Ref` returned by `useState`).
- **Mutate directly**: `stateRef.value.x = ...`; partial updates spread (`{ ...stateRef.value.x, ...patch }`); clears reset to `null` or to the default state object.
- **Actions take a single destructured params object**: `function setCustomer ({ customer }) { ... }`.
- **Async actions may call other composables** — e.g. `fetchCustomer` uses `useAppGraphqlClient(...)`, checks `capsule.hasError()`, then calls its own setters:

```js
async function fetchCustomer () {
  const {
    capsuleRef,
    invokeRequestOnEvent,
  } = useAppGraphqlClient(CustomerGlobalStateQueryGraphqlLauncher)

  await invokeRequestOnEvent()

  const capsule = capsuleRef.value

  if (capsule.hasError()) {
    return
  }

  setCustomer({
    customer: capsule.customerProfileValueHash,
  })
  // ...setCustomerRegistrationStatus / setRobotPaymentUser / setMembership
}
```

- **Typedefs at the bottom**: `<Domain>Store` (return shape), `<Domain>State` (state shape), plus one typedef per params object. GraphQL-derived types come from the global `schema.graphql.*` namespace (see [[hof-graphql]]).
