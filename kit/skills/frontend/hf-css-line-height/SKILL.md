---
name: hf-css-line-height
description: "The company's CSS line-height convention. The default value is --value-golden-ratio (the golden ratio, 1.618), held unitless. Override only when an individual case needs a different value."
---

# Frontend: CSS line-height

The **default value of `line-height` is `--value-golden-ratio` (the golden ratio, 1.618)**. Define it once in the base layer and let all text inherit it. Override only when an individual case needs a different value.

```css
:root {
  --value-golden-ratio: 1.618;
}

@layer base {
  :root {
    line-height: var(--value-golden-ratio);
  }
}
```

```css
/* Override only when an individual case needs a different value */
.heading {
  line-height: 1.2;
}
```

## Hold it unitless

- Hold `line-height` **unitless**. `--value-golden-ratio` is a unitless scalar (`--value-*`).
- Reason: a unitless `line-height` makes each element compute its line height as "its own `font-size` × 1.618". When a child's `font-size` changes, the line height scales correctly with it. Fixing it with `px` or `em` makes the value computed at the parent inherit as-is, failing to follow the child's `font-size` and breaking the layout.

## Set the default to the golden ratio

- Base the line height on the golden ratio (1.618). Fix the document-wide default line height at this single point, give it to `:root` in the `base` layer, and let it inherit (→ the cascade layers convention).
- `--value-golden-ratio` is a `--value-*` (unitless scalar) token (→ the custom property naming rule). The same token can be reused for ratios other than line-height.
