# Swarm Dispatch Prompt Templates

## Agent Prompt Template

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

## Builder Prompt Addendum

```text
You are a builder in a swarm. You are not the final reviewer.
Implement only your assigned slice, keep the write set bounded, list changed files, and include exact verification commands/results.
Do not broaden scope. Do not revert work by others.
```

## Inspector Prompt

```text
You are the inspector for this swarm.

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

## Reassignment Prompts

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

## Cursor CLI Pattern

```bash
command -v agent cursor-agent cursor
agent --help
```

Headless bounded implementation:

```bash
agent --print --output-format text --trust --workspace "$WORKSPACE" "[prompt]"
```

Read-only planning:

```bash
agent --print --mode=plan --trust --workspace "$WORKSPACE" "[prompt]"
```

Git-backed worktree lane:

```bash
agent --print --trust --workspace "$REPO" --worktree "lane-name" "[prompt]"
```

## Claude / Hermes / Ollama Patterns

```bash
claude -p --output-format text --permission-mode plan --model haiku "[prompt]"
claude -p --output-format text --model sonnet "[prompt]"
```

```bash
hermes chat -q "[prompt]"
hermes --worktree chat -q "[prompt]"
```

```bash
printf '%s\n' "[prompt]" | ollama run glm-5.1:cloud
```

If a command differs on the local install, inspect `--help` before launching the lane. Do not assume all external agents support the same flags, continuation, or output format.
