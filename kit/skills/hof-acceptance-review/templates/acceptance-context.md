# Acceptance Context

> Save this file as `<project-root>/ai/contexts/acceptance-context.md`. Fill everything discoverable from
> the codebase and mark the rest `TBD`. The rules for each section are in
> `references/project-declaration.md` of the `hof-acceptance-review` skill.

## Purpose
One or two lines: what the app is for, and what a user comes here to get done.

## Roles
| Role | May reach | Must not reach |
|---|---|---|
| viewer | TBD | TBD |
| administrator | TBD | TBD |

## Credentials for review
| Role | How to sign in |
|---|---|
| viewer | TBD (an account, or the command that seeds one) |
| administrator | TBD |

## Running the app
- Start: the command, the port it serves on
- Environment: which env file, which values must point where
- Dependencies: databases, queues, object stores, other services, and how to tell whether each is up
- Seed: the command that puts reviewable data in place

## Core flows
Named, with a start point and a success condition. These are the flows a live pass must complete.

| Flow | Starts at | Succeeds when |
|---|---|---|
| TBD | TBD | TBD |

## Entities and expected operations
| Entity | Create | Read | Update | Delete | Restore | Notes |
|---|---|---|---|---|---|---|
| TBD | ✓ | ✓ | ✓ | ✓ | ✓ | TBD |

## Deliberately absent from the UI
An operation the API exposes that no screen reaches on purpose. Write its Launcher or Subscriber class name,
and give every row a reason.

| Operation | Reason |
|---|---|

## Out of scope for this review
What not to audit, and why.

## Known and accepted
Defects already agreed to live with, so a review does not report them as new each time.
