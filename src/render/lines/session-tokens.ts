import type { RenderContext } from '../../types.js';
import { label } from '../colors.js';
import { t } from '../../i18n/index.js';

function formatTokens(n: number): string {
  if (n >= 1000000) {
    return `${(n / 1000000).toFixed(1)}M`;
  }
  if (n >= 1000) {
    return `${(n / 1000).toFixed(0)}k`;
  }
  return n.toString();
}

export function renderSessionTokensLine(ctx: RenderContext): string | null {
  const display = ctx.config?.display;
  if (display?.showSessionTokens === false) {
    return null;
  }

  const tokens = ctx.transcript.sessionTokens;
  if (!tokens) {
    return null;
  }

  const total = tokens.inputTokens + tokens.outputTokens + tokens.cacheCreationTokens + tokens.cacheReadTokens;
  if (total === 0) {
    return null;
  }

  const colors = ctx.config?.colors;
  const parts: string[] = [
    `in: ${formatTokens(tokens.inputTokens)}`,
    `out: ${formatTokens(tokens.outputTokens)}`,
  ];

  if (tokens.cacheCreationTokens > 0 || tokens.cacheReadTokens > 0) {
    parts.push(`cache: ${formatTokens(tokens.cacheCreationTokens + tokens.cacheReadTokens)}`);
  }

  return label(`Tokens ${formatTokens(total)} (${parts.join(', ')})`, colors);
}

export function renderDailyTokensLine(ctx: RenderContext): string | null {
  const display = ctx.config?.display;
  if (!display?.showDailyTokens || !ctx.dailyTotal) {
    return null;
  }

  const dt = ctx.dailyTotal;
  const dailySum = dt.inputTokens + dt.outputTokens + dt.cacheCreationTokens + dt.cacheReadTokens;
  if (dailySum === 0) {
    return null;
  }

  const colors = ctx.config?.colors;
  const sessionLabel = dt.sessionCount > 1 ? ` (${dt.sessionCount} sessions)` : '';

  return label(`${t('label.daily')} ${formatTokens(dailySum)}${sessionLabel}`, colors);
}
