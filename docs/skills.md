# Skills

A catalog of every skill in this package — 46 in total — with a one- or two-line summary each.

Each skill lives at `kit/skills/frontend/<name>/`, one level under the domain directory, and that folder name is both the skill's `name:` and the folder name it is installed under. **Skill** below is therefore all you need: it is what you invoke as `/name`, what appears under `.claude/skills/` once installed, and where the source sits. The two-character prefix is the domain — see [the flatten build convention](https://github.com/openreachtech/hora-skills-furo/blob/main/.claude/skills/flatten/SKILL.md) for the layout and the naming rules. Full guidance for any skill is in its own `SKILL.md`.

| Skill (= Command) | Summary |
| :-- | :-- |
| `hf-acceptance-review` | Post-implementation acceptance review of a whole app — is every backend operation reachable from the UI, is CRUD complete per entity, do affordances act, are failures and waits told truthfully. |
| `hf-animation` | UI animation conventions — whether and why an element animates, easing from the `--transition-timing-*` tokens, and the entry/popover/tooltip/blur techniques that keep motion responsive. |
| `hf-cookie-authentication` | Cookie-based authentication for a Furo/Nuxt app — the in-memory session layer (token store, renew, 401/205 self-heal, route gateway, sign-out), the auth GraphQL clients, and serving same-origin so the refresh cookie stays first-party. |
| `hf-cp-button` | A clickable action trigger — submit, primary, icon or loading button. Routes to `FuroButton`. |
| `hf-cp-checkbox-toggle` | A boolean control — checkbox, on/off switch, toolbar toggle button. Routes to `FuroCheckbox`, `FuroToggle`. |
| `hf-cp-collapsible` | A show/hide region, or a stack of expandable sections such as an accordion or FAQ list. Routes to `FuroCollapsible`, `FuroAccordion`. |
| `hf-cp-control-block` | Wraps a form field with a label, hint, required marker or validation error message. Routes to `FuroControlBlock`. |
| `hf-cp-date-time` | A date and/or time selection control. Routes to `FuroDatePicker`, `FuroTimeField`, `FuroDateTimePicker`. |
| `hf-cp-dialog` | A modal, a confirm/destructive-action prompt, or a side panel. Routes to `FuroDialog`, `FuroAlertDialog`, `FuroDrawer`. |
| `hf-cp-dropdown-menu` | A menu of actions triggered from a button or icon — kebab, context or three-dot menu. Routes to `FuroDropdownMenu`. |
| `hf-cp-editable-field` | An inline click-to-edit value display. Routes to `FuroEditableField`. |
| `hf-cp-editor` | A rich-text editing area — WYSIWYG field, comment editor, chat composer with mentions. Routes to `FuroEditor`. |
| `hf-cp-empty-state` | A placeholder for a region with no records, or one that failed to load and can be retried. Routes to `FuroEmptyState`, `FuroErrorState`. |
| `hf-cp-popover` | A floating panel anchored to a trigger, or a hover/focus hint. Routes to `FuroPopover`, `FuroTooltip`. |
| `hf-cp-select` | Picking one or more values from a list — searchable dropdown, typeahead, multi-select. Routes to `FuroSelect`, `FuroAutocompleteField`. |
| `hf-cp-splitter` | Resizable side-by-side panes, a styled scrollable container, or a divider line. Routes to `FuroSplitter`, `FuroScrollArea`, `FuroSeparator`. |
| `hf-cp-stepper` | A multi-step flow indicator — wizard progress, multi-step form, checkout steps. Routes to `FuroStepper`. |
| `hf-cp-table` | Tabular data with row selection and sorting, plus its page-navigation companion. Routes to `FuroTable`, `FuroPagination`. |
| `hf-cp-tabs` | Tabbed regions and segmented-control navigation. Routes to `FuroTabs`. |
| `hf-cp-text-field` | A single-line text input — email, password, number or file upload field. Routes to `FuroTextField`, `FuroEmailField`, `FuroPasswordField`, `FuroNumberField`, `FuroFileField`. |
| `hf-cp-textarea` | A multi-line text input — comment box, description field. Routes to `FuroTextarea`. |
| `hf-cp-toast` | A transient notification — success/error snackbar shown after an action. Routes to `FuroToast`, `FuroToaster`. |
| `hf-cp-toggle-group` | A segmented toggle control, or a keyboard-navigable container grouping buttons, toggles and separators. Routes to `FuroToggleGroup`, `FuroToolBar`. |
| `hf-css` | CSS architecture and styling for a Furo/Nuxt app — unit-selector naming, design tokens, and global stylesheet layering. |
| `hf-css-coding-styles` | CSS coding style: formatting and notation. |
| `hf-css-layers` | The cascade layer (`@layer`) order and the role of each layer. |
| `hf-css-line-height` | Defaults to `--value-golden-ratio` (1.618), held unitless. Override only when an individual case needs a different value. |
| `hf-css-prohibits` | CSS notations that are prohibited (anti-patterns). |
| `hf-css-props-naming` | Custom property naming — the top-prefix rule denoting a value's kind, and the two-layer palette / color rule. |
| `hf-css-props-prohibits` | Prohibitions for custom properties — relative sizes limited to the five steps huge / large / medium / small / tiny, and no `x-` style labels. |
| `hf-css-units` | Entry point for CSS unit conventions — the base unit and value granularity, organized by topic. |
| `hf-css-z-index` | The three layer base values and the `calc()` notation. |
| `hf-e2e-test-specification` | Author and maintain the E2E test specification: the durable, flow-by-flow list of what must be true of the product, derived from the API surface. States what, never how to click it. |
| `hf-error-handling` | Map backend dotted error codes to user-facing messages via `app/constants-error.js` and i18n locale paths, and surface them with `errorMessageHashReactive` and `error.vue`. |
| `hf-furo-context-patterns` | How to use Furo Context classes — `BaseAppContext` generics, the `create()`/`setupComponent()` lifecycle, DI from setup, watchers, and the `*PageContext`/`*Context` taxonomy. |
| `hf-furo-env` | Configure Furo environment variables (`.furo-env` files) — adding or changing a variable, and wiring an endpoint or key. |
| `hf-graphql` | GraphQL in a Furo app — the generated schema types in `types/graphql-schema.d.ts` and the operation clients under `app/graphql/client`. |
| `hf-layout-margin` | Spacing in Flex/Grid is the container's responsibility; layout items carry no margin. Even spacing uses `gap`, exceptions are owned from the parent. |
| `hf-modules` | Reusable general logic lives in utility classes, not utility functions or composables — Furo follows an OOP structure. |
| `hf-nuxt` | Build a Nuxt/Furo frontend the OpenReach way — pages, components, composables, `useState` stores, the AppShare service (`$furo`), middleware, plugins, layouts and ambient types. |
| `hf-prohibits` | No JavaScript logic inside a `.vue` `<template>`; logic is moved onto members of the Context. |
| `hf-restful` | REST clients under `app/restfulapi/renchan/` — the Launcher/Payload/Capsule trio mirroring the GraphQL pattern, `BASE_URL`, the `/v1` prefix and access-token headers. |
| `hf-selector-props-sort` | Property ordering (Outer-to-Inner Order) — categorize by what the property applies to and order outer to inner, alphabetically within a group. |
| `hf-uiux-audit` | Audits existing frontend output — code, screenshots, mockups, live URLs or Figma — into a severity-ranked report of UX/UI, interaction, accessibility and legal/consent issues. Builds nothing. |
| `hf-uiux-context` | Creates and fills the shared `uiux-context.md` project context file that both `hf-uiux-forge` and `hf-uiux-audit` read — app type, users, scope, stack, tokens, accessibility target, brand. |
| `hf-uiux-forge` | Generates production-quality frontend UI (React/Tailwind by default) that is correct by construction — WCAG AA, design tokens, interaction states, responsive layout, consent rules. |

