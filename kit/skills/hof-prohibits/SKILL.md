---
name: hof-prohibits
description: "Conventions for what is prohibited in Vue components. Prohibits writing JavaScript logic inside a .vue <template>; logic is moved onto members of the context."
---

# Frontend: Vue Component Prohibits

What is prohibited in Vue components (`.vue`).

## Prohibit JavaScript logic in `<template>`

- Do not write JavaScript **logic** inside a `.vue` `<template>`. Put logic on the members of the `<script>`'s `context` (the object returned by `setup`), and **expose it as a method / getter that returns the final value**. The `<template>` only calls it bare.
- "Logic" here means **anything that makes a decision or a computation, and is therefore a target of unit testing**.
  - Is logic (NG): operators (`!` / `&&` / `||` / comparison / arithmetic), the ternary operator, method chains that transform data such as `.filter().map()`, inline conditionals or arrow-function bodies.
  - Is not logic (OK): bare access to a `context` property / method, constructing an object / array literal, spreading, and passing `<template>` magic variables such as `$event` / `$attrs` as arguments. These carry no decision or computation and are not a test target.
- The criterion is "**the test target is a member of `context`**". A decision or computation can be unit-tested only once it lives on `context`. Written in the `<template>`, untestable logic gets buried in the view. So even a small negation like `!` moves to a `context` method that returns the final state.

```vue
<!-- NG: the <template> contains logic, the ! -->
<button :disabled="!context.canScrollPrevious()">
```

```vue
<!-- OK: call a context member named for the state in the positive -->
<button :disabled="context.isDisabledScrollPreviousButton()">
```

Do **not** use negative words in the name of an extracted predicate. Do not name it `cannot~` / `not~` / `no~`; name it for the state it represents, in the positive (for a value passed to `:disabled`, `isDisabledSubmitButton()`). A negative name produces double negatives such as `!context.isDisabledSubmitButton()`, which read poorly.

Constructing literals, spreading, and passing magic variables are not logic, so they may be written in the `<template>`.

```vue
<!-- OK: these carry no decision or computation, so they are not a test target -->
<TabsRoot
  v-bind="{
    ...context.extractRootAttributes(),
    ...$attrs,
  }"
  @update:model-value="context.onTabChange({
    value: $event,
  })"
>
```

That said, literal construction such as the `...$attrs` merge can be hidden further from the `<template>` by passing the magic variable to a `context` member and letting it assemble the object. This is not required, but it is **preferred**, since it keeps the `<template>` purely declarative. The method name will be a `build`-style one such as `buildXxxxx({ attrs: $attrs })`.

```vue
<!-- Preferred: hide the merge in context (a build-style method returns the finished object) -->
<TabsRoot
  v-bind="context.buildRootAttributes({
    attrs: $attrs,
  })"
  @update:model-value="context.onTabChange({
    value: $event,
  })"
>
```
