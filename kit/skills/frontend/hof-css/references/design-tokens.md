# Design Tokens (CSS Custom Properties)

All colors, sizes, typography, transitions, and gradients are defined as CSS variables in `assets/css/variables.css` (app tokens) and `assets/css/variables-component-default.css` (component defaults). Furo ships a color-scale palette (`variables-palette-color-scale.css`) and z-index scale (`variables-z-index.css`).

**Never hard-code a color, font size, or z-index in a component.** Reference a token.

### Good

```css
.unit-card {
  background-color: var(--color-background-panel);
  border: var(--size-thinnest) solid var(--color-border);
  color: var(--color-text);
}

.unit-card > .title {
  font-size: var(--font-size-large);
  line-height: var(--size-line-height-large);
  color: var(--color-text-title);
}
```

### Bad

```css
.unit-card {
  background-color: #fff;   /* use var(--color-background-panel) */
  border: 1px solid #e5e5e5;
  font-size: 22px;          /* use a --font-size-* token */
}
```

## Token families (see `assets/css/variables.css`)

- **Palette**: raw hues — `--palette-brand-blue-500`, `--palette-gray-100`, … Do not reference palette tokens directly in components; use the semantic tokens below, which alias the palette.
- **Semantic color roles**: `--color-primary`, `--color-background`, `--color-background-panel`, `--color-surface-*` (`success`/`error`/`ongoing`/ `warning`, each with `-subtle`/`-lighter`/`-darker`), `--color-border-*`, `--color-text-*` (`title`/`subtitle`/`caption`/`light`/`disabled`/`input`…).
- **Sizes**: `--size-thinnest` (1px), `--size-radius-rounded`, `--size-header-height`, `--size-nav-width`, `--size-screen-height`, …
- **Typography**: `--font-family-body`, `--font-size-*` (`title-large` → `tiny`) paired with matching `--size-line-height-*`.
- **Gradients**: `--gradient-membership-silver|gold|platinum|diamond`.
- **Transitions**: `--transition-timing-ease-in|out|in-out`.

When a component needs a new shared value, add a token to `assets/css/variables.css` rather than inlining it.
