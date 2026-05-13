---
name: swarm-dispatch
description: >
  This skill should be used when the user asks for a "swarm," "dispatch agents," "delegate," "parallel agents," "multi-agent," "build with cheap agents," "use Cursor/Codex/Hermes," "foreman the build," "run agents in parallel," "inspector loop," "Opus inspector," or asks Claude to coordinate multiple subagents and/or external CLI agents on a single objective. Use whenever the work benefits from a rolling dispatch loop (assign → harvest → reassign → integrate) instead of single-shot delegation.
version: 0.1.0
---

# Swarm Dispatch (Claude Foreman Edition)

Use this skill to run a rolling task force instead of one-shot delegation. **You are the foreman.** Keep the critical path local. Delegate bounded lanes to Task-tool subagents and external CLI agents. Harvest results. Reassign agents. Synthesize the final decision.

This is the Claude-as-orchestrator port of the Codex `$swarm-dispatch` skill. The Codex version makes Codex the foreman; this version makes Claude the foreman. The agent surface table, the inspector loop, and the Codex role all change accordingly.

## Model Currency Rule

**Always invoke the current top model for each tier.** Do not hardcode model names — they go stale within months.

- **Inspector tier** (judgment-heavy): current top Claude Opus + current top Codex/GPT model.
- **Builder tier** (implementation): current Cursor Agent CLI default + current Haiku-class model.
- **Cheap tier** (classification, summarization, brainstorm): current Ollama cloud lineup — check `ollama list` at runtime.

Before dispatching, confirm you are calling the current frontier model for each tier. If a named model in this skill is no longer the leader, use its successor. Self-correcting is the whole point.

## Dispatch Loop (7 Steps)

1. **Frame the outcome.** Write the concrete finish line in one sentence. Decide what must be true before the task is done.
2. **Split lanes.** Create 2–6 non-overlapping lanes that can run in parallel: research, implementation, verification, alternatives, risk, docs/polish.
3. **Assign ownership.** Each agent gets a clear lane, expected output, boundaries, and stop condition. For code changes, assign disjoint write sets and tell workers they are not alone in the codebase.
4. **Keep the main thread useful.** Do the immediate blocking work locally while agents handle side lanes. Do not duplicate delegated work.
5. **Harvest and reassign.** When an agent returns, immediately choose one: integrate the result, send a sharper follow-up, assign the next lane, or close the agent.
6. **Repeat until done.** Continue spawn → harvest → reassign → integrate until the finish line is met or a real blocker requires user input.
7. **Synthesize.** End with the decision, changes made, verification, open risks, and the agents' material findings.

## Agent Surface Table (Claude is Foreman)

| Surface | Invocation | Best For |
|---|---|---|
| **Task-tool subagents** (Plan, Explore, general-purpose) | Native Task tool in Claude-compatible environments | Internal parallel research, repo exploration, bounded planning, verification |
| **Cursor Agent CLI** | `agent --print --output-format text --trust --workspace ...` via Bash | Substantial implementation, app scaffolding, refactors, code-writing lanes |
| **Claude Code CLI** | `claude -p --model <tier> "..."` via Bash | Cross-instance Claude work, model-tiered review, planning, alternate implementation |
| **Codex CLI** | `codex ...` via Bash | Cross-family second opinion, alternative implementations, OpenAI-ecosystem work, rate-limit relief when Claude is throttled |
| **Hermes CLI** | `hermes chat -q "..."` via Bash | Hermes/OpenClaw-aligned lanes, skill-aware research, worktree-capable execution |
| **Ollama (local/cloud)** | `ollama run <model> "..."` via Bash | Cheap narrow prompts: classification, summarization, brainstorm, independent second opinion |
| **Main Claude thread** | You | Orchestration, critical-path decisions, integration, conflict resolution, final synthesis |

At the start of serious swarm work, inventory the fleet:

```bash
for c in cursor-agent agent claude codex hermes ollama; do command -v "$c"; done
ollama list
```

Prefer the cheapest capable surface for each lane. Reserve expensive inspectors (Opus, top-tier Codex) for judgment-heavy work, not routine summarization.

## Codex Role (Narrowed)

Codex is a first-class participant but **not** the default for primary build, inspection, or cheap classification. In this Claude-foreman version, Codex's job is specifically:

1. **Independent cross-family verification.** When Claude Opus inspects and flags an issue, a Codex pass confirms or disputes. Different training corpus = different blind spots. Same-family agreement is theater; different-family disagreement is data.
2. **Alternative implementation lane.** When the swarm wants two implementations to compare, generate one with Codex and one with Cursor. Different lineages produce more useful diffs than running the same agent twice.
3. **OpenAI-ecosystem work.** Symphony lanes, OpenAI Apps SDK, anything touching OpenAI's own tooling — Codex catches OpenAI-specific gotchas faster.
4. **Rate-limit relief valve.** When Claude is throttling and a lane needs to keep moving, Codex eats work that would otherwise stall the swarm.

