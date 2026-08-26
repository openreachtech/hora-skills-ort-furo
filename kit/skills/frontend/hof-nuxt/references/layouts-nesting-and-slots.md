# Layout nesting & slots

## Layout nesting via `<NuxtLayout name>`

`settings.vue` renders **inside** the default layout so it inherits sidebar + header chrome, then adds its own settings sub-nav around `<slot />`:

```vue
<template>
  <NuxtLayout name="default">
    <div class="unit-layout settings">
      <div class="sidebar">
        <ul class="unit-nav-list">
          <li
            v-for="(link, index) of context.settingNavigationLinks"
            :key="index"
            class="entry"
          >
            <NuxtLink
              :to="link.url"
              active-class="active"
              :class="{ unverified: link.isUnverified }"
            >
              <Icon :name="link.iconName" size="1.5rem" />
              <span class="label">{{ link.label }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div class="content">
        <slot />
      </div>
    </div>
  </NuxtLayout>
</template>
```

`SettingsLayoutContext` builds the nav array from the customer store, deriving per-link `isUnverified` flags from `customerStore.customerStateRef.value .customerRegistrationStatus`.

## Use `<slot/>` instead of `<NuxtPage/>`

Generally, `<slot/>` and `<NuxtPage/>` have the same effect, since by default a page is rendered in the slot of
`<NuxtLayout/>`. However, prefer `<slot/>` over `<NuxtPage/>` because it allows nested layouts.

```vue
<template>
  <NuxtLayout>
    <slot />
  </NuxtLayout>
</template>
```
