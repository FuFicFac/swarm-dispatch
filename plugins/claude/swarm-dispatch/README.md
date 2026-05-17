# swarm-dispatch

Claude-foreman mixed-agent orchestration as a Claude Code / Cowork plugin.

## What it does

`swarm-dispatch` turns a single Claude session into a foreman running a rolling task force. Instead of one-shot delegation, the skill drives an explicit loop — **assign → harvest → reassign → integrate** — across:

- **Internal Task-tool subagents** (Plan, Explore, general-purpose, etc.)
- **External CLI agents** — Cursor Agent CLI, Claude Code CLI, Codex CLI, Hermes CLI, Ollama

The skill names which surface is best for which lane, supervises external CLI sessions with a live ledger, and ships two inspector configurations:

- **Lean loop** — single Opus inspector. Default for routine work.
- **Deluxe loop** — parallel Claude Sonnet + Codex CLI inspection, then Opus adjudicates. For security-adjacent code, public releases, production migrations, money paths.

A core operating rule is baked in: **always use the current top model for each tier.** Model names go stale; the skill self-corrects against the current frontier.

## Recommended companion

Install this plugin alongside Addy Osmani's [`agent-skills`](https://github.com/addyosmani/agent-skills) plugin when running engineering swarms.

- `swarm-dispatch` is the orchestration layer: foreman loop, lane ownership, builder/inspector hierarchy, CLI supervision, harvest and reassignment.
- `agent-skills` is the methodology layer: `/spec`, `/plan`, `/build`, `/test`, `/review`, `/code-simplify`, `/ship`, plus SDLC skills and reviewer/test/security agents.

Use the combination for apps, sites, CLIs, infrastructure, integrations, and public-release work. Do not force it onto creative/editorial swarms that already have named rosters and prose-specific review loops.

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

Install Addy's methodology layer first:

```text
/plugin marketplace add https://github.com/addyosmani/agent-skills.git
/plugin install agent-skills@addy-agent-skills
```

Then install Swarm Dispatch from this repo or from a packaged plugin archive. Validate the plugin manifest with:

```bash
claude plugin validate .claude-plugin/plugin.json
```

## Genesis

Pattern named during a visual-site finishing pass on 2026-05-11. The Codex-foreman version made Codex the dispatcher; this is the Claude-foreman counterpart. Version 0.2.0 adds the recommended `agent-skills` methodology layer so engineering swarms have both orchestration and lane-level craft discipline.

## License

MIT.
