# Swarm Dispatch Protocol

Swarm Dispatch is a practical orchestration loop for agentic work. It treats the main agent as a foreman and delegated agents as bounded workers, inspectors, researchers, or reviewers.

## Operating Loop

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

## When To Use It

Use Swarm Dispatch when a task benefits from parallel work, independent verification, or repeated reassignment. It is especially useful for public releases, substantial implementation, code review, research synthesis, documentation packages, and visual production.

Do not use it when a task is a one-command check or a small direct edit that one agent can safely complete faster alone.
