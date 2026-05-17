---
name: swarm-dispatch
description: Aggressive mixed-agent orchestration for research, implementation, verification, and review loops using Codex subagents, Cursor Agent CLI, and other external agent processes. Use when the user asks for a swarm, cheap agents, multiple agents, parallel agents, delegation, Cursor CLI/Composer execution, agents that do not go idle, or asks Codex to act as a foreman/dispatcher and keep reassigning agents until the task is genuinely done.
version: 0.2.0
---

# Swarm Dispatch

Use this skill to run a rolling task force instead of one-shot delegation. Codex remains the foreman: keep the critical path local, delegate bounded lanes to Codex subagents or external CLI agents, harvest results, reassign agents, and synthesize the final decision.

## Goal Preflight

Before dispatching agents, lock the goal so workers do not ask broad clarifying questions or drift into their own definitions of success.

Write:

```text
Goal:
[one sentence finish line]

Done means:
- [observable acceptance criterion]
- [observable acceptance criterion]
- [observable acceptance criterion]

Constraints:
- [files, systems, budgets, deploy limits, or safety boundaries]

Assumptions:
- If unclear, assume [reasonable default].
- Ask the user only for credentials, irreversible/destructive actions, paid services, external publication, or a truly blocking product decision.
```

If the user already supplied enough context, proceed from this preflight without stopping for more questions.

## Recommended Companion: `addyosmani/agent-skills`

Swarm Dispatch orchestrates *how* agents fan out. It deliberately does not invent a full engineering methodology for each lane. For engineering swarms, the recommended methodology layer is **Addy Osmani's [`agent-skills`](https://github.com/addyosmani/agent-skills)**: 7 lifecycle commands (`/spec`, `/plan`, `/build`, `/test`, `/review`, `/code-simplify`, `/ship`), 23 SDLC skills, and 3 named agents (`code-reviewer`, `security-auditor`, `test-engineer`).

In Codex, treat those commands as phase discipline rather than literal slash commands:

| Swarm Dispatch phase | Addy discipline |
|---|---|
| Goal Preflight / Frame | `/spec` thinking: acceptance criteria, non-goals, constraints |
| Split lanes | `/plan` thinking: task breakdown, dependencies, ownership |
| Builder lanes | `/build` thinking: incremental implementation, bounded changes |
| Test gate | `/test` thinking: verification, regressions, doubt-driven checks |
| Inspector loop | `/review` thinking: findings first, fixes second |
| Health pass | `/code-simplify` thinking: reduce complexity without changing behavior |
| Synthesis / release | `/ship` thinking: release notes, risks, rollback, handoff |

Apply this companion layer to engineering work: apps, CLIs, infra, sites, integrations, and production-facing docs. Do not force it onto creative/editorial swarms; named writing rosters should keep their own workflows.

## Dispatch Loop

1. **Frame the outcome.** Use Goal Preflight to write the concrete finish line, acceptance criteria, constraints, assumptions, and question boundaries.
2. **Split lanes.** Create 2-6 non-overlapping lanes that can run in parallel:
   - research/source-of-truth lane
   - implementation lane
   - verification/testing lane
   - alternative/options lane
   - risk/security/compliance lane
   - docs/handoff/polish lane
3. **Assign ownership.** Give each agent a clear lane, expected output, boundaries, and stop condition. For code changes, assign disjoint write sets and tell workers they are not alone in the codebase.
4. **Keep the main thread useful.** Do the immediate blocking work locally while agents handle side lanes. Do not duplicate delegated work unless the returned result is unusable.
5. **Harvest and reassign.** When an agent returns, immediately choose one:
   - integrate the result
   - send a sharper follow-up
   - assign the next lane
   - close the agent if the lane is truly finished
6. **Repeat until done.** Continue spawn/harvest/reassign/integrate until the finish line is met or a real blocker requires user input.
7. **Synthesize.** End with the decision, changes made, verification, open risks, and the agents' material findings.

## Agent Types

Use the right execution surface for the lane:

- **Codex subagents:** best for bounded research, repo inspection, alternatives, review, and parallel verification inside this harness.
- **Cursor Agent CLI / Composer:** best for substantial code implementation, app scaffolding, refactors, or build lanes where the user expects Cursor to do execution work.
- **Claude Code CLI:** best for code review, implementation planning, repo-aware edits, and model-tiered reasoning when Claude is the desired external worker.
- **Hermes Agent CLI:** best for local OpenClaw/Hermes-aligned work, skill-backed household/business lanes, and using Hermes profiles or worktrees.
- **Ollama cloud/local models:** best for very cheap bounded analysis, classification, summarization, brainstorm variants, and independent second opinions when no tools or file edits are needed.
- **Codex CLI:** best for OpenAI CLI parity checks, app-server experiments, and external Codex sessions when the current harness should supervise rather than directly execute.
- **Other CLI agents:** acceptable when already installed and appropriate, but track them like Cursor: command, cwd, session, expected output, and next checkpoint.
- **Main Codex thread:** owns orchestration, critical-path decisions, final integration, conflict resolution, and verification quality.

