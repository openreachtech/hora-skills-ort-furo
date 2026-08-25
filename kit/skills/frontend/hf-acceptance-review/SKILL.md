---
name: hf-acceptance-review
description: "Post-implementation acceptance review of a whole application: whether every operation the backend exposes is reachable from the UI, whether CRUD per entity is complete, whether affordances actually do something, whether failures and waits are told truthfully, and whether baseline usability is present. Use after implementing a feature and before calling it done, or as a full sweep before a milestone. Requires a working local E2E environment, which a separate convention builds."
---
# Acceptance Review

Verify that an application does what it claims, that a user can reach it, and that it tells the truth when
something goes wrong. This runs **after** implementation, on a working tree that already passes its own lint
and unit tests — those are a different convention's job, and passing them is not evidence that a screen
works.

## Before starting: the environment is a prerequisite

**A working local end-to-end environment must already exist.** Phase 4 drives the real application against
the real services behind it — it signs in as each role, completes flows to their success condition, and stops
dependencies on purpose to watch what the screen says. None of that is possible against a frontend served on
its own with nothing behind it. Before Phase 0, confirm that:

- the application runs locally **together with every service it talks to**, not just the UI;
- the accounts for each role can sign in;
- there is reviewable data present, or a command that puts it there.

**Building that environment is outside this skill.** How the stack is defined, started, loaded and disposed
of is a separate convention's business. This review only records whether the result was available, and reads
the commands for using it from the project declaration (`references/project-declaration.md`).

If the environment cannot be brought up, **the review does not quietly continue as a static-only pass**: say
so in the capability note, record Phase 4 as not run, mark Gate 4 accordingly, and leave every finding that
depended on running the app under "couldn't verify". A static sweep is a legitimate deliverable — a static
sweep presented as an acceptance review is not.

Two principles govern the whole review.

- **Decide what each check can prove before running it.** A check whose reach was never established gets
  quoted as evidence for something it never touched. Every finding carries a verification label, and
  anything unproven goes in "couldn't verify" rather than passing quietly.
- **Green is not evidence.** Unit tests that call a class directly never render a template. A route that
  answers 200 on a client-rendered app returns a shell whatever happens next. A build succeeds with runtime
  type errors intact. Read `references/false-confidence.md` before treating any existing signal as proof.

## Modes

| Mode | When | Inventory |
| --- | --- | --- |
| Scoped (default) | Straight after implementing a feature | The screens and operations the diff touches, plus the paths that reach them |
| Full | Before a milestone, or on request | Every screen, entity and operation |

A full sweep of a mature app is expensive. Default to scoped and say in the report which mode ran, so a
scoped pass is never read as a clean bill of health for the whole app.

## Phase 0 — Establish what this review can prove

Determine, and record:

- The UI framework, the API style (schema-first, spec-first, or route files), the test runner, and whether a
  browser can be driven here.
- Whether the local environment described above is **actually up** — which decides whether Phase 4 happens.
  Check it, do not assume it: a review that mistakes a stopped dependency for a broken screen wastes its
  findings.
- Which of the mechanical checks apply to this stack.

Output an *audit capability* note. It opens the report and bounds every claim in it.

> **Gate 0** — the capability note exists. Without it there is no way to tell a check that passed from a
> check that never ran.

## Phase 1 — Read or create the project declaration

The review needs facts only the project has: what the core flows are, which roles exist, credentials to sign
in with, how to start the app, and which exposed operations are deliberately absent from the UI.

Read `<project-root>/ai/contexts/acceptance-context.md`. If it is missing, **create it before continuing**,
using the schema in `references/project-declaration.md`, filling everything discoverable from the codebase
and marking the rest `TBD`. Never infer a core flow and then audit against the guess.

> **Gate 1** — a run command and per-role credentials are present, or Phase 4 is recorded as not run. A
> review that silently skips the live pass is the failure mode this whole skill exists to prevent.

## Phase 2 — Inventory the application's capability

Build the capability matrix described in `references/capability-matrix.md`.

Take the operation list from **the API surface**, not from the UI and not from memory: what the backend
exposes is the contract of what the product can do, and it is machine-readable. A gap then appears as a
difference — an operation with no path to it — instead of relying on someone noticing an absence.

> **Gate 2** — every operation is classified as reachable, unreachable, or deliberately excluded with a
> reason. An exclusion without a reason is indistinguishable from an oversight.

## Phase 3 — Static sweep

Cheap, mechanical, and high yield. Run what applies; for anything that cannot run here, do the check by
reading the code and label the finding Inferred.

