# Baseline Usability

The floor, not the ceiling. Each item's absence makes an application unusable or untrustworthy
regardless of how it looks — so each is a finding, not a suggestion.

Craft above this floor — hierarchy, spacing, contrast, motion, tone — belongs to the interface-audit
convention. Do not duplicate it here.

Every item carries **how** it is checked, because an item with no method never gets run.

## Input shape

| Item | Check | How |
| --- | --- | --- |
| A field whose values are finite and known is a choice, not free text | The value comes from a master table, an enumeration, or a set the code already lists | Static |
| A field whose values are the user's own vocabulary is **not** locked to a list | Suggesting existing values is right; refusing a new one is not | Static |
| A numeric field distinguishes empty from zero | Clearing a box to retype it must not save `0`; `Number('')` is `0` and passes a finiteness test | Static |
| Submitting is disabled while a submit is in flight | Otherwise a second press sends twice | Live |
| A destructive action is confirmed, and the confirmation names the consequence | "Delete?" is not a confirmation; "delete this and the 24 under it" is | Live |
| Leaving with unsaved work warns | Both the in-app route change and the browser's own close | Live |

## What the screen says about its data

| Item | Check | How |
| --- | --- | --- |
| Every data region has loading, empty, error and ready | An empty region rendering nothing reads as a fault | Static + Live |
| Empty is worded, not blank | And says what to do next where there is something to do | Live |
| A list is paginated | And says where in the list the user is | Live |
| Internal keys never reach the screen | Status and category names come from display values, not the codes the API branches on | Static |

## Getting around

| Item | Check | How |
| --- | --- | --- |
| Sign in exists | | Static |
| **Sign out exists** | Sessions held in local storage survive closing the browser; on a shared machine the next person is still signed in, and no account can be switched | Static + Live |
| A role's own area is reachable from where they land | | Live, per role |
| Being unable to enter somewhere says why | Bouncing a user back to a form with no message is indistinguishable from a broken button | Live, per role |
| Current position is shown | Breadcrumb, title, or selection | Live |
| A way back exists that is not the browser button | | Live |
| A deep link opens, reloads, and survives being pasted elsewhere | Three separate checks; each fails differently | Live |

## Chrome that must not take over the screen

| Item | Check | How |
| --- | --- | --- |
| Navigation is present on every screen that needs it | | Live |
| It collapses | A menu that keeps its full width leaves the work squeezed beside it | Live |
| It does not overflow the viewport at a narrow width | | Live, narrow |
| A panel or drawer can be dismissed | And dismissing it returns the space | Live |

## Permission

| Item | Check | How |
| --- | --- | --- |
| A user without a permission is not offered the control | Hiding it is not the guard, but offering it is a defect on its own | Static + Live, per role |
| The API refuses it as well | Two sides, because either alone is one mistake from open | Live, per role |

## Running the checks

The static ones read code and can be batched. The live ones need the app running, and several need **more
than one role** — a review that could only sign in as one records the rest as unverified rather than passing
them.

A `Live` item that could not be exercised is not a pass. Say which, and why.
