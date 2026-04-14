---
description: "Create/update Claude HUD config with richer default telemetry"
---

Configure Claude HUD with an information-rich profile in `~/.claude/plugins/claude-hud/config.json`.

Apply this policy:

1. Ensure config directory exists.
2. Read existing `config.json` if present.
3. Merge (do not delete unrelated keys) with these defaults:
   - `language: "zh"`
   - `lineLayout: "expanded"`
   - `pathLevels: 2`
   - `showSeparators: true`
   - `gitStatus.enabled: true`
   - `gitStatus.showDirty: true`
   - `gitStatus.showAheadBehind: true`
   - `gitStatus.showFileStats: true`
   - `display.showConfigCounts: true`
   - `display.showCost: true`
   - `display.showDuration: true`
   - `display.showSpeed: true`
   - `display.showTools: true`
   - `display.showAgents: true`
   - `display.showTodos: true`
   - `display.showSessionName: true`
   - `display.showClaudeCodeVersion: true`
   - `display.showMemoryUsage: true`
   - `display.showSessionTokens: true`
   - `display.showOutputStyle: true`
   - `display.contextValue: "both"`
4. Write back valid UTF-8 JSON.
5. Tell user to run `/reload-plugins` and start a new prompt to see updated HUD lines.
