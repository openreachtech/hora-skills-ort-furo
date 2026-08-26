# Lifecycle

Identifiers over time, amending versus retiring, and what keeps the document honest for years. Referenced
from Phase 5 of [SKILL.md](../SKILL.md).

A specification fails slowly. It is never wrong on the day it is written; it becomes wrong one unreconciled
change at a time, until a run reports coverage against a list that describes a product that no longer exists.
Everything here exists to make that decay visible while it is still small.

## The identifier is a promise

Every report that ever cites `APP-04` is relying on `APP-04` meaning the same claim it meant then.

- **Never renumber, never reuse.** Renumbering to close gaps after a retirement rewrites the history of every
  report at once, silently.
- **A prefix is a namespace, not a label.** When a flow is renamed, **the prefix stays** — an "Applications"
  flow that becomes "Enrolments" keeps `APP`, and the index records the rename. An ugly prefix costs a moment
  of confusion; a remapped one costs the ability to read last quarter's reports.
- **Splitting a flow moves scenarios; it does not renumber them.** The scenarios keep their identifiers in
  their new file, the new flow gets a new prefix for its *future* scenarios, and the index records where each
  went. A file will then hold two prefixes for a while. That is correct, and it is cheaper than the
  alternative.
- **Merging is the same in reverse.** Both prefixes survive in the merged file.

## Amend or retire

The decision has one test: **does the claim still hold in some form?**

| The change | What to do |
| --- | --- |
| The route through the UI changed; the user can still achieve the outcome | **Amend the steps.** Same identifier — the claim is unchanged, only the way there |
| The screen was redesigned | Usually **nothing**. A scenario that has to be edited for a redesign was specifying the interface, and the edit is the moment to fix that |
| The outcome changed — success now means something different | **A new scenario.** The old one retires |
| The capability was removed | **Retire** |
| Two scenarios turned out to be the same claim | Retire one, note which absorbed it |

**The success condition is the identity of the scenario.** Steps may change freely; the moment the success
condition changes, it is a different claim wearing an old number, and every report that cited it becomes
misleading. This is the single rule that keeps identifiers meaningful.

## Retirement

```markdown
### APP-04 — *retired*

- **Status**: retired 2026-03-11 — the paper-form upload it covered was removed from the product.
```

Heading and `Status`, nothing else. Enough to prove the number is spent and to explain the gap; not enough to
be mistaken for something to run. Steps, preconditions and expectations go — they describe a product that no
longer exists, and leaving them invites someone to "fix" the scenario back to life.

**A specification that has retired nothing has stopped being maintained.** Real products lose capabilities. An
all-active document after two years of change means additions were reconciled and removals were not.

## Reconciling after the product changes

Reconciliation belongs to the change that caused it, not to a calendar. A quarterly sweep finds the same gaps
months later, when nobody remembers the intent.

| What changed | What it obliges |
| --- | --- |
| A new operation exists | Derive its scenarios, or add a coverage-gap entry saying what it waits for |
| An operation was removed | Retire the scenarios that covered it; remove any exclusion naming it |
| A new role exists | One scenario that its area is reachable, and one per boundary it must not cross |
| A flow's shape changed | Amend the steps of its scenarios; check whether the success conditions still hold |
| An exclusion's reason stopped being true | Delete the exclusion and derive the scenarios it was holding back |
| The seed set changed | Check every precondition that names seeded rows — a precondition naming a row that is no longer seeded makes its scenario unrunnable, and it will be reported as unexecuted rather than as broken |

That last row is the one that gets missed, because the specification and the seed set are maintained by
different hands and nothing links them but prose.

## Keeping it honest

**An unexecuted scenario has exactly two causes, and both need action.** A run that reports one is reporting
a defect in one of the two documents:

- **It could not be performed as written** — a precondition no longer holds, a step refers to something that
  is gone. Amend it, or retire it. Do not leave it to be reported again next time.
- **The run skipped it** — scope, time, or a role nobody could sign in as. That belongs in the run's report,
  not here; but a scenario skipped by every run for months is not covered by anything, and saying so is the
  point of counting.

**A scenario that has failed for months is one of two things.** Either it is a defect the project has decided
to live with — which belongs in the declaration's known-and-accepted list, so runs stop re-reporting it — or
it is a claim the product will never satisfy, which means the claim was wrong and the scenario should change.
Leaving it failing indefinitely trains readers to skim past red.

**Never soften a scenario to match the product.** Editing a claim down to whatever the implementation
currently does converts the specification into a description, and a description cannot find anything. If the
claim was wrong, change it deliberately and say why in the index; if the product is wrong, the scenario stays
and the failure gets reported.

**Results never live here.** Which scenario passed on which day belongs to a dated report. The moment a
`Last result` column appears, the document has two jobs, and the one that decays is the specification.

## Signs it has rotted

Each of these is visible without reading the scenarios:

- **No failure band anywhere.** Only happy paths were ever derived.
- **`Permission 0` on a flow whose product has roles.** The boundary is unspecified.
- **Nothing retired.** Removals were never reconciled.
- **The coverage-gaps table is empty while operations have no scenarios.** The gaps are real but unrecorded,
  which is worse than having them.
- **Most preconditions say "as *X*, up to step *n*".** The scenarios can no longer be run independently, and
  a single change to *X* invalidates a dozen of them.
- **Scenario titles name screens rather than outcomes.** "The applications page" is a place; a claim says what
  someone achieves there.
