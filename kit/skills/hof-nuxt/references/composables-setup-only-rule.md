# The setup-only rule (critical)

Composables call setup-only APIs — `useRoute()`, `useRouter()`, `onMounted()`, `onUnmounted()`, injection. They therefore **must be called in component/page `setup`**, and their results passed into contexts:

```js
// in setup()
const graphqlClient = useAppGraphqlClient(SomeQueryGraphqlLauncher)
const formClerk = useAppFormClerk({
  FormElementClerk,
  invokeRequestWithFormValueHash: mutationClient.invokeRequestWithFormValueHash,
})

const context = SomeContext.create({
  props,
  componentContext,
  graphqlClientHash: {
    some: graphqlClient,
  },
  formClerk,
})
  .setupComponent()
```

Never call a composable inside a Context class.
