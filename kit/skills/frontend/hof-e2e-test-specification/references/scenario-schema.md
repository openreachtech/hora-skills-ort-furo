# The Scenario Schema

The shape of one scenario, the shape of the file that holds it, and the index that lists the files.
Referenced from Phase 3 of [SKILL.md](../SKILL.md).

**The field labels are a contract, not decoration.** The identifier lives in the heading and the operations
live under `Covers`, because the coverage check reads exactly those two places. Rename a label and the
scenario becomes invisible to it — reported as an operation nobody specified.

## The fields

| Field | Required | Rule |
| --- | --- | --- |
| identifier | yes | In the heading, `<PREFIX>-<nn>`, from this flow's band (below). Never reused |
| title | yes | One sentence naming **what the user achieves**. Not "test that…", not "verify…" — a scenario is a claim, and the title is the claim |
| `Actor` | yes | A role from the declaration's role list, by its name there. Never "a user": a scenario whose actor is unspecified cannot be a permission scenario, and half of them are |
| `Status` | yes | `active`, or `retired <date> — <reason>` |
| `Covers` | yes | The operation identifiers this scenario exercises, as they appear in the capability inventory. **This is the join to coverage**; a scenario that covers nothing is a scenario nobody can tell is missing |
| `Preconditions` | yes | The state of the world before step 1 — who is signed in, and which **seeded** rows exist. Name the rows; do not describe creating them |
| `Steps` | yes | Numbered, what the user does. See [writing-steps.md](./writing-steps.md) |
| `Success condition` | yes | Exactly one, observable by the actor. The point at which the flow is complete |
| `Then also observable` | no | Consequences of that same completed flow, visible **elsewhere** in the product |
| `Failure variants` | no | Identifiers of the failure scenarios that branch from this one. Referenced, never inlined |
| `Notes` | no | Traceability to the project's own requirement or screen identifiers, where it has them |

### Two fields that carry the weight

**`Success condition` is singular on purpose.** Two conditions mean two scenarios, and a scenario with two is
the one that gets reported half-executed. If a flow genuinely has to end in two places, the second belongs to
its own identifier — which is also what makes it visible when only one of them was ever run.

**`Then also observable` is where a multi-service product is actually specified.** A write that has to reach a
search index, a derived list, a counter or a notification is not complete when the form closes: the user's
claim is that it shows up over there too. Stating it here, in user terms — "the record appears in search
results" — is what turns an asynchronous gap into a failed scenario instead of something quietly ignored. It
does not create a second success condition: it describes what the *same* completed flow must have produced.

### Fields deliberately absent

- **No per-step expected result.** A step-by-step expectation turns a claim into a script, and a script is
  what breaks on redesign. Expectations belong at the end, where the flow is complete.
- **No priority or severity.** Severity is judged when something fails, by the review, on its scale. A
  priority column in a specification is read as permission to skip the low ones and still call it covered.
- **No environment or setup section.** Preconditions name seeded data; how that data gets there is another
  convention's business.

## Identifier bands

The three sources in Phase 2 get three bands, so **what a flow was specified against is visible from its
numbers**:

| Band | Source | Reading a gap |
| --- | --- | --- |
| `01`–`49` | the capability inventory | — |
| `51`–`79` | the provocation catalogue | a flow with nothing in this band has never been specified against failure |
| `81`–`99` | the role list | a flow with nothing here has no permission boundary written down |

Numbers are allocated in order and never renumbered to close gaps. Gaps mean retirement, and a gap is
information.

## The file

One file per flow, at `<project-root>/ai/specs/e2e/<flow>.md`:

```markdown
# Applications (`APP`)

What this flow is for, in a sentence or two, and where a user enters it.

## Excluded from this flow

| Operation | Reason |
| --- | --- |
| `purgeApplication` | Operations-only; reachable from the maintenance CLI, never from the UI |

## Scenarios

### APP-01 — A member submits an application and can see it afterwards

- **Actor**: member
- **Status**: active
- **Covers**: `createApplication`, `applications`, `application`
- **Preconditions**:
  - signed in as the seeded member account
  - the seeded catalogue holds the programme "Spring Intake", open for applications
  - this member has no application for that programme
- **Steps**:
  1. Open the programme "Spring Intake" from the programme list.
  2. Start an application.
  3. Fill the required fields with values a real applicant would give.
  4. Submit.
- **Success condition**: the application appears in the member's own list with status "submitted", and opening
  it shows the values that were entered.
- **Then also observable**: the programme's remaining-places count has decreased by one; the application is
  findable by the member's name in the administrator's search.
- **Failure variants**: APP-51, APP-52
- **Notes**: covers requirement REQ-114.

### APP-51 — Submitting fails while the application service is unreachable

- **Actor**: member
- **Status**: active
- **Covers**: `createApplication`
- **Preconditions**: as APP-01, up to and including step 3
- **Steps**:
  1. Make the application service unreachable.
  2. Submit.
- **Success condition**: the screen says the submission did not go through and what to do next; the entered
  values are still on screen, and nothing appears in the member's list.

### APP-81 — A member cannot reach another member's application

- **Actor**: member
- **Status**: active
- **Covers**: `application`
- **Preconditions**: two seeded member accounts, each with one submitted application
- **Steps**:
  1. Signed in as the first member, open the address of the second member's application directly.
- **Success condition**: the application is not shown, the screen says why, and the request is refused by the
  API as well as hidden by the UI.

### APP-04 — *retired*

- **Status**: retired 2026-03-11 — the paper-form upload it covered was removed from the product.
```

- **A scenario never spans two files.** Its flow owns it; a scenario that seems to belong to two flows is
  either two scenarios or a sign the flows were cut in the wrong place.
- **`Preconditions: as APP-01, up to and including step 3`** is the one permitted shorthand, and only for a
  failure variant against its own normal-path scenario. Anywhere else, spell the preconditions out: a chain of
  references is a scenario nobody can execute without reading four others.
- **A retired scenario keeps its heading and its `Status`, and loses everything else.** Enough to prove the
  number is spent, not enough to be mistaken for something to run.

## The index

`<project-root>/ai/specs/e2e/index.md` is the one place that answers "what does this specification cover":

```markdown
# E2E Test Specification — index

| Flow | Prefix | File | Normal | Failure | Permission | Retired |
| --- | --- | --- | --- | --- | --- | --- |
| Applications | `APP` | [applications.md](./applications.md) | 6 | 4 | 2 | 1 |
| Programmes | `PRG` | [programmes.md](./programmes.md) | 5 | 1 | 0 | 0 |

## Coverage gaps

Operations with no scenario yet, and why not. Empty is the goal; a gap with no entry here is a gap nobody
has looked at.

| Operation | Why not yet |
| --- | --- |
| `reindexProgrammes` | Specified once the operator screen exists; today it is only reachable from a job |
```

- **The counts per band are the point of the table.** `Permission 0` on a flow with roles, or `Failure 0` on
  anything, is visible at a glance and needs an answer.
- **Coverage gaps are recorded here, not in the flow files.** A gap is about the specification as a whole; the
  flow file holds only what a flow deliberately excludes, with its reason.
