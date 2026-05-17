# Agent Surfaces

Swarm Dispatch is tool-agnostic. Use whatever agent surfaces are available in the local environment.

| Surface | Good Fit |
|---|---|
| Codex subagents | Parallel code exploration, bounded patches, verification, review |
| Cursor Agent CLI / Composer 2 | Implementation lanes, app scaffolding, and token-efficient code generation from bounded plans |
| Claude Code CLI | Planning, alternate review, and Claude-native work |
| Codex CLI | Independent OpenAI-family review or implementation |
| Hermes CLI | Local workspace operations and custom agent environments |
| Ollama | Cheap summarization, classification, brainstorms, and second opinions |

The foreman should inventory the fleet at runtime and choose the cheapest capable surface for each lane.

Cursor is the catalyst when available: use it for high-volume coding work after Claude or Codex has already clarified the plan, risks, and acceptance criteria.

For engineering swarms, install Addy Osmani's `agent-skills` beside Swarm Dispatch and use it as the lane methodology:

- `/spec` before vague work
- `/plan` before dispatching lanes
- `/build` for bounded implementation
- `/test` for verification
- `/review` for findings-first inspection
- `/code-simplify` for code health
- `/ship` for release and handoff

```bash
for c in cursor-agent agent claude codex hermes ollama; do command -v "$c"; done
ollama list
```