Do not treat "swarm" as only Codex subagents. If the user mentions Cursor CLI, Composer, external agents, or build delegation, include those agents in the plan unless there is a concrete blocker.

## Local CLI Fleet

Inventory the available fleet at the start of serious swarm work:

```bash
for c in hermes ollama claude cursor agent cursor-agent codex; do command -v "$c"; done
ollama list
```

Use these default routing rules when available:

- **Cursor `agent` / `cursor-agent`:** primary external implementation worker.
- **Claude `claude -p`:** review, planning, alternate implementation analysis, or a second implementation worker when Cursor is busy.
- **Hermes `hermes chat -q`:** local Hermes/OpenClaw-flavored reasoning, skill-aware research, or worktree-capable agent lanes.
- **Ollama `ollama run <model>`:** cheap narrow prompts with cloud models such as `glm-5.1:cloud`, `qwen3.5:cloud`, `gemini-3-flash-preview:cloud`, or smaller available models.
- **Codex `codex`:** external Codex CLI experiments or app-server/Symphony lanes.

Prefer the cheapest capable model/agent for each lane. Expensive or high-reasoning agents should get harder lanes, not routine summarization.

## Default Builder / Inspector Hierarchy

When the user asks for the preferred build swarm, use this hierarchy:

- **Builders:** Cursor Agent CLI, small/cheap workers, and low-effort Codex subagents. These agents do bounded implementation, cleanup, tests, and narrow fixes.
- **Inspector:** the strongest currently available reviewer model/agent acts as the senior inspector/reviewer. Use the current top model for judgment; do not preserve stale model names as policy.
- **Foreman:** main Codex coordinates, judges the inspector report, resolves disagreements, assigns fix lanes, and verifies the final result.

Use the inspector after builder work lands, before declaring the task done.

## Opus Inspector Loop

Run this loop for substantial builds:

1. **Builders implement.** Assign small builders disjoint write sets and bounded tasks. Require changed files and verification commands.
2. **Opus inspects.** Send Opus the target, diff/changed-file summary, acceptance criteria, and verification context. Ask it to inspect first and test only where it finds risk or likely breakage.
3. **Opus reports before fixing.** If Opus finds problems, it must send a report to main Codex before editing:
   - issue list with severity
   - evidence and affected files
   - proposed fix plan
   - tests/checks it intends to run
   - which smaller builders should fix which items
4. **Codex arbitrates.** Main Codex reviews the report, accepts/rejects/edits the fix plan, and sends guidance back to Opus.
5. **Dispute path.** If Opus disagrees or sees ambiguity, it sends a short dispute note and waits for clarification.
6. **Opus dispatches fixes.** Once aligned, Opus can assign fixes to smaller agents or propose assignments for main Codex to launch. Keep write sets bounded.
7. **Builders fix.** Smaller agents implement the fixes. Opus or Codex verifies depending on risk.
8. **Final harvest.** Main Codex collects final reports, inspects diffs, runs/reads verification, and reassigns any remaining work.

Opus should not silently fix before the report/approval step unless the user explicitly asks for autonomous repair.

## Opus Inspector Prompt

Use this prompt shape:

```text
You are the senior inspector for this swarm. Use the strongest currently available reviewer model/agent for judgment-heavy review.

Goal: inspect the completed builder work before it is accepted.

Context:
- Target: [repo/artifact/path]
- Acceptance criteria: [finish line]
- Builder changes: [summary or changed files]
- Verification already run: [commands/results]

Instructions:
- Inspect the work for correctness, regressions, missing tests, visual/layout problems, and integration risks.
- If you find likely problems, run the minimum tests/checks needed to confirm them.
- Do not fix yet.
- First return a report to main Codex with severity, evidence, proposed fix plan, tests/checks, and suggested smaller-agent assignments.
- If you disagree with main Codex's guidance later, send a short dispute note and wait for clarification.
```

## Builder Prompt Addendum

For builder agents in this hierarchy, include:

```text
You are a builder in a swarm. You are not the final reviewer.
Implement only your assigned slice, keep the write set bounded, list changed files, and include exact verification commands/results.
Do not broaden scope. Do not revert work by others.
```

## Claude / Hermes / Ollama Patterns

Claude headless:

```bash
claude -p --output-format text --permission-mode plan --model haiku "[prompt]"
claude -p --output-format text --model sonnet "[prompt]"
```

Hermes single-query or worktree:

```bash
hermes chat -q "[prompt]"
hermes --worktree chat -q "[prompt]"
```

Ollama cheap single-query:

```bash
printf '%s\n' "[prompt]" | ollama run glm-5.1:cloud
```

