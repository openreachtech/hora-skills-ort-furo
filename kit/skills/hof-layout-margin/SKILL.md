---
name: hof-layout-margin
description: "The company's CSS margin convention. Spacing in Flex / Grid is the container's responsibility; layout items carry no margin. Even spacing uses gap, and exceptional per-item spacing is owned from the parent via a child selector."
---

# Frontend: CSS Layout — Margin

For elements laid out with Flex / Grid, **spacing is the responsibility of the container (the layout owner), not of the item's own `margin`**.

## Do not put margin on a layout item

- Do not put `margin` on an item laid out with Flex / Grid (a direct child of the layout).
- Reason: putting `margin` on an item burns "how much outer spacing this item has" into the item itself. Place the same item in a different layout and the spacing tags along — the item becomes **coupled to the context it sits in**. Spacing should be decided by "which layout, and how it is placed", not be an intrinsic attribute of the item.

```css
/* NG: burning spacing into the item itself */
.item {
  margin-block-end: 1rem;
}
```

## Take even spacing with `gap`

- Make even spacing in Flex / Grid with the container's `gap`. Do not create spacing with an item's `margin`.
- Reason: `gap` is spacing the container owns, so no extra spacing appears on the edge items and no adjacent-margin collapsing occurs. The owner of the spacing is fixed in one place — the container.

```css
/* OK: the container owns spacing via gap */
.layout {
  display: flex;
  gap: 1rem;
}
```

## Apply exceptional per-item spacing from the parent via `.layout.xxx > .item`

- When per-item spacing that `gap` cannot express is needed, still do not write it on the item. Specify the child's style from the layout owner, using the child combinator `.layout.xxx > .item`.
- This makes the selector show that "this spacing is added for the sake of this layout". The item stays context-independent, and the owner of the spacing is always the layout side.

```css
/* OK: apply exceptional per-item spacing to the child from the parent's specific variant */
.layout.toolbar > .item {
  margin-inline-start: auto;
}
```

## Spacing between stacked `<section>`s is owned by the following one, via the owl selector

- When similar `<section>`s stack vertically in normal flow (block flow), `gap` is not available (`gap` belongs to Flex / Grid). Here too, do not write the spacing on the child itself: from the layout owner, use the owl selector `.layout.xxx > * + *` so that the following child owns it as `margin-block-start`. As with `.layout.xxx > .item` in the previous section, the owner of the spacing always stays on the layout side.
- The responsibility falls on the "following" child because `* + *` selects only children that have a preceding sibling. The first child has no preceding sibling, so it gets no margin. The spacing therefore arises **only between** one child and the next, with no stray spacing at the layout's start or end. The role `gap` plays in Flex / Grid is played in flow by this owl selector.

```css
/* OK: from the layout owner, the following child owns the spacing via margin-block-start (the owl selector) */
.layout.xxx > * + * {
  margin-block-start: 2rem;
}
```
