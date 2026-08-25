# Tooltips: Skip the Delay on Subsequent Hovers

A tooltip should wait a beat before appearing so brushing past a control doesn't flash a tooltip. But once one tooltip is already open, moving to an adjacent control should open its tooltip **instantly, with no delay and no animation**. This makes a toolbar or icon row feel fast without defeating the point of the initial delay.

The pattern: the first tooltip pays the delay + fade; while any tooltip is open, the group is in an "instant" mode, so neighbors appear immediately and only revert to the delayed behavior after the pointer has rested away from all of them.

### CSS

Gate the transition on an `instant` flag set by the tooltip controller:

```css
.unit-tooltip > .bubble {
  transform: scale(0.97);
  opacity: 0;
  transform-origin: var(--popper-transform-origin, bottom center);
  transition:
    transform 0.125s var(--transition-timing-ease-out),
    opacity 0.125s var(--transition-timing-ease-out);
}

.unit-tooltip > .bubble.is-shown {
  transform: scale(1);
  opacity: 1;
}

/* Subsequent tooltip in the group: no delay, no animation. */
.unit-tooltip.is-instant > .bubble {
  transition-duration: 0s;
}
```

The initial delay is timing, not a transition, so it belongs in the controller (a `*Clerk`/`*Detector` utility module or the component context), which opens after a short timer on first hover and drops into instant mode while the group stays active.
