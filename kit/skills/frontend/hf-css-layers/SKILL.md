---
name: hf-css-layers
description: "Convention for the company's CSS cascade layers (@layer): the layer order and the role of each layer."
---

# Frontend: CSS Layers

Company CSS is based on the following cascade layers (`@layer`), in this order. Later layers take precedence.

| Layer | Role |
| --- | --- |
| `reset` | Reset styles for native HTML elements |
| `base` | Base design system for native HTML elements |
| `furo` | Furo component library (defined by the internal module set) |
| `app` | Application components extended from Furo |

- The `furo` layer is defined by the internal module set.
- The `app` layer is where an application that has `npm install`ed the modules defines or overrides styles.
- Declare the layer order once at the top of the file (right after `@charset`) to fix it.

```css
@charset "UTF-8";

/**
 * Furo design for HTML tags
 *
 * all selectors are composed by the tag name followed by ".furo"
 */

@layer
  reset, /* Reset styles for native HTML elements */
  base,  /* Base design system for native HTML elements */
  furo,  /* Furo component library */
  app;   /* Application components extended from Furo */
```
