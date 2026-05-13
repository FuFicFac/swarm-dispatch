# Agent Surfaces

Swarm Dispatch is tool-agnostic. Use whatever agent surfaces are available in the local environment.

| Surface | Good Fit |
|---|---|
| Codex subagents | Parallel code exploration, bounded patches, verification, review |
| Cursor Agent CLI | Implementation lanes and app scaffolding |
| Claude Code CLI | Planning, alternate review, and Claude-native work |
| Codex CLI | Independent OpenAI-family review or implementation |
| Hermes CLI | Local workspace operations and custom agent environments |
| Ollama | Cheap summarization, classification, brainstorms, and second opinions |

The foreman should inventory the fleet at runtime and choose the cheapest capable surface for each lane.

```bash
for c in cursor-agent agent claude codex hermes ollama; do command -v "$c"; done
ollama list
```
