# Tiers & File Layout

## Tier Taxonomy

`components/` is organized into tiers. Place a new component in the tier that matches its role:

| Folder | Role |
| --- | --- |
| `components/units/` | **Design-system primitives.** Generic, domain-agnostic UI kit, all prefixed `App` — `AppButton`, `AppInput`, `AppSelect`, `AppDialog`, `AppTable`, `AppAccordion`, `AppCarousel`, `AppPagination`, `AppDatePicker`, `AppSkeleton`, `AppTabLayout`, `AppLoadingLayout`. |
| `components/atoms/` | Small **app-specific** presentational pieces that are NOT part of the generic App kit — `CopyButton`, `CreditCard`, `MarkdownRenderer`. |
| `components/molecules/` | Composed, domain-aware widgets built from units/atoms — `OrderHistoryEntry`, `MultiSelect`, `CreditCardNumberInput`, `CartProductPreview`, `BinaryTreeGraph`. |
| `components/organisms/` | Large composed sections and dialogs — `CreditCardSelectDialog`, `ShippingAddressSelectionDialog`, `SubscriptionProductsSection`. Typically declare `emits`. |
| `components/composites/` | Standalone flow dialogs — `EmailEditDialog`, `VerifyEmailDialog`. Files are **flat** here (no per-component subfolder). |
| `components/pages/` | Feature/route-specific sub-components. The folder tree **mirrors the route tree** (`pages/wallet/`, `pages/settings/general/`, `pages/products/[id]/`). Imported by the matching route in `/pages/`. |
| `components/layouts/` | App chrome — `AppHeader`, `AppSidebar`, `AppSidebarOverlay`. |
| `components/toast/` | Toast system — `AppToast`, `AppToastContainer`. |

There is **no `templates/` tier** — do not create one.

**`components/pages/*` vs `/pages/*`:** `components/pages/wallet/WalletHistory.vue` is a feature sub-component; `/pages/wallet/index.vue` is the actual Nuxt route that imports it (see [pages](./pages-route-structure.md)).

## File Layout

Each component is `Xxx.vue` + `XxxContext.js`, both PascalCase, in the same directory.

- **Own folder** (default, all tiers except simple units/composites):
  ```
  components/atoms/CopyButton/
  ├── CopyButton.vue
  └── CopyButtonContext.js
  ```
- **Flat siblings** — simple `units/` primitives and all of `composites/`:
  ```
  components/units/AppButton.vue
  components/units/AppButtonContext.js
  ```
- **Complex units get a folder**: `components/units/AppTable/AppTable.vue`, `components/units/AppAccordion/`.
- Helper sub-contexts may sit alongside (e.g. `AppOffCanvasMenu/LinkItemContext.js`, `units/DatePickerDayItemContext.js`).

No separate `.css` files per component — styling is always `<style scoped>` inside the `.vue`.
