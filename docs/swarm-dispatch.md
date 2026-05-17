# Swarm Dispatch Protocol

Swarm Dispatch is a practical orchestration loop for agentic work. It treats the main agent as a foreman and delegated agents as bounded workers, inspectors, researchers, or reviewers.

## Operating Loop

0. Run Goal Preflight: finish line, done criteria, constraints, assumptions, and question boundaries.
1. Define the finish line in one concrete sentence.
2. Split the work into non-overlapping lanes.
3. Assign each lane to an agent with ownership, boundaries, and a stop condition.
4. Keep the main thread on the critical path.
5. Harvest results as agents finish.
6. Reassign follow-up work immediately when a result exposes a gap.
7. Integrate and verify before calling the task done.

## Agent Roles

| Role | Responsibility |
|---|---|
| Foreman | Owns the finish line, assignment logic, integration, and final decision |
| Builder | Implements a bounded slice and reports changed files plus checks |
| Explorer | Reads code or docs and returns targeted findings |
| Inspector | Reviews output for regressions, risks, and missing verification |
| Adjudicator | Resolves conflicts between independent reviews |

## Engineering Methodology Layer

Swarm Dispatch answers the orchestration question: who should work on what, when should the foreman harvest, and how does review stay independent from implementation?

For engineering swarms, pair it with Addy Osmani's [`agent-skills`](https://github.com/addyosmani/agent-skills). Addy's pack supplies the lane-level craft discipline:

| Swarm Dispatch phase | Methodology layer |
|---|---|
| Goal Preflight | `/spec`: acceptance criteria, constraints, non-goals |
| Split lanes | `/plan`: task breakdown and dependencies |
| Builder work | `/build`: incremental implementation |
| Verification | `/test`: test and regression discipline |
| Inspection | `/review`: findings-first quality review |
| Code health | `/code-simplify`: simplify without behavior drift |
| Release | `/ship`: handoff, rollout, rollback, and launch notes |

This pairing is meant for apps, infrastructure, CLIs, integrations, and public-release work. Do not replace creative or editorial swarms with SDLC skills; writing swarms need their own prose-aware rosters.

## Token Efficiency

Swarm Dispatch is not just a quality-control pattern. It is also a cost-routing pattern.

Use premium models for high-leverage cognition:

- deciding what should be built
- splitting work into safe lanes
- reviewing architecture
- inspecting regressions
- adjudicating conflicting reports

Use specialized coding surfaces, especially Cursor Composer 2 when available, for bounded implementation work:

- applying a known plan
- editing assigned files
- wiring UI or API changes
- running tests and reporting changed files

This preserves expensive frontier-model tokens for judgment while letting a coding-tuned implementation lane do the high-volume code generation.

## When To Use It

Use Swarm Dispatch when a task benefits from parallel work, independent verification, or repeated reassignment. It is especially useful for public releases, substantial implementation, code review, research synthesis, documentation packages, and visual production.

Do not use it when a task is a one-command check or a small direct edit that one agent can safely complete faster alone.
