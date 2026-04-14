import type { RenderContext } from '../types.js';
import { yellow, green, red, cyan, label } from './colors.js';

export function renderToolsLine(ctx: RenderContext): string | null {
  const { tools } = ctx.transcript;
  const colors = ctx.config?.colors;

  if (tools.length === 0) {
    return null;
  }

  const parts: string[] = [];

  const runningTools = tools.filter((t) => t.status === 'running');
  const completedTools = tools.filter((t) => t.status === 'completed');
  const erroredTools = tools.filter((t) => t.status === 'error');

  for (const tool of runningTools.slice(-2)) {
    const target = tool.target ? truncatePath(tool.target) : '';
    parts.push(`${yellow('●')} ${cyan(tool.name)}${target ? label(`: ${target}`, colors) : ''}`);
  }

  const completedCounts = new Map<string, number>();
  for (const tool of completedTools) {
    completedCounts.set(tool.name, (completedCounts.get(tool.name) ?? 0) + 1);
  }

  const sortedCompleted = Array.from(completedCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  for (const [name, count] of sortedCompleted) {
    parts.push(`${green('✓')} ${name} ${label(`x${count}`, colors)}`);
  }

  if (erroredTools.length > 0) {
    parts.push(`${red('✗')} ${label(`errors x${erroredTools.length}`, colors)}`);
  }

  return parts.length > 0 ? parts.join(' | ') : null;
}

function truncatePath(path: string, maxLen: number = 20): string {
  const normalizedPath = path.replace(/\\/g, '/');

  if (normalizedPath.length <= maxLen) return normalizedPath;

  const parts = normalizedPath.split('/');
  const filename = parts.pop() || normalizedPath;

  if (filename.length >= maxLen) {
    return filename.slice(0, maxLen - 3) + '...';
  }

  return '.../' + filename;
}
