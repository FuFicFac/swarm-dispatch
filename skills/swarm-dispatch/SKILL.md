---
name: swarm-dispatch
description: Aggressive mixed-agent orchestration for research, implementation, verification, and review loops using Codex subagents, Cursor Agent CLI, and other external agent processes. Use when the user asks for a swarm, cheap agents, multiple agents, parallel agents, delegation, Cursor CLI/Composer execution, agents that do not go idle, or asks Codex to act as a foreman/dispatcher and keep reassigning agents until the task is genuinely done.
---

# Swarm Dispatch

Use this skill to run a rolling task force instead of one-shot delegation. Codex remains the foreman: keep the critical path local, delegate bounded lanes to Codex subagents or external CLI agents, harvest results, reassign agents, and synthesize the final decision.

Important: Codex subagents are available only when the user explicitly asks for subagents, delegation, a swarm, or parallel agent work. External CLI agents can still be supervised when available and appropriate, but do not invent unavailable access.

## Dispatch Loop

1. **Frame the outcome.** Write the concrete finish line in one sentence. Decide what must be true before the task is done.
2. **Split lanes.** Create 2-6 non-overlapping lanes that can run in parallel: research/source-of-truth, implementation, verification/testing, alternatives/options, risk/security/compliance, docs/handoff/polish.
3. **Assign ownership.** Give each agent a clear lane, expected output, boundaries, and stop condition. For code changes, assign disjoint write sets and tell workers they are not alone in the codebase.
4. **Keep the main thread useful.** Do immediate blocking work locally while agents handle side lanes. Do not duplicate delegated work unless the returned result is unusable.
5. **Harvest and reassign.** When an agent returns, integrate the result, send a sharper follow-up, assign the next lane, or close the agent if the lane is truly finished.
6. **Repeat until done.** Continue spawn, harvest, reassign, and integrate until the finish line is met or a real blocker requires user input.
7. **Synthesize.** End with the decision, changes made, verification, open risks, and the agents' material findings.

## Agent Types

Use the right execution surface for the lane:

- **Codex subagents:** bounded research, repo inspection, alternatives, review, and parallel verification inside this harness.
- **Cursor Agent CLI / Composer:** substantial code implementation, app scaffolding, refactors, or build lanes where the user expects Cursor to do execution work.
- **Claude Code CLI:** code review, implementation planning, repo-aware edits, and model-tiered reasoning when Claude is the desired external worker.
- **Hermes Agent CLI:** local OpenClaw/Hermes-aligned work, skill-backed household/business lanes, and Hermes profiles or worktrees.
- **Ollama cloud/local models:** cheap bounded analysis, classification, summarization, brainstorm variants, and independent second opinions when no tools or file edits are needed.
- **Codex CLI:** OpenAI CLI parity checks, app-server experiments, and external Codex sessions when the current harness should supervise rather than directly execute.
- **Main Codex thread:** orchestration, critical-path decisions, final integration, conflict resolution, and verification quality.

Do not treat "swarm" as only Codex subagents. If the user mentions Cursor CLI, Composer, external agents, or build delegation, include those agents in the plan unless there is a concrete blocker.

## Local CLI Fleet

Inventory the available fleet at the start of serious swarm work:

```bash
for c in hermes ollama claude cursor agent cursor-agent codex; do command -v "$c"; done
ollama list
```

Default routing when available:

- **Cursor `agent` / `cursor-agent` / Composer 2:** primary external implementation worker and token-efficiency catalyst. Use expensive frontier models for planning, inspection, and adjudication; use Cursor's coding-tuned lane for bounded code-writing.
- **Claude `claude -p`:** review, planning, alternate implementation analysis, or a second implementation worker when Cursor is busy.
- **Hermes `hermes chat -q`:** local Hermes/OpenClaw-flavored reasoning, skill-aware research, or worktree-capable agent lanes.
- **Ollama `ollama run <model>`:** cheap narrow prompts with available cloud/local models.
- **Codex `codex`:** external Codex CLI experiments or app-server/Symphony lanes.

Prefer the cheapest capable model/agent for each lane. Expensive or high-reasoning agents should get harder lanes, not routine summarization.

## Builder / Inspector Hierarchy

When the user asks for the preferred build swarm, use this hierarchy:

- **Builders:** Cursor Agent CLI / Composer 2, small/cheap workers, and low-effort Codex subagents. Cursor is especially valuable as the high-throughput coding lane: send it precise plans and bounded write sets, then spend premium-model attention on review and integration.
- **Inspector:** the strongest currently available reviewer model/agent. Use it for judgment, not routine implementation.
- **Foreman:** main Codex coordinates, judges inspector reports, resolves disagreements, assigns fix lanes, and verifies final results.

Use the inspector after builder work lands, before declaring substantial work done.

## Inspector Loop

Run this loop for substantial builds:

1. **Builders implement.** Assign small builders disjoint write sets and bounded tasks. Require changed files and verification commands.
2. **Inspector reviews.** Send the target, diff/changed-file summary, acceptance criteria, and verification context. Ask for inspection first and tests only where risk suggests breakage.
3. **Inspector reports before fixing.** If problems are found, require severity, evidence, affected files, proposed fix plan, tests/checks, and suggested smaller-agent assignments.
4. **Codex arbitrates.** Main Codex accepts, rejects, or edits the fix plan before launching repairs.
5. **Dispute path.** If ambiguity remains, the inspector sends a short dispute note and waits for clarification.
6. **Builders fix.** Smaller agents implement accepted fixes within bounded write sets.
7. **Final harvest.** Main Codex collects final reports, inspects diffs, runs or reads verification, and reassigns any remaining work.

The inspector should not silently fix before the report/approval step unless the user explicitly asks for autonomous repair.

## Prompt Templates

Reusable prompt shapes live in [references/prompt-templates.md](references/prompt-templates.md).

Use these minimum fields in every agent prompt:

- lane owner and goal
- task-local context
- exact deliverable shape
- allowed write set or read-only boundary
- stop condition
- requirement to list changed files and verification commands when code changes

## CLI Supervision

External CLI agents are terminal sessions, not background promises. Keep a live ledger:

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

## Operating Rules

- Prefer cheap/small agents for bounded research, verification, and alternatives.
- Prefer Cursor Agent CLI for meaningful build/implementation lanes when the user names Cursor, Composer, or external build agents.
- Use stronger agents only for complex implementation or judgment-heavy work.
- Spawn multiple Codex subagents only when the user explicitly asks for agents, delegation, parallel work, or swarm mode.
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
