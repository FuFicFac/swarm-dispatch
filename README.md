# Swarm Dispatch

Swarm Dispatch is a foreman pattern for running multi-agent work without letting delegated agents drift, idle, or overwrite each other.

The core loop is simple:

```text
goal preflight -> split lanes -> assign owners -> harvest results -> reassign -> integrate -> verify
```

This repo contains the public Codex skill, a Claude Code plugin version, examples, and a visual explainer published with GitHub Pages.

Live visual explainer: [https://fuficfac.github.io/swarm-dispatch/](https://fuficfac.github.io/swarm-dispatch/)

## Version 0.2.0: Methodology Layer

Swarm Dispatch is the orchestration layer: it decides how agents fan out, who owns which lane, when to inspect, when to reassign, and when the foreman can call the work done.

For engineering swarms, the recommended methodology layer is Addy Osmani's [`agent-skills`](https://github.com/addyosmani/agent-skills) repo. Addy's pack supplies the trade discipline for each lane: `/spec`, `/plan`, `/build`, `/test`, `/review`, `/code-simplify`, `/ship`, plus SDLC skills and named reviewer/test/security agents.

Use them together like this:

| Swarm Dispatch responsibility | Addy `agent-skills` responsibility |
|---|---|
| Goal preflight and finish line | `/spec` acceptance criteria and non-goals |
| Lane split and ownership | `/plan` task breakdown |
| Builder routing | `/build` incremental implementation |
| Test gate | `/test` verification discipline |
| Inspector loop | `/review` findings-first review |
| Cleanup pass | `/code-simplify` code-health pass |
| Final synthesis | `/ship` release and handoff discipline |

Scope boundary: this combined stack is for engineering work: apps, infra, CLIs, integrations, public docs, and deployable sites. Creative/editorial swarms should keep their own named rosters and prose-specific workflows.

## Why Cursor Is The Catalyst

Swarm Dispatch is also a token-efficiency strategy. The expensive frontier models are used where they matter most: architecture, decomposition, judgment, review, and final adjudication. Cursor Composer 2 can then act as the high-throughput implementation lane, turning those plans into code at predictable subscription economics.

At the time this repo was published, Cursor's public pricing listed Pro at $20/month, and Composer 2 was positioned as Cursor's specialized coding model. The point is not the exact price forever; the point is the routing pattern: keep premium-model tokens on thinking and inspection, then push bounded coding work into the specialized coding surface.

## What Is Included

| Path | Purpose |
|---|---|
| `skills/swarm-dispatch/` | Codex skill source, including Goal Preflight and the Addy methodology mapping |
| `plugins/claude/swarm-dispatch/` | Claude Code plugin source, version 0.2.0 |
| `.claude-plugin/marketplace.json` | Claude Code marketplace manifest for installing the plugin from this repo |
| `docs/index.html` | Standalone HTML visual explainer for GitHub Pages |
| `docs/pages/` | Focused explainer pages for mobile/video-friendly navigation |
| `docs/` | Public protocol notes and the Pages entrypoint |
| `site/` | Source copy of the standalone HTML visual explainer |
| `examples/` | Copyable dispatch examples |

## Install For Codex

Copy the skill folder into your Codex skills directory:

```bash
mkdir -p ~/.codex/skills
cp -R skills/swarm-dispatch ~/.codex/skills/swarm-dispatch
```

Then invoke it by asking Codex to use `$swarm-dispatch` or by asking for a swarm, foreman, delegation loop, parallel agents, or a multi-agent review.

## Install For Claude Code

Install Addy's engineering methodology layer:

```bash
claude plugin marketplace add https://github.com/addyosmani/agent-skills.git
claude plugin install agent-skills@addy-agent-skills
```

Then add this repo as a marketplace and install Swarm Dispatch:

```bash
claude plugin marketplace add https://github.com/FuFicFac/swarm-dispatch.git
claude plugin install swarm-dispatch@swarm-dispatch
```

If your Git setup redirects GitHub clones to SSH and the install fails on host-key verification, add the marketplace with the HTTPS `.git` URL and ensure the cached marketplace source uses a URL source rather than an SSH GitHub source.

Expected installed pair:

```text
agent-skills@addy-agent-skills
swarm-dispatch@swarm-dispatch
```

## Publish The Visual Explainer

GitHub Pages serves the visual explainer from:

```text
docs/
```

Configured Pages URL: [https://fuficfac.github.io/swarm-dispatch/](https://fuficfac.github.io/swarm-dispatch/)

## Safety Note

This repo is intentionally public-safe. Paths, local workspace names, personal names, and private wiki references have been replaced with generic examples.

## License

MIT.
