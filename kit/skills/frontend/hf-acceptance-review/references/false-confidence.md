# False Confidence

Signals that read as proof and are not. Every one of these has been quoted as evidence that a screen worked
while that screen was broken.

Read this before treating any existing signal as a pass — including one this skill's own scripts produced.

| Signal | What it actually proves | What to do instead |
| --- | --- | --- |
| The unit tests pass | The classes behave as called. **No template was rendered.** A template reading a member that does not exist, or dereferencing state that is null until a dialog opens, passes every one of them | Mount the screen in a browser and require the console to be silent |
| The route answers 200 | On a client-rendered app, that the shell was served. The application may throw during mount and render nothing behind that 200 | Same as above. Never cite a status code as evidence a screen works |
| The build succeeds | The code parses and bundles. Runtime type errors survive it intact | Same as above |
| Lint passes | The code matches the conventions. A control wired to nothing satisfies every rule | The dead-affordance and orphan-member checks |
| A fixture-backed test passes | The code agrees with the fixture. If the fixture was hand-written it may be a shape the API never sends, and the test then defends the bug | Record real responses in the live pass and compare shapes |
| A checker reports zero | Zero *within its reach*, which includes its exclusion list | Require exclusions to be justified, and fail on ones that no longer apply |
| The screenshot looks right | That state looked right. Nothing about the states you did not photograph | Walk the flow to completion; provoke the failures |
| The feature was implemented | Both halves exist. Not that they are joined, nor that a user can get to them | The capability matrix, with the path recorded |
| A previous review passed | The app as it was | Re-run; a scoped pass is not a full one |

## The rule this produces

**A check may only be cited for what it structurally observes.** Before running one, state what it can prove;
after running it, claim no more than that. Anything else goes under "couldn't verify", which is a normal and
expected section of a healthy report — not an admission of laziness.

## Fixture fidelity

The hardest of these to catch, because the test is green and the code is wrong.

During the live pass, record the API responses each flow produces. Then, for every hand-written fixture in
the test suite, ask whether a recorded response has that shape. A fixture with no counterpart is either
untested territory or a fiction the tests are defending.

Where an envelope is involved — a response wrapping its result in a field — check that the code unwraps at
the same depth the server wraps at. Reading one level too shallow yields `undefined` rather than an error,
which is why it survives both the tests and the type annotations.

## Scripts in this skill

They carry the same discipline, expressed as exit codes:

- `0` clean **within the reach stated in the script's own header**
- `1` findings
- `2` could not analyse this project — **not a pass**

Treating `2` as clean is the same mistake as citing a 200 for a blank screen. Record it under "couldn't
verify", then do the check by reading the code and label the finding Inferred.
