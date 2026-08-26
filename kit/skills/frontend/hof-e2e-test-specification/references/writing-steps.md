# Writing Steps and Expectations

How the body of a scenario is worded. Referenced from Phase 3 of [SKILL.md](../SKILL.md).

Every rule here comes from one of two tests. Apply them to each sentence you write:

1. **Could a person with no access to the codebase perform this?** If a sentence needs the repository open to
   be understood, it is not a specification — it is a comment on an implementation.
2. **Will it still be correct after the screen is rebuilt?** A claim about the product survives a redesign. A
   description of the current markup does not, and a specification that has to be rewritten alongside every
   redesign stops being rewritten.

## Steps: what the user does

- **Name things as the user sees them.** "Open the programme *Spring Intake*" — not by identifier, not by row
  position, not by route. Row three stops being the right row the moment sorting changes.
- **One action per step.** A step containing "and" is usually two, and the second one is where a run stops
  without anyone being able to say which half failed.
- **Skip the navigation the product will change anyway.** "Open the programme from the programme list" is the
  claim; "click Programmes in the sidebar, then the third card, then the Details tab" is a description of
  today's navigation structure.
- **Describe a value by what makes it interesting, not by its literal**, unless the literal is the point: "a
  quantity larger than the remaining stock", "a name that already belongs to another programme". A literal
  copied into a step is a fact that has to be maintained; a description stays true when the seed set changes.
- **Addresses appear only when the scenario is about the address.** A deep link that must survive a reload, or
  direct access to something a role may not reach, is a claim about the address itself — everywhere else,
  naming a URL binds the specification to a routing table.

## Expectations: what the user can see

**Observable means the actor can see it** — on the screen in front of them, or somewhere they can navigate to.
Not the database, not the network panel, not the console. Where a consequence is only visible to an
administrator, the scenario that asserts it has an administrator as its actor, or states that the actor signs
in as one and makes that a step.

- **Quantify where a number is what makes it checkable.** "The list no longer contains the item and the count
  reads 23" is settled by looking. "The list updates" is settled by opinion.
- **A negative needs a place to be absent from.** "Nothing appears in the member's own list" can be checked.
  "No error occurs" cannot: it names no place to look, and it passes on a screen that failed silently — the
  exact defect worth catching.
- **Say what the user has, not what the system did.** "The application is listed with status *submitted* and
  opening it shows the values entered" rather than "the record is persisted".

## Asynchrony without waits

A consequence that arrives through a queue, a projection or a search index is still a user-facing claim — but
the claim has to say **how the user comes to see it**, because those are different promises:

| The product promises | Write it as | What a failure means |
| --- | --- | --- |
| it appears on its own | "appears in the list without the user doing anything" | the live update is broken |
| it appears when the user next looks | "appears after opening the list again" | acceptable by design; say so, so nobody reports the absence of live update as a defect |
| it appears eventually, and the wait is visible | "the row shows *processing*, and later shows the result" | a wait with no terminal state |

**Never write a duration.** "Within three seconds" is a property of the machine the run happens on; the
harness owns timeouts, and a specification that names one turns an infrastructure hiccup into a product
defect. Where the product genuinely promises a bound, that bound belongs in the declaration as a requirement,
and the scenario cites it.

## Never in a scenario

| Never | Why | Write instead |
| --- | --- | --- |
| Selectors, CSS classes, test identifiers | Bind the claim to today's markup; unreadable by a human executing it | The visible name of the thing |
| Explicit waits and durations | A property of the machine, not the product | The state that must be observed, per the table above |
| Assertions on the database, an API response, or component state | Not observable by the actor; passes while the screen shows nothing | What the actor sees as a result |
| Endpoint, table, component or class names | Turn a claim into a comment on the implementation | What the user did and got |
| "Displays correctly", "works as expected", "no errors" | Cannot be proven false — nothing distinguishes a pass from a skip | The specific thing on screen |
| Conditional steps — "if a dialog appears, dismiss it" | A scenario that branches was under-specified: the condition is either a precondition or another scenario | Fix the preconditions, or split |
| "Repeat for each…" | Unbounded, and nobody knows how many were done | Enumerate the cases that matter, or write one scenario about the set with a counted expectation |
| Another scenario's steps by reference | A scenario nobody can run without reading four others | Spell them out. The single exception is a failure variant citing its own normal path |

## Length is a signal

A normal-path scenario that needs more than about ten steps is doing one of two things: describing two flows
that should be numbered separately, or specifying the interface rather than the outcome. Before adding the
eleventh step, check which.

Failure and permission scenarios run shorter still — most are a precondition, one or two steps, and an
expectation. If one is long, the setup probably belongs in preconditions.

## Worked comparison

Both of these intend the same claim. Only one survives a redesign, and only one can be handed to someone who
has never seen the codebase.

```markdown
<!-- Do not write this -->
- **Steps**:
  1. Navigate to /programmes?page=1
  2. Click `[data-test="programme-card"]:nth-child(3)`
  3. Wait 2 seconds for the detail panel
  4. Click the button with class `.btn-apply`
  5. Fill #applicant-name with "Test User 001" and #quantity with 5
  6. Click submit and wait 3 seconds
- **Success condition**: POST /api/applications returns 201 and the record exists in the applications table

<!-- Write this -->
- **Steps**:
  1. Open the programme *Spring Intake* from the programme list.
  2. Start an application.
  3. Fill the required fields with values a real applicant would give, requesting more places than remain.
  4. Submit.
- **Success condition**: the form is refused with a message beside the number of places saying how many
  remain, and the values already entered are still on screen.
```

The second one also says something the first never could: **what the user is left with**. A specification that
only asserts the happy result has nothing to say about the far more common case where the product has to
refuse politely.
