# Adding a concrete client

Add a folder under `app/restfulapi/renchan/<name>/` with `<FeaturePascalCase>RestfulApi{Launcher|Payload|Capsule}.js` extending the app bases. The Payload inherits `prefixPathname` and the access-token conventions; define the path/method/params on it and value-hash getters on the Capsule. The flow is furo's `Launcher.create() → launchRequest({ payload, hooks }) → Capsule`, matching GraphQL.

If there is no `useAppRenchanRestfulApiClient` composable yet, either add one mirroring `useAppGraphqlClient` ([[hf-nuxt]]) or drive the launcher directly — then consume it from a Fetcher/SubmitterContext exactly like a GraphQL client ([[fetcher-operation]], [[mutation-operation]]). Follow the surrounding GraphQL conventions when introducing this.
