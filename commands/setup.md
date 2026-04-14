---
description: "Configure Claude HUD statusline in ~/.claude/settings.json"
---

Set up Claude HUD for the current user by writing a valid `statusLine` command into `~/.claude/settings.json`.

Do the following steps exactly:

1. Find the installed plugin path from `~/.claude/plugins/installed_plugins.json`:
   - Prefer enabled plugin id `claude-hud@*`
   - Use the latest install entry
   - Read `installPath`
2. Verify runtime exists at `<installPath>/dist/index.js`.
   - If missing, tell the user the plugin package is incomplete and ask to reinstall/update plugin first.
3. Resolve Node runtime path from current shell (`node` executable path).
4. Update `~/.claude/settings.json`:
   - Preserve all existing keys.
   - Set:
     - `statusLine.type = "command"`
     - `statusLine.command = "\"<nodePath>\" \"<installPath>/dist/index.js\""`
     - `statusLine.padding = 0`
5. Confirm setup by reporting the final `statusLine.command` value.
6. Tell user to run `/reload-plugins` and restart Claude Code.
