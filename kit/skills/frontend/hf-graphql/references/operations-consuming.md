# Consuming an operation

Create the client in `setup`, group into a `graphqlClientHash`, and hand it to a Fetcher/SubmitterContext:

```js
// in setup()
const customerProfileGraphqlClient = useAppGraphqlClient(CustomerProfileQueryGraphqlLauncher)
```

```js
// Fetcher
get customerProfileCapsule () {
  return this.graphqlClientHash.customerProfile
    .capsuleRef
    .value
}

fetchCustomerProfileOnMounted () {
  this.graphqlClientHash.customerProfile
    .invokeRequestOnMounted({
      hooks: this.customerProfileLauncherHooks,
    })
}
```

The composable exposes `invokeRequestOnMounted` / `invokeRequestOnEvent` / `invokeRequestWithFormValueHash` and the reactive `capsuleRef`. Hooks are typed `GraphqlType.LauncherHooks<Payload, Capsule>` with `beforeRequest`/`afterRequest`. See [[fetcher-operation]] and [[mutation-operation]] for the full flow.