Ollama may emit spinner/control-code noise in some terminals. Treat it as useful for cheap reasoning, but filter or summarize the final answer before using it as a clean artifact.

If a command differs on the local install, inspect `--help` before launching the lane. Do not assume all external agents support the same flags, continuation, or output format.

## Cursor CLI Pattern

Before assigning Cursor work, check the available command and help if needed:

```bash
command -v agent cursor-agent cursor
agent --help
```

Prefer headless, auditable runs for bounded tasks:

```bash
agent --print --output-format text --trust --workspace "$WORKSPACE" "[prompt]"
```

Use `--mode=plan` for read-only planning lanes:

```bash
agent --print --mode=plan --trust --workspace "$WORKSPACE" "[prompt]"
```

Use `--worktree <name>` when the task is code-writing and the repo is git-backed:

```bash
agent --print --trust --workspace "$REPO" --worktree "lane-name" "[prompt]"
```

Use `--force` only when the user has authorized a broad execution lane and the write set is clear. Avoid `--yolo` unless the user explicitly asks for it.

Cursor prompt requirements:

- Name the lane and finish line.
- Name the allowed write set.
- Say the agent is not alone in the codebase and must not revert other work.
- Require a final changed-files list and verification commands.
- Require it to stop and report if it needs credentials, destructive operations, paid services, or external publication.

## CLI Supervision

External CLI agents are terminal sessions, not magic background promises. Keep a live ledger:

```text
agent: Cursor-1
lane: implementation / route texture
cwd: /path/to/repo
command/session: agent --print ...
write set: src/map-texture.*, assets/map/*
status: running | needs follow-up | done | blocked
next check: after current output or 30-60s
```

While CLI agents run:

- Keep the terminal session ID if the harness returns one.
- Poll long-running sessions with `write_stdin` or terminal reads instead of forgetting them.
- If output stalls, inspect whether it is waiting for input, approval, auth, or a command.
- Send explicit follow-up input only when the CLI supports continuation; otherwise start a fresh bounded run with the prior result summarized.
- When a CLI agent finishes, inspect its changed files before integrating.
- If it edits outside its write set, stop and review before proceeding.
- Close or terminate sessions that are done or blocked beyond usefulness.

## Agent Prompt Template

Use prompts like this:

```text
You own [lane]. Goal: [specific result].

Context:
- [only the task-local context needed]
- [paths, URLs, APIs, or constraints]

Deliverable:
- [exact output shape]
- [include source URLs / file paths / changed files / tests run as applicable]

Boundaries:
- Do not touch [areas].
- If you edit code, you are not alone in the codebase. Do not revert others' work. Keep changes within [write set].
- Stop and report if [blocker condition].
```

## Reassignment Prompts

When an agent returns too early or too generally, push it forward:

```text
Good. Now verify that against primary sources and list only facts that survived verification.
```

```text
Turn that into an implementation plan for this exact repo. Name files, commands, and risks.
```

```text
Inspect the relevant files directly and report the smallest safe patch. Do not make changes.
```

```text
You now own verification. Run the relevant tests/checks, capture failures, and identify whether they are caused by the current change.
```

```text
Implement only [bounded slice] in [paths]. Do not edit outside that write set. List changed files.
```

## Operating Rules

- Prefer cheap/small agents for bounded research, verification, and alternatives.
- Prefer Cursor Agent CLI for meaningful build/implementation lanes when the user names Cursor, Composer, or external build agents.
- Use stronger agents only for complex implementation or judgment-heavy work.
- Spawn multiple agents only when the user explicitly asks for agents/delegation/parallel work.
- Do not wait by reflex. Wait only when the next critical step is blocked by an agent result.
- Do not let agents idle in the background after their lane is done; reassign, resume, or close them.
- Do not create redundant agents for the same question unless the task benefits from independent verification.
- Keep a lightweight ledger in your own reasoning: active agent, lane, tool/session, cwd, status, next reassignment.
- If the user asks for "swarm mode," default to this loop.

## Good Swarm Shapes

- **Research decision:** one agent checks official docs, one checks alternatives, one checks implementation fit. Main thread synthesizes.
- **Code feature:** one worker owns UI, one worker owns data/API, one verifier runs tests while main thread integrates.
- **Cursor build:** Cursor owns a bounded implementation worktree, Codex subagents own research and verification, main Codex integrates and resolves conflicts.
- **Bug hunt:** one agent reads logs, one inspects recent diffs, one reproduces. Main thread patches the smallest confirmed cause.
- **Artifact polish:** one agent checks desktop, one checks mobile/accessibility, one checks copy/assets. Main thread applies fixes.

## Stop Conditions

Stop the swarm when:

- The task is implemented and verified.
- Remaining work is purely user preference.
- Continuing would require credentials, destructive action, spending money, or external publication.
- Agents are returning duplicated information with no new leverage.

Close with a concise synthesis rather than a transcript of every agent message.