| Check | What it catches | Script |
| --- | --- | --- |
| Unreached operations | A capability built on both sides that no screen imports — and a stale exclusion | `find-unused-operations.mjs` |
| Unreachable screens | A screen nothing navigates to, reachable only by typing its address | `find-unreachable-screens.mjs` |
| Orphan template members | A template reading a member its context does not define | `find-orphan-template-members.mjs` |
| Unguarded slots | A container rendering slot content while closed, breaking its callers on mount | `find-unguarded-slots.mjs` |
| Emit mismatches | An event declared and never emitted, emitted without declaring, or missing from the component's registration | `find-emit-mismatches.mjs` |
| Missing screen states | A list that cannot say "there is nothing", or a fetch that cannot say "I could not find out" | `find-missing-screen-states.mjs` |
| Leaked vocabulary | An internal key printed as text, or a branching name rendered where a display name exists | `find-leaked-vocabulary.mjs` |
| Markup sinks | A string handed to the browser as markup | `find-unsafe-html.mjs` |

Two more checks belong to this phase and have no script:

- **Dead affordances** — a control that renders, is pressed, and does nothing. Where a project already has an
  equivalent check wired into its own scripts, run that rather than duplicating it.
- **Fixture fidelity** — tests passing against a response shape the API never sends. This one cannot be done
  statically: it needs the recordings Phase 4 produces. See `references/false-confidence.md`.

Every script takes the project root as its only argument and uses the same contract: **0 clean, 1 findings,
2 could not analyse this project**. Exit code 2 is not a pass — record it under "couldn't verify", then do the
check by reading the code and label the finding Inferred.

Each script's own header states what it can and cannot see. Read it before quoting the result.

> **Gate 3** — no unexplained finding, and no stale exclusion.

## Phase 4 — Live sweep in a real browser

**A screen is never cleared by static analysis alone.** The most expensive defects of this kind are
invisible to it: a page that throws during mount renders nothing while its route still answers 200, and a
control wired correctly on both sides can still be unreachable because the thing that would reveal it never
appears.

For each screen in scope:

1. **Mount it and require the console to be silent.** An uncaught exception is a failure, not a warning.
   This single assertion catches a page whose template dereferences state that does not exist yet.
2. **Walk each core flow to completion** — create, read back, update, delete, and undo the delete. A flow
   that ends anywhere but its declared success condition is a finding.
3. **Provoke the failure branches**: stop a dependency, submit invalid input, act as a role without
   permission. Judge what the screen says against `references/failure-honesty.md`.
4. **Record the API responses** the flows produce. They are the input to the fixture-fidelity check, and the
   only honest source for a test fixture's shape.

**Where the project maintains an end-to-end test specification, that specification is what this phase
executes**, and the report states coverage against it: which scenarios ran, which passed, which were not
reached. Authoring and maintaining that document belongs to a test-specification convention, not here — this
phase only consumes it. Where there is none, derive the walk from the declaration's core flows as above, and
say in the report that the scope was derived rather than specified.

**A scenario the specification lists and this pass never executed is itself a finding.** Its severity is
low, but recording it is what keeps a specification from becoming a document that describes tests nobody
runs — the written form of the same false confidence this skill exists to refuse.

This phase **uses** the local environment; it never builds one. Where a dependency has to be stopped to
provoke a failure, restart it before the next flow, and leave the environment in the state the operator
handed it over in.

Drive the browser with whatever automation the project has. If a dedicated browser-automation convention is
available, follow it for harness layout, waiting and artifacts; this skill needs only that each screen be
mounted, each flow completed, console output captured, and failures evidenced by a screenshot.

> **Gate 4** — every screen in scope mounted, every core flow completed, console free of uncaught errors
> throughout. Where a specification exists, its coverage is reported — a scenario left unrun is named, not
> omitted.

## Phase 5 — Report

Write to `<project-root>/docs/reports/acceptance-<date>-<scope>.md` using
`references/report-format.md`. The report opens with the capability note and the gate results, then findings
ranked by severity, then what could not be verified, then the capability matrix as an appendix.

Element-level accessibility, contrast, token discipline and visual craft belong to the interface-audit
convention. Do not re-derive them here — hand those findings over, and keep this report on capability,
reachability, and truthfulness.

Write the report in the language the reader is using, as the documentation convention requires of
any document generated for a reader.

## What this skill does not decide

- Whether the code is well written. That is the coding conventions' business.
- Whether a commit may be made. Lint and unit tests before a commit belong to the development-workflow
  convention; this review sits later, at the point of calling a feature done.
- What the UI should look like. This review states that a capability is missing, unreachable or dishonest,
  and leaves the design of the fix alone.
