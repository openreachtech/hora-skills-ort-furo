# The Purpose of an Animation

Every animation must have a clear answer to "why does this animate?" If the only answer is "it looks cool" and the user will see it often, don't animate.

## Valid purposes

- **Spatial consistency** — an element enters and exits from the same direction, so a swipe-to-dismiss or slide-away reads as one continuous space.
- **State indication** — a control morphs to show its state changed (loading → done, collapsed → expanded).
- **Feedback** — a button scales down on press, confirming the interface heard the tap.
- **Preventing jarring changes** — content appearing or disappearing without a transition feels broken; a short fade smooths it.
- **Explanation** — a marketing or onboarding animation that demonstrates how a feature works.

## Match motion to frequency

The more often a user sees an animation, the less it should draw attention. An action repeated dozens of times a day feels *slower* when animated, because the delay compounds.

| How often the user sees it | Decision |
| --- | --- |
| Keyboard-initiated / many times a day (menu toggles, shortcuts) | No animation |
| Frequent (hover, list navigation) | Remove or drastically reduce |
| Occasional (modals, drawers, toasts) | Standard animation |
| Rare / first-run (onboarding, celebrations) | Can add delight |

Never animate keyboard-initiated actions — the motion detaches the result from the keystroke that caused it.
