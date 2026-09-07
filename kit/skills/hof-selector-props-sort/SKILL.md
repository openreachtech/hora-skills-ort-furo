---
name: hof-selector-props-sort
description: "The company's convention for sorting the properties declared inside one CSS selector (Outer-to-Inner Order). Categorize by 'what the property applies to' and sort from outer to inner. Within a property group, sort alphabetically."
---

# Frontend: CSS Selector Property Sort

The properties declared inside one selector are **categorized by 'what the property applies to' and sorted from the outer toward the inner**. This convention is called **Outer-to-Inner Order**.

## Categories (8 blocks)

Order runs outer → inner along the target. The own element and the child elements each split into "layout (first)" and "design (later)", giving eight blocks in total.

1. Creating content
2. Display & positioning
3. Outer of the element (layout)
4. Own element (sizing)
5. Child elements (layout)
6. Own element (design)
7. Child elements (design)
8. Animation

## Detailed order

### (1) Creating Content

In pseudo-elements, place the content-generating properties first.

- content
- quotes

### (2) Display & Positioning

Properties that set the element's own position and its relation to the outside. **Here flex / grid are the "item side"** (how the element itself behaves within its parent's layout).

- clear
- float
- position
  - inset-block-start
  - inset-block-end
  - inset-inline-start
  - inset-inline-end
- z-index
- flex (item-side group: `flex` / `order` / `align-self` / `justify-self`)
- grid (item-side group: `grid-row` / `grid-column` / `grid-area`)

### (3) Layout to Outer

Properties acting on the element's outer side, ordered from the outside in.

- margin-block
- margin-inline
- outline
- border (border group)

### (4) Own Element (sizing)

Sizing of the own element. Order **block → inline**.

- block-size
  - min-block-size
  - max-block-size
- inline-size
  - min-inline-size
  - max-inline-size
- resize

### (5) Child Elements concerning Layout

Properties that control the layout of child elements. **Here flex / grid are the "layout side"** (arranging children as a container).

- display (flex & grid)
  - flex (container-side group: `flex-direction` / `flex-wrap` / `justify-content` / `align-items` / `align-content`)
  - grid (container-side group: `grid-template-*` / `grid-auto-*` / `justify-items` / `place-items`)
  - gap
  - row-gap
  - column-gap
- overflow
- overflow-block
- overflow-inline
- padding-block
- padding-inline
- vertical-align

### (6) Design of Own Element

Of the properties acting on the own element, those concerning decoration.

- backface-visibility
- background (background group)
- box-shadow
- filter
- perspective (perspective group)
- transform (transform group)
- opacity
- visibility

### (7) Child Elements concerning Design

Of the properties acting on child elements, those concerning decoration.

- color
- font (font group)
- text (text group)
- letter-spacing
- line-height
- white-space
- word-break
- word-spacing
- word-wrap
- writing-mode

### (8) Animations

Properties concerning animation.

- animation (animation group)
- transition (transition group)

## Within a property group, order alphabetically

When listing several longhand properties such as `border-*` or `font-*`, order them alphabetically.

```css
border
border-collapse
border-image
border-radius
border-spacing
```

```css
font-family
font-size
font-weight
```

## Sample

Separate the blocks with a blank line.

```css
.unit-sample {
  z-index: calc(var(--value-z-index-layer-staying) + 0);

  margin-block: 1rem;

  border: var(--size-thinnest);

  block-size: 10rem;
  inline-size: 100%;
  min-inline-size: 20rem;

  padding-block: 0.25rem;
  padding-inline: 0.5rem;

  background-color: var(--color-primary);

  color: var(--color-text-primary);
  font-family: 'Hiragino Sans';
  font-size: 1.5rem;
  font-weight: bold;
  line-height: var(--value-golden-ratio);

  transition: opacity 0.3s;
}
```
