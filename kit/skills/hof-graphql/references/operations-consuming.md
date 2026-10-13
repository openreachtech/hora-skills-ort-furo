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

## Several calls to one operation at once

One client holds one `capsuleRef`, and every `invokeRequest*` call overwrites it. Two calls in flight on one client race, and the screen keeps whichever response arrives last.

**A fixed number of calls takes one client each.** Create them side by side in `setup` and list them in the `graphqlClientHash` under names that say which call each one serves:

```js
const openTicketsGraphqlClient = useAppGraphqlClient(TicketsQueryGraphqlLauncher)
const closedTicketsGraphqlClient = useAppGraphqlClient(TicketsQueryGraphqlLauncher)
```

**A number known only at run time, such as one call per row, goes through the launcher.** `Launcher.createPayload()` builds the payload and `launchRequest()` resolves to a capsule, so the calls run under `Promise.all` and each capsule stays with the row that asked for it:

```js
async fetchTicketCapsules ({
  ticketIds,
}) {
  const capsules = await Promise.all(
    ticketIds.map(ticketId =>
      this.launchTicketRequest({
        ticketId,
      })
    )
  )

  this.ticketCapsulesRef.value = capsules
}

launchTicketRequest ({
  ticketId,
}) {
  const payload = TicketQueryGraphqlLauncher.createPayload({
    variables: {
      input: {
        ticketId,
      },
    },
  })

  return TicketQueryGraphqlLauncher.create()
    .launchRequest({
      payload,
      hooks: this.ticketLauncherHooks,
    })
}
```

Keep the resulting capsules in a ref the Context owns, as `capsuleRef` would have held a single one.

The launcher route skips `useAppGraphqlClient`, and with it the `afterRequest` hook that wrapper injects for an unauthenticated capsule. Put the same handling into the hooks passed to `launchRequest()`.