Demoted from the Codex version: Codex is **not** the default primary implementation worker (Cursor is), **not** the default inspector (Opus is), **not** the default cheap classifier (Ollama is).

## Builder / Inspector Hierarchy

Default hierarchy for substantial builds:

- **Builders:** Cursor Agent CLI, Haiku-class Task-tool subagents, cheap Codex subagents. Bounded implementation, cleanup, tests, narrow fixes.
- **Inspectors:** Claude Opus (current top) + Codex (current top frontier). Review and judgment only; no silent fixes before reporting.
- **Foreman:** main Claude thread. Orchestrates, arbitrates, integrates, verifies final result.

Two configurations exist. Pick based on stakes.

### Lean Loop (default)

Use for routine work, small changes, low-stakes patches.

```
Builder implements → Opus Inspector reports → Foreman approves or assigns fix → done
```

Steps:

1. **Builder** (Haiku/Cursor) implements the assigned slice. Returns changed files + verification commands.
2. **Opus Inspector** reviews for correctness, regressions, integration risks. Reports first; does not fix.
3. **Foreman** (you) arbitrates: accept, reject, or assign a fix-planner.
4. **Fix-Planner** (Haiku) plans the regression fix from Inspector's report. Plan only, no implementation.
5. **Builder** applies the fix plan.
6. **Opus Final Inspector** verifies acceptance: pass/fail with explicit blockers.

### Deluxe Loop (high-stakes)

Use for security-adjacent code, public releases, production migrations, anything where a missed bug costs real money or trust.

```
Builder implements
       ↓
  ┌────┴────┐
  │         │           (run in parallel — neither sees the other's report)
Claude     Codex
Sonnet     CLI
Inspect    Inspect
  │         │
  └────┬────┘
       ↓
Opus Adjudicator (reads both reports cold, weighs evidence, declares verdict)
       ↓
   You get one verdict
```

Steps:

1. **Builder** (Haiku/Cursor) implements.
2. **Two inspectors run in parallel and independently** — Claude Sonnet (repo-aware, fast) and Codex CLI (current top model, different family). Neither sees the other's findings.
3. **Opus Adjudicator** receives both raw reports plus the code diff. Adjudicates: agree, disagree, or flag for foreman.
4. **Foreman** (you) approves the verdict or assigns fix lanes.
5. **Builder** applies fixes.
6. **Opus Final Inspector** verifies acceptance.

**Why parallel beats sequential:** sequential inspections suffer two failures. (1) Anchoring bias — the second inspector sees the first's report and either confirms or refutes, never running a clean read. (2) Telephone game — each layer summarizes the prior, losing fidelity. Parallel inspection with Opus adjudication preserves independence and puts Opus on judgment work (its strength), not relay work.

**Trigger Deluxe when:**
- Security or auth-adjacent code
- Public-facing release (npm, PyPI, GitHub release, plugin distribution)
- Production database migrations
- Money/payments paths
- Anything you would lose sleep over

**Stay Lean when:** routine work. Deluxe costs ~2–3x tokens and adds latency. Don't run it on every patch.

## CLI Supervision

External CLI agents are terminal sessions, not background promises. Keep a live ledger in your reasoning or a scratch file:

```text
agent: Cursor-1
lane: implementation / [area]
cwd: /path/to/repo
command/session: agent --print ...
write set: [files/paths]
status: running | needs follow-up | done | blocked
next check: after current output or 30–60s
```

Cursor pattern (bounded implementation):

```bash
agent --print --output-format text --trust --workspace "$WORKSPACE" "[prompt]"
# Use --worktree <name> for git-backed write lanes
# Use --mode=plan for read-only planning lanes
```

Claude headless:

```bash
claude -p --output-format text --permission-mode plan --model haiku "[prompt]"
claude -p --output-format text --model sonnet "[prompt]"
claude -p --output-format text --model opus "[prompt]"
```

Codex headless (always use current top model — check `codex --help` for the current model flag and value):

```bash
codex -p --model <current-top-codex-model> "[prompt]"
```

Hermes:

```bash
hermes chat -q "[prompt]"
hermes --worktree chat -q "[prompt]"
```

Ollama cheap single-query:

```bash
printf '%s\n' "[prompt]" | ollama run glm-5.1:cloud
```

When a CLI agent finishes, inspect changed files before integrating. If it edits outside its write set, stop and review.

## Prompt Templates

### Builder addendum (always include)

