# Failure Scenarios

Turning the failures a product must survive into numbered scenarios. Referenced from Phase 2 of
[SKILL.md](../SKILL.md), and the source of the `51`–`79` band.

## Why they get their own numbers

A failure written as a footnote under a happy path is never executed. A failure with an identifier is
executed, reported, and counted — and its absence from a run is visible. That is the whole difference, and it
is why "also check the error case" is not a specification.

It is also the band that decides whether this document is worth maintaining. Anyone can list the things a
product does. What separates a specification from a feature list is that it states **what the product owes a
user when it cannot do them**.

## What every failure scenario asserts

Four claims. The first two are the specification; the third is what makes the product usable; the fourth is
what most failure scenarios forget.

1. **Something appears.** Nothing at all is the worst outcome and the most common one. An assertion that
   omits this is satisfied by a screen that failed in silence.
2. **It says what happened, in the user's terms.** Not a code, not "an error occurred" — what did not happen,
   and to what.
3. **It says what to do next.** Retry, choose another file, ask an administrator, continue another way.
4. **The user's work is still there.** A refused submission that also cleared the form has turned a recoverable
   failure into lost work, and that is a worse defect than the failure being reported.

Where the failure is a wait rather than a refusal, the first claim becomes **the wait ends**: the screen
reaches a terminal state and stops promising a result that will never arrive.

## Naming a provocation without binding to the environment

Write **"while the application service is unreachable"**, not "run the command that stops the container".

The specification says what the world is like; how the world is made that way belongs to the harness and to
whatever convention owns the environment. A scenario naming a tool cannot be executed by a person, cannot
survive the stack changing underneath it, and quietly becomes a test of the infrastructure rather than of the
product.

## The catalogue

Each row is a scenario worth writing wherever the flow can encounter it.

| Provocation | Stated as | What the scenario asserts |
| --- | --- | --- |
| A dependency is unreachable | "while the *X* service is unreachable" | The failure is named on screen, the entered work survives, and the rest of the product remains usable |
| A dependency answers slowly | "while *X* is responding slowly" | Something says work is in progress; the screen is not frozen and the action cannot be fired twice |
| Input is invalid | "with a value that exceeds the limit / a required field left empty / the wrong kind of value" | The message is **beside the field**, the rest of the entry is kept, and nothing was saved |
| Input conflicts with existing data | "with a name that already belongs to another record" | The conflict is named, and the user is told which record it conflicts with |
| A concurrent change has occurred | "after another user has changed the same record" | The user is told their view is stale, and does not silently overwrite the other change |
| The actor lacks permission | "signed in as a role without that permission" | Not offered on screen **and** refused by the API — one scenario, both halves |
| The session has expired | "after the session has expired" | Told they are signed out, sent somewhere they can sign in, and returned to what they were doing — or told plainly that they cannot be |
| Accepted work fails later | "when the background work fails after being accepted" | The screen reports the failure and **stops waiting**; the user can retry or abandon |
| The action is repeated | "by submitting twice in quick succession" | One result, not two, and no crash on the second press |
| Work is abandoned mid-flow | "by leaving the screen with unsaved changes" | Warned before leaving, by in-app navigation **and** by closing the browser |
| An artifact cannot be rendered | "with a file the viewer cannot display" | Says the format is not displayable — never a broken image, which reads as "your file is damaged" |

Not every row applies to every flow. Pick the ones the flow can actually meet, and record the choice: a flow
that skipped "concurrent change" because only one role can edit is making a claim worth writing down.

## The four shapes an assertion must rule out

A failure scenario is written to catch one of these. Naming which keeps the assertion pointed at something.

- **Silence** — the operation failed and the screen said nothing. Ruled out by claim 1.
- **A wait that cannot end** — a spinner or a *processing* badge whose only exit is success. Ruled out by
  asserting the terminal state, which is why "stops waiting" must appear in the words.
- **The wrong state** — a failure rendered as empty. "There is nothing here" and "I could not find out what is
  here" are different sentences; the scenario asserts the second one, by name.
- **A misleading affordance** — an invitation the product cannot deliver on: a drop zone nothing listens to, a
  control offered to a role whose request will be refused. Ruled out by asserting absence, not just refusal.

## Restore the world

A failure scenario ends by stating that the provoked condition is undone — the service is reachable again,
the session is valid again. Two reasons: scenarios must be runnable in any order, and a run that leaves a
dependency stopped turns every later scenario into a failure with a misleading cause.

Where a provocation cannot be undone within the scenario, say so explicitly and place the scenario last in
its flow. An unstated dependency between scenarios is worse than an ugly one.

## A failure scenario is not a bug report

It states what the product **must** do, whether or not it does it today. If the product currently fails the
scenario, that is a finding for the review to report and for the declaration's known-and-accepted list to
carry — the scenario itself does not soften to match. A specification that is edited down to whatever the
product already does has stopped being able to find anything.
