# The Launcher / Payload / Capsule trio

## Folder & file layout

Each operation lives in its own folder named after the GraphQL field (camelCase):

```
app/graphql/client/queries/<fieldName>/
├── <Field>QueryGraphqlLauncher.js
├── <Field>QueryGraphqlPayload.js
└── <Field>QueryGraphqlCapsule.js

app/graphql/client/mutations/<fieldName>/
├── <Field>MutationGraphqlLauncher.js
├── <Field>MutationGraphqlPayload.js
└── <Field>MutationGraphqlCapsule.js
```

All three extend app base classes in `app/graphql/client/` (`BaseAppGraphqlLauncher`, `BaseAppGraphqlPayload`, `BaseAppGraphqlCapsule`), which extend `@openreachtech/furo` bases. Subscriptions have parallel bases (`BaseAppGraphqlSubscriber`, `BaseAppSubscriptionGraphqlPayload`, `BaseAppSubscriptionGraphqlCapsule`).

## Payload — the document + variables

Declare the GraphQL document via `static get document()` returning a template literal tagged `/* GraphQL */` (for editor highlighting). Declare a `<Name>RequestVariables` typedef at the bottom and type the class generic with it:

```js
import BaseAppGraphqlPayload from '~/app/graphql/client/BaseAppGraphqlPayload.js'

/**
 * @extends {BaseAppGraphqlPayload<SignInMutationRequestVariables>}
 */
export default class SignInMutationGraphqlPayload extends BaseAppGraphqlPayload {
  /** @override */
  static get document () {
    return /* GraphQL */ `
      mutation SignInMutation ($input: SignInInput!) {
        signIn (input: $input) {
          accessToken
          expiredAt
        }
      }
    `
  }
}

/**
 * @typedef {{
 *   input: schema.graphql.SignInInput
 * }} SignInMutationRequestVariables
 */
```

## Capsule — normalize the response

Expose response data through chained optional getters. A top-level `get <field>ValueHash()` reads `this.content?.<field> ?? null`; further getters drill in. Add a `<Name>ResponseContent` typedef at the bottom shaping `this.content`. Reference generated types via `schema.graphql.*`.

```js
import BaseAppGraphqlCapsule from '~/app/graphql/client/BaseAppGraphqlCapsule.js'

export default class SignInMutationGraphqlCapsule extends BaseAppGraphqlCapsule {
  /** @returns {schema.graphql.AuthResult | null} */
  get signInValueHash () {
    return this.content?.signIn
      ?? null
  }

  /** @returns {string | null} */
  get accessToken () {
    return this.signInValueHash?.accessToken
      ?? null
  }
}

/**
 * @typedef {{
 *   signIn: schema.graphql.AuthResult
 * }} SignInMutationResponseContent
 */
```

## Launcher — wire Payload + Capsule

Only static getters; no other logic:

```js
import BaseAppGraphqlLauncher from '~/app/graphql/client/BaseAppGraphqlLauncher.js'

import SignInMutationGraphqlPayload from './SignInMutationGraphqlPayload.js'
import SignInMutationGraphqlCapsule from './SignInMutationGraphqlCapsule.js'

export default class SignInMutationGraphqlLauncher extends BaseAppGraphqlLauncher {
  static get Payload () {
    return SignInMutationGraphqlPayload
  }

  static get Capsule () {
    return SignInMutationGraphqlCapsule
  }
}
```

## Naming & placement

- Folder: `app/graphql/client/{queries|mutations}/<graphqlFieldCamelCase>/`.
- Files/classes: `<FieldPascalCase>{Query|Mutation}Graphql{Launcher|Payload|Capsule}.js`, one `export default` class per file.
- Payload → `static get document()` + `<Name>RequestVariables`; Capsule → value-hash getters + `<Name>ResponseContent`; Launcher → `Payload`/`Capsule`.
