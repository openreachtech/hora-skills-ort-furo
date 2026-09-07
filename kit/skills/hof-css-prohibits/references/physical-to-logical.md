# Physical → logical property / value mapping

The complete mapping for the `prohibits` rule "Prohibit physical-direction properties and values" ([SKILL.md](../SKILL.md)). Do not use the left column (physical); use the right column (logical). Physical → logical is shown for LTR (in RTL the inline direction's left/right is reversed).

## A. Properties with a top / right / bottom / left set

### margin

| Physical | Logical |
| --- | --- |
| `margin-top` | `margin-block-start` |
| `margin-bottom` | `margin-block-end` |
| `margin-left` | `margin-inline-start` |
| `margin-right` | `margin-inline-end` |
| `margin` (top+bottom) | `margin-block` |
| `margin` (left+right) | `margin-inline` |

### padding

| Physical | Logical |
| --- | --- |
| `padding-top` | `padding-block-start` |
| `padding-bottom` | `padding-block-end` |
| `padding-left` | `padding-inline-start` |
| `padding-right` | `padding-inline-end` |
| `padding` (top+bottom) | `padding-block` |
| `padding` (left+right) | `padding-inline` |

### border (sides)

| Physical | Logical |
| --- | --- |
| `border-top` | `border-block-start` |
| `border-bottom` | `border-block-end` |
| `border-left` | `border-inline-start` |
| `border-right` | `border-inline-end` |

- `-width` / `-style` / `-color` follow the same shape (e.g. `border-left-width` → `border-inline-start-width`). Both edges: `border-block` / `border-inline` (and `border-block-width`, etc.).

### border-radius (corners)

| Physical | Logical |
| --- | --- |
| `border-top-left-radius` | `border-start-start-radius` |
| `border-top-right-radius` | `border-start-end-radius` |
| `border-bottom-right-radius` | `border-end-end-radius` |
| `border-bottom-left-radius` | `border-end-start-radius` |

### inset (positioning)

| Physical | Logical |
| --- | --- |
| `top` | `inset-block-start` |
| `bottom` | `inset-block-end` |
| `left` | `inset-inline-start` |
| `right` | `inset-inline-end` |
| (top+bottom) | `inset-block` |
| (left+right) | `inset-inline` |
| (all four) | `inset` |

### scroll-margin / scroll-padding

| Physical | Logical |
| --- | --- |
| `scroll-margin-top` | `scroll-margin-block-start` |
| `scroll-margin-bottom` | `scroll-margin-block-end` |
| `scroll-margin-left` | `scroll-margin-inline-start` |
| `scroll-margin-right` | `scroll-margin-inline-end` |

- Both edges: `scroll-margin-block` / `scroll-margin-inline`. `scroll-padding-*` follows exactly the same shape.

## B. Physical dimensions (horizontal / vertical axes)

| Physical | Logical |
| --- | --- |
| `width` | `inline-size` |
| `height` | `block-size` |
| `min-width` | `min-inline-size` |
| `min-height` | `min-block-size` |
| `max-width` | `max-inline-size` |
| `max-height` | `max-block-size` |
| `overflow-x` | `overflow-inline` |
| `overflow-y` | `overflow-block` |

## C. Physical-direction values

| Property | Physical value → logical value |
| --- | --- |
| `float` / `clear` | `left` → `inline-start`, `right` → `inline-end` |
| `text-align` | `left` → `start`, `right` → `end` |
| `caption-side` | `top` → `block-start`, `bottom` → `block-end`, `left` → `inline-start`, `right` → `inline-end` |

## Exceptions / notes

- **`outline-*` is out of scope.** outline has no per-side declarations (it is uniform) and no logical variant. There is nothing to prohibit.
- **`border-image-outset` is an unavoidable exception.** It takes four values (top / right / bottom / left) but has no logical equivalent, so it alone is allowed to stay in physical form.