```text
You are a builder in a swarm. You are not the final reviewer.
Implement only your assigned slice. Keep the write set bounded.
List changed files and exact verification commands.
Do not broaden scope. Do not revert work by others.
```

### Opus Inspector prompt

```text
You are the Opus inspector. Use the current top Opus model in regular context.

Goal: inspect builder work before acceptance.

Context:
- Target: [repo/artifact/path]
- Acceptance criteria: [finish line]
- Builder changes: [summary or changed files]
- Verification already run: [commands/results]

Instructions:
- Inspect for correctness, regressions, missing tests, layout/visual problems, integration risks.
- Run the minimum tests/checks needed to confirm likely problems.
- Do not fix yet.
- Report to foreman first: severity, evidence, proposed fix plan, tests/checks, suggested smaller-agent assignments.
- If you disagree with foreman guidance, send a dispute note and wait for clarification.
```

### Codex Inspector prompt (Deluxe loop)

```text
You are an independent inspector running in parallel with a Claude inspector.
You have not seen their report and will not see it before submitting yours.

Goal: inspect builder work for correctness, regressions, and risks.

Context:
- Target: [repo/artifact/path]
- Acceptance criteria: [finish line]
- Builder changes: [summary or changed files]

Instructions:
- Run an independent read of the changes. Do not assume any prior reviewer's findings.
- Report: severity-ranked issue list with evidence, proposed fix plan, suggested verification.
- Do not fix.
```

### Opus Adjudicator prompt (Deluxe loop only)

```text
You are the adjudicator. Two inspectors have independently reviewed the same builder work.

Inputs:
- Inspector A (Claude Sonnet) report: [paste]
- Inspector B (Codex CLI) report: [paste]
- Code diff / changed files: [paste or path]
- Acceptance criteria: [finish line]

Instructions:
- Weigh the evidence in both reports against the actual diff.
- Identify points of agreement (high-confidence findings).
- Identify points of disagreement and adjudicate each one with reasoning.
- Produce a single unified verdict: ACCEPT, ACCEPT-WITH-FIXES, or REJECT.
- For ACCEPT-WITH-FIXES, list fix assignments with severity and suggested agent.
```

### Reassignment prompts (push agents forward)

```text
Verify that against primary sources and list only facts that survived verification.
```

```text
Turn that into an implementation plan for this exact repo. Name files, commands, risks.
```

```text
Inspect the relevant files directly and report the smallest safe patch. Do not make changes.
```

```text
You now own verification. Run the relevant tests/checks, capture failures, identify whether they are caused by the current change.
```

```text
Implement only [bounded slice] in [paths]. Do not edit outside that write set. List changed files.
```

## Good Swarm Shapes

- **Research decision:** one agent checks official docs, one checks alternatives, one checks implementation fit. Foreman synthesizes.
- **Code feature (Lean):** one builder owns UI, one builds data/API, one verifier runs tests. Foreman integrates. Opus inspects at the end.
- **Code feature (Deluxe):** as above, plus parallel Claude+Codex inspection and Opus adjudication before merge.
- **Cursor build:** Cursor owns a bounded implementation worktree, Task-tool subagents own research and verification, foreman integrates.
- **Bug hunt:** one agent reads logs, one inspects recent diffs, one reproduces. Foreman patches the smallest confirmed cause.
- **Artifact polish:** one agent checks desktop, one checks mobile/accessibility, one checks copy/assets. Foreman applies fixes.

## Operating Rules

- Prefer cheap/small agents for bounded research, verification, and alternatives.
- Prefer Cursor Agent CLI for meaningful implementation lanes.
- Reserve top-tier models for judgment-heavy work.
- Spawn multiple agents only when the user explicitly asks for delegation/parallel work, or when the lane structure clearly benefits.
- Do not wait by reflex. Wait only when the next critical step is blocked by an agent result.
- Do not let agents idle after their lane is done; reassign, resume, or close them.
- Do not create redundant agents for the same question unless independent verification is the explicit goal.
- Keep a lightweight ledger: active agent, lane, tool/session, cwd, status, next reassignment.
- If the user asks for "swarm mode," default to the Lean Loop. Escalate to Deluxe only on stakes triggers above or explicit user request.

## Stop Conditions

Stop the swarm when:

- The task is implemented and verified.
- Remaining work is purely user preference.
- Continuing would require credentials, destructive action, spending money, or external publication.
- Agents are returning duplicated information with no new leverage.

Close with a concise synthesis rather than a transcript of every agent message.

## Genesis

This Claude-foreman edition was authored as a public counterpart to the Codex `$swarm-dispatch` skill. The inspector loop is upgraded from sequential review to parallel-and-adjudicated review for high-stakes lanes.
