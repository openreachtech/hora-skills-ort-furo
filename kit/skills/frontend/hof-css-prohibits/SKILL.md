---
name: hof-css-prohibits
description: "Conventions collecting CSS notations that are prohibited (anti-patterns)."
---

# Frontend: CSS Prohibits

Collects CSS notations that are prohibited.

## Prohibit physical-direction properties and values

- Physical direction (top / right / bottom / left, physical axes like `width` / `height`, and physical values like `float: left`) is **prohibited without exception**. Use only the **logical properties and values** that follow the writing direction.
- Three families are covered. **See [references/physical-to-logical.md](./references/physical-to-logical.md) for the complete mapping.**
  - Properties with a top/right/bottom/left set: `margin` / `padding` / `border-*` / `border-*-radius` / `inset` (`top`/`right`/`bottom`/`left`) / `scroll-margin-*` / `scroll-padding-*`
  - Physical dimensions: `width` / `height` / `min-*` / `max-*` / `overflow-x` / `overflow-y`
  - Physical values: `left`/`right`/`top`/`bottom` on `float` / `clear` / `text-align` / `caption-side`
- To set a single side, use `*-inline-start` / `*-inline-end` / `*-block-start` / `*-block-end` (start / end are the only way to set one side, so they are allowed).
- The one exception: `border-image-outset` takes four values but has no logical equivalent and cannot be replaced, so it alone may stay in physical form.
- Reason: in right-to-left (RTL) languages, left / right do not work and physical-direction values break the layout. Logical forms follow the writing direction automatically.

```css
/* NG: physical direction */
.box {
  padding: 0.5rem 0.75rem;
  margin-left: 1rem;
  border-bottom: var(--hairline-width) solid #ccc;
  width: 20rem;
  top: 0;
  left: 0;
  float: left;
  text-align: left;
}

/* OK: logical properties and values */
.box {
  padding-block: 0.5rem;
  padding-inline: 0.75rem;
  margin-inline-start: 1rem;
  border-block-end: var(--hairline-width) solid #ccc;
  inline-size: 20rem;
  inset-block-start: 0;
  inset-inline-start: 0;
  float: inline-start;
  text-align: start;
}
```

## Prohibit CSS nesting

- CSS nesting is **prohibited**. Do not nest selectors (neither a selector inside a rule nor an `&` combination); **keep selectors flat**.
- The one exception: a media-query override for the same selector may be written as `@media { }` inside that selector (see the breakpoint example in the rem-based unit convention).
- There are several reasons.
  - Diffs are unreadable in GitHub pull requests; nesting obscures the diff.
  - When nesting is deep, you must scroll every time to confirm that an addition sits at the correct level.
  - The editor assistance that would supply the nesting context does not work on GitHub.

```css
/* NG: nested selectors */
.card {
  color: #cc3300;

  .card-title {
    font-weight: bold;
  }

  &:hover {
    opacity: 0.8;
  }
}

/* OK: keep selectors flat */
.card {
  color: #cc3300;
}

.card-title {
  font-weight: bold;
}

.card:hover {
  opacity: 0.8;
}
```

```css
/* OK (the one exception): only a media-query override for the same selector goes inside */
.card {
  padding-inline: 0.75rem;

  @media (min-width: 48rem) {
    padding-inline: 1rem;
  }
}
```

## Prohibit one-line declaration blocks

- Writing a selector's `{ }` (declaration block) on one line is **prohibited**. Put the opening `{` on the same line as the selector, one declaration per line, and the closing `}` on its own line — always chopped down.
- No exceptions, even for a single declaration; this keeps things consistent.

```css
/* NG: { } written on one line */
.card { color: #cc3300; }

/* OK: always chopped down */
.card {
  color: #cc3300;
}
```

## Prohibit `!important`

- `!important` on a declaration is **prohibited without exception, whatever the reason**. When you need to override, do not raise specificity or reach for `!important` — resolve it through the order of cascade layers (→ the cascade layers convention).
- Reasons:
  - `!important` hoists a declaration outside the specificity system and breaks control of the cascade itself. With multiple contributors, you inevitably fall into a chain of "an `!important` that overrides an `!important`" — an importance war.
  - Its effect is non-local. One person's `!important` silently nullifies legitimate styles elsewhere, and the cause becomes hard to trace.
  - This repo designs override order with **cascade layers** (`reset` → `base` → `furo` → `app`, later layers win). Which rule wins is decided by layer order, so there is no need in principle to strike individually with `!important`. Using `!important` is nothing but jumping the queue and ignoring that designed order.

```css
/* NG: striking with !important */
.button {
  color: #fff !important;
}

/* OK: let layer order decide (app beats furo — no !important) */
@layer furo {
  .button {
    color: #333;
  }
}

@layer app {
  .button {
    color: #fff;
  }
}
```

## Prohibit bare tag selectors outside the `reset` / `base` layers

- Bare (unqualified) tag selectors (`a {}` / `h1 {}` / `ul {}` and the like) may be used only in the two layers `@layer reset` and `@layer base`. These two layers define the look of the native HTML elements themselves (`reset` = reset, `base` = base design system) (→ the cascade layers convention).
- Bare tag selectors are **prohibited** in the `furo` / `app` layers. When you refer to a tag, always qualify it with a class (the `tagname.furo` form, per the Furo convention).
- Reason: a bare tag selector has an extremely wide reach — it hits every element of that kind across the whole document. That reach is correctly needed in `reset` / `base`, which set "the default look of the raw element", but in `furo` / `app`, which define components, it becomes a source of styles leaking onto unrelated elements. Confine the wide reach to the two layers whose purpose it is.

```css
/* OK: reset / base target the native elements themselves */
@layer base {
  a {
    color: var(--color-primary);
  }
}
```

```css
/* NG: a bare tag selector in furo / app */
@layer furo {
  a {
    color: var(--color-primary);
  }
}

/* OK: in furo / app, qualify with a class (tagname.furo) */
@layer furo {
  a.furo {
    color: var(--color-primary);
  }
}
```
