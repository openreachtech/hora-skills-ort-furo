# Make Popovers Origin-Aware

A popover, dropdown, select panel, or menu should scale in *from its trigger* — not from its own center. The default `transform-origin: center` is wrong for almost every anchored surface: it makes the panel appear to grow from the middle of empty space instead of unfolding out of the control the user just clicked.

Set `transform-origin` to the corner nearest the trigger (or bind it to the origin variable the popover positioner exposes, when using one).

### Bad

```css
.unit-menu > .popper > .content {
  transform-origin: center; /* grows from nowhere */
}
```

### Good

```css
/* Menu anchored below-left of its trigger: unfold from the top-left. */
.unit-menu > .popper > .content {
  transform-origin: top left;
  transform: scale(0.96);
  opacity: 0;
  transition:
    transform 0.16s var(--transition-timing-ease-out),
    opacity 0.16s var(--transition-timing-ease-out);
}

.unit-menu > .popper[open] > .content {
  transform: scale(1);
  opacity: 1;
}
```

When a positioner library computes the anchor edge for you, prefer its exposed custom property over a hard-coded corner so the origin stays correct when the panel flips:

```css
.unit-menu > .popper > .content {
  transform-origin: var(--popper-transform-origin, top left);
}
```

**Exception — modals.** A modal is not anchored to a trigger; it appears centered in the viewport, so keep `transform-origin: center` for modals and full-screen overlays.

Whether any single user notices the difference doesn't matter — together these unseen details are what make the UI
feel right.
