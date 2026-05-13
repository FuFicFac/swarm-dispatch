---
description: Run a mixed-agent swarm with Claude as foreman
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Agent, TaskCreate, TaskUpdate, TaskList
argument-hint: [objective]
---

Activate the swarm-dispatch skill and run a rolling task force against this objective:

$ARGUMENTS

Follow the swarm-dispatch protocol exactly:

1. Frame the outcome in one sentence.
2. Split the work into 2–6 non-overlapping lanes.
3. Inventory the available CLI fleet:
   ```bash
   for c in cursor-agent agent claude codex hermes ollama; do command -v "$c"; done
   ollama list 2>/dev/null || true
   ```
4. Assign each lane to the cheapest capable surface — Task-tool subagents for internal lanes, external CLI for substantial implementation.
5. Decide Lean vs Deluxe inspector loop based on stakes:
   - **Deluxe** (parallel Claude+Codex inspection → Opus adjudication) for security-adjacent code, public releases, production migrations, payments paths.
   - **Lean** (single Opus inspector) for routine work.
6. Run the dispatch loop: assign → harvest → reassign → integrate. Keep a live ledger of every external agent (lane, cwd, write set, status, next check).
7. Always invoke the current top model for each tier — do not hardcode model names.
8. Close with a synthesis: decision, changes, verification, open risks, material findings.

The full skill payload (loop steps, agent surface table, prompt templates, builder/inspector hierarchy) is in `${CLAUDE_PLUGIN_ROOT}/skills/swarm-dispatch/SKILL.md`. Load it before dispatching.
