# Failure Honesty

Whether the screen tells the truth when something goes wrong, takes too long, or has nothing to show.

This is the part of a review that cannot be done by reading alone. **Break things on purpose and watch.** A
failure branch nobody has ever executed is a branch nobody has ever seen render.

## The four ways a screen lies

### Silence

An operation fails and the screen says nothing. The user presses again, or walks away believing it worked.

Provoke it by stopping the dependency mid-flow, and by returning a failure the code did not anticipate.

Where it hides:

- A handler that returns early on a null answer without setting a message. A dropped connection and a
  user-pressed cancel arrive the same way, and treating both as "nothing to report" swallows the failure.
- A message written to state that is only rendered inside a container which is closed during that flow. The
  message exists, is correct, and is never on screen.
- A response read at the wrong depth. An envelope not unwrapped yields `undefined` for the id, a guard skips
  the next step, and the operation half-completes with nothing to show for it.

### An unending wait

A spinner or a "being prepared" badge with no terminal state. The work failed ten minutes ago and the screen
is still promising a result.

Ask of every wait: **what ends it?** If the answer is "the thing it is waiting for succeeds", the failure
case has no exit. Where a status is available, read the status; where a request answers the same code for
"queued" and "failed", the screen must get that distinction from somewhere else.

### The wrong state

A failure rendered as empty. "There is nothing here" and "I could not find out what is here" are different
sentences, and only one of them tells the user to do something.

Check every place a screen picks between loading, empty, error and ready — especially where the data arrives
by more than one route, such as a first load with hooks and a poll without them.

### A misleading affordance

The screen invites a gesture it cannot accept, or shows something it cannot render.

- A drop zone on a screen that listens for no drop.
- A control offered to a role whose requests will be refused.
- A file handed to a viewer that cannot display that format — a document in an image element paints a broken
  icon and reads as "this file is damaged" about a file that is fine.

## How to provoke each

| Provocation | How | Watch for |
| --- | --- | --- |
| Network failure | Stop the API, or block the request | A visible message; no silent early return |
| Dependency down | Stop the database, queue, or storage the flow needs | The failure named, and other flows still usable |
| Invalid input | Exceed a limit, empty a required field, submit the wrong type | The message beside the field, and the input kept |
| Wrong role | Sign in as a role without the permission | Refusal with a reason, not a bounce |
| Slow work | Submit work that takes real time | Progress, a way to cancel, and a terminal state |
| Failed async work | Make the background job fail | The screen says failed, and stops waiting |
| Repeated action | Press submit twice; press undo twice | No duplicate, no crash on the second |

## Judging what you see

For each provocation, three questions:

1. **Does anything appear?** Nothing is the worst outcome and the most common.
2. **Does it say what happened, in the user's terms?** Not the code; not "an error occurred".
3. **Does it say what to do?** Retry, choose another file, ask an administrator, or continue another way.

A message that fails the third question is still a pass at severity below one that fails the first two. Rank
them, and say which.
