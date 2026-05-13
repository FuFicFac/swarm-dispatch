# swarm-dispatch

Claude-foreman mixed-agent orchestration as a Claude-compatible plugin.

## What it does

`swarm-dispatch` turns a single Claude session into a foreman running a rolling task force. Instead of one-shot delegation, the skill drives an explicit loop — **assign → harvest → reassign → integrate** — across:

- **Internal Task-tool subagents** (Plan, Explore, general-purpose, etc.)
- **External CLI agents** — Cursor Agent CLI, Claude Code CLI, Codex CLI, Hermes CLI, Ollama

The skill names which surface is best for which lane, supervises external CLI sessions with a live ledger, and ships two inspector configurations:

- **Lean loop** — single Opus inspector. Default for routine work.
- **Deluxe loop** — parallel Claude Sonnet + Codex CLI inspection, then Opus adjudicates. For security-adjacent code, public releases, production migrations, money paths.

A core operating rule is baked in: **always use the current top model for each tier.** Model names go stale; the skill self-corrects against the current frontier.

The economic trick is model routing. Use Claude/Codex-class models for planning, inspection, and adjudication; use Cursor Agent CLI / Composer 2 as the high-throughput implementation lane when it is available.

## Components

| Component | Path | Purpose |
|---|---|---|
| Skill | `skills/swarm-dispatch/SKILL.md` | Full protocol — dispatch loop, agent surface table, builder/inspector hierarchy, prompt templates, operating rules |
| Command | `commands/swarm-dispatch.md` | `/swarm-dispatch [objective]` — explicit slash-command invocation |

## Triggering

The skill auto-loads on phrases like *swarm*, *dispatch agents*, *delegate*, *parallel agents*, *multi-agent*, *Cursor build*, *foreman the build*, *Opus inspector*, *inspector loop*.

Or invoke explicitly:

```
/swarm-dispatch ship the v2 redesign of the landing page
```

## Setup

No environment variables required. The skill inventories the local CLI fleet at runtime:

```bash
for c in cursor-agent agent claude codex hermes ollama; do command -v "$c"; done
ollama list
```

It uses whichever surfaces are installed. Missing agents are skipped, not errors.

## Installation

Package or install this folder with your Claude-compatible plugin loader. Validate with:

```bash
claude plugin validate .claude-plugin/plugin.json
```

## Genesis

## Origin

This public release is the Claude-foreman counterpart to the Codex `$swarm-dispatch` skill. Claude orchestrates instead of being orchestrated, and the high-stakes inspector loop uses parallel review plus adjudication so independent findings do not contaminate each other.

## License

MIT.
