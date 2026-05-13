# Local Smoke Test

Use this checklist after installing the skill or plugin.

## Codex Skill

```text
Use $swarm-dispatch to inspect this repo and propose a two-agent plan for improving the README. Do not edit files yet.
```

Expected behavior:

- The foreman names a finish line.
- It splits the work into bounded lanes.
- It keeps one immediate task local.
- It avoids assigning overlapping write sets.

## Claude-Compatible Plugin

```text
/swarm-dispatch review this public docs package for privacy leaks and publish-readiness
```

Expected behavior:

- The plugin frames the task as a foreman loop.
- It chooses lean or deluxe inspection based on risk.
- It reports findings before applying fixes.
