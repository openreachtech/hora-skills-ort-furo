---
name: hof-e2e-test-specification
description: "Author and maintain the end-to-end test specification — the durable list of scenarios stating what must be true of the product, flow by flow, derived from the API surface. Use when creating the specification for the first time, adding scenarios for a new capability, or reconciling it after a flow changed. It states what must be true, not how to click it: the harness, the test code, the environment and the pass/fail verdict all belong elsewhere."
---
# E2E Test Specification

A maintained document that says, scenario by scenario, **what must be true of the product when a user works
through it**. It exists so that testing the application end to end means running a known list rather than
remembering what to try, and so that a run can report *coverage* — which scenarios ran, which did not —
instead of an impression.

The boundary, in one line: **this specifies what must be true; it does not say how to click it.** The harness,
the selectors, the waiting and the test code belong to whatever automation the project uses. A specification
that mentions them can no longer be run by a person, and does not survive a redesign.

## Two principles

- **A scenario is a claim about the product, not a script for a robot.** It must be executable by someone
  with no access to the codebase, and must still be correct after the screen is rebuilt. Both properties are
  lost the moment a selector, a wait, or an internal state appears in it.
- **Coverage is derived, not remembered.** The inventory comes from what the product exposes — the API
  surface, the provocation catalogue, the role list — so a missing scenario appears as a **difference**
  rather than waiting for somebody to notice an absence. A specification assembled by thinking of test cases
  can only contain what someone already thought of.

## Where the specification lives

```
<project-root>/ai/specs/e2e/
├── index.md            the flows, their identifier prefixes, and how many scenarios each holds
├── <flow>.md           one file per flow
└── …
```

- **A third kind of document.** A review already reads facts that do not change per run, and writes dated
  reports that do. This is neither: it is **maintained** — amended when the product changes, and read by every
  later run. Keeping it beside them, under its own directory, stops it being treated as either.
- **One file per flow**, because a flow is the unit that changes, the unit a reader reviews, and the unit two
  people edit at once. A single file for a mature product becomes unreviewable and conflicts on every change.

## Scenario identity

Every scenario carries an identifier, `<FLOW>-<nn>`, and **the identifier is the join key** between this
document and every report that cites it.

- **Never reuse, never renumber.** A report that says `PUR-04` was not executed becomes a lie about a
  different scenario the moment the numbers shift.
- **Retire, do not delete.** A capability that is gone keeps its scenario, marked retired with the date and
  the reason. The number stays spent.

## Phase 1 — Gather the inputs

A specification cannot be written from the screens alone. Collect, and record what was missing:

- **The project declaration** — core flows with their success conditions, the roles, the credentials, and the
  operations deliberately absent from the UI.
- **The capability inventory** — operation, entity and verb for everything the product can do. Where the
  project has no such matrix, read the API surface directly; it is the same source.
- **The data the scenarios start from** — the seed set the environment loads, so a precondition can name rows
  that will actually be there.

> **Gate 1** — all three are present, or the missing one is named together with what it costs. A
> specification written without the role list cannot contain a permission scenario, and must say so rather
> than appear complete.

## Phase 2 — Derive the scenario inventory

**Produce the list of scenarios before writing any of them.** Three sources, each answering a question the
others cannot:

| Source | Produces | Question it answers |
| --- | --- | --- |
| the capability inventory | one scenario per reachable operation, grouped into flows | can a user do the things the product can do? |
| the provocation catalogue | a named scenario per failure worth surviving | does the product tell the truth when it cannot? |
| the role list | per role, that a restricted operation is neither offered nor accepted | is the boundary guarded on both sides? |

- **Failure scenarios are first-class**, written and numbered like any other. A specification of happy paths
  describes an application nobody has ever misused.
- **A flow is one scenario, not one assertion.** The unit has to match what a live pass runs through, or
  coverage cannot be reported against it.

> **Gate 2** — every operation in the inventory appears in at least one scenario, or carries an exclusion
> **with a reason**. A reason-less exclusion is an oversight that has been written down.

## Phase 3 — Write each scenario

Follow the schema in [scenario-schema.md](./references/scenario-schema.md); the rules that make a scenario
usable are in [writing-steps.md](./references/writing-steps.md). In summary:

- **Steps are what a user does**, in their words. Not what a test driver does.
- **Expectations are what a user can see.** "The row is gone from the list and the count reads 23", never
  "the record is soft-deleted in the database".
- **Preconditions name seeded data**, so the scenario is repeatable and does not begin with setup nobody has
  automated.
- **One success condition per scenario.** Two means it was two scenarios.

> **Gate 3** — no scenario contains a selector, an explicit wait, or an expectation the user cannot observe;
> every scenario has exactly one success condition and one owner flow.

## Phase 4 — Verify coverage

Run `scripts/check-scenario-coverage.mjs <project-root>`. It enumerates operations, reads the scenario files,
and reports operations no scenario mentions, exclusions that no longer match anything, and duplicate
identifiers. Same contract as the other checks in this family: **0 clean, 1 findings, 2 could not analyse
this project** — and 2 is not a pass.

> **Gate 4** — coverage is clean, or every gap is explained in the index.

## Phase 5 — Maintain

- **A changed flow amends its scenarios; a removed capability retires them.** Amending in place keeps the
  identifier meaningful across reports.
- **A scenario a live pass never executes is a defect in one of the two documents** — either it cannot be
  performed as written, or the pass skipped it. Resolve it while it is one; a specification accumulating
  unexecuted scenarios is exactly the false confidence it was meant to remove, now written down.
- **Results never go in here.** Which scenario passed on which day belongs to the dated report.

## What this skill does not decide

- **How the scenarios are executed.** Manually, or by whatever automation the project has. The specification
  is indifferent, and must stay that way to remain executable by both.
- **Whether a scenario passes.** That is the acceptance review's live pass, and its report is where the
  verdict lives.
- **How the environment is built, started or seeded.** A separate convention owns that; this document only
  names the data it expects to find.
- **Whether the product may ship.** A specification states requirements; it does not weigh them.

## Detail files

- [scenario-schema.md](./references/scenario-schema.md) — the fields of one scenario, with a worked example
- [deriving-scenarios.md](./references/deriving-scenarios.md) — the three sources, the coverage rule, and what
  "complete" means per entity
- [writing-steps.md](./references/writing-steps.md) — user-language steps, observable expectations, and the
  list of things that must never appear
- [failure-scenarios.md](./references/failure-scenarios.md) — the provocation catalogue turned into named,
  numbered scenarios
- [lifecycle.md](./references/lifecycle.md) — identifiers, amending versus retiring, and keeping the document
  honest over years
