---
description: "Configure Claude HUD using official presets (recommend Essential)"
---

Configure Claude HUD in `~/.claude/plugins/claude-hud/config.json` using only documented options from the official README presets.

Apply this policy:

1. Ensure config directory exists.
2. Read existing `config.json` if present.
3. Ask the user which official preset they want (`Full`, `Essential`, `Minimal`). If they do not specify, use `Essential`.
4. Merge (do not delete unrelated keys) with preset values:
   - Shared:
   - `language: "zh"`
   - `lineLayout: "expanded"`
   - `pathLevels: 2`
   - `showSeparators: false`
   - `gitStatus.enabled: true`
   - `gitStatus.showDirty: true`
   - `display.contextValue: "percent"`
   - `display.showUsage: true`
   - `Essential`:
   - `gitStatus.showAheadBehind: true`
   - `gitStatus.showFileStats: false`
   - `display.showTools: true`
   - `display.showAgents: true`
   - `display.showTodos: true`
   - `display.showDuration: false`
   - `display.showCost: false`
   - `display.showMemoryUsage: false`
   - `display.showSessionTokens: false`
   - `display.showOutputStyle: false`
   - `display.showConfigCounts: false`
   - `Full`:
   - `gitStatus.showAheadBehind: true`
   - `gitStatus.showFileStats: true`
   - `display.showTools: true`
   - `display.showAgents: true`
   - `display.showTodos: true`
   - `display.showDuration: true`
   - `display.showCost: true`
   - `display.showMemoryUsage: true`
   - `display.showSessionTokens: true`
   - `display.showOutputStyle: true`
   - `display.showConfigCounts: true`
   - `Minimal`:
   - `gitStatus.showAheadBehind: false`
   - `gitStatus.showFileStats: false`
   - `display.showTools: false`
   - `display.showAgents: false`
   - `display.showTodos: false`
   - `display.showDuration: false`
   - `display.showCost: false`
   - `display.showMemoryUsage: false`
   - `display.showSessionTokens: false`
   - `display.showOutputStyle: false`
   - `display.showConfigCounts: false`
5. Write back valid UTF-8 JSON.
6. Tell user to run `/reload-plugins` and start a new prompt to see updated HUD lines.
