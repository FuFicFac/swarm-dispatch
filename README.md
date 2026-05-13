# Swarm Dispatch

Swarm Dispatch is a foreman pattern for running multi-agent work without letting delegated agents drift, idle, or overwrite each other.

The core loop is simple:

```text
frame the finish line -> split lanes -> assign owners -> harvest results -> reassign -> integrate -> verify
```

This repo contains the public Codex skill, a Claude-compatible plugin version, examples, and a visual explainer that can be published with GitHub Pages.

## What Is Included

| Path | Purpose |
|---|---|
| `skills/swarm-dispatch/` | Codex skill source |
| `plugins/claude/swarm-dispatch/` | Claude-compatible plugin source |
| `docs/index.html` | Standalone HTML visual explainer for GitHub Pages |
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

## Install For Claude-Compatible Plugin Loaders

Use the source folder at:

```text
plugins/claude/swarm-dispatch
```

If your loader expects a packaged plugin file, zip that folder and install the resulting archive through the loader. The plugin entrypoint is:

```text
plugins/claude/swarm-dispatch/.claude-plugin/plugin.json
```

## Publish The Visual Explainer

GitHub Pages can serve the visual explainer from:

```text
docs/
```

Configure Pages to use the `main` branch and `/docs` folder. The expected URL format is:

```text
https://<github-user>.github.io/swarm-dispatch/
```

## Safety Note

This repo is intentionally public-safe. Paths, local workspace names, personal names, and private wiki references have been replaced with generic examples.

## License

MIT.
