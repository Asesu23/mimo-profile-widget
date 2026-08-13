import type { MimoStats } from './mimo';
import type { WidgetTheme } from './themes';

export type StatKey = 'streak' | 'coins' | 'sparks';

export const ALL_STATS: StatKey[] = ['streak', 'coins', 'sparks'];

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 200;

const STAT_META: Record<StatKey, { emoji: string; label: string }> = {
  streak: { emoji: '🔥', label: 'Streak' },
  coins: { emoji: '🪙', label: 'Coins' },
  sparks: { emoji: '⚡', label: 'XP' },
};

function escapeXml(value: unknown): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function buildSvg(stats: MimoStats, theme: WidgetTheme, visibleStats: StatKey[]): string {
  const keys = visibleStats.length > 0 ? visibleStats : ALL_STATS;
  const paddingX = 32;
  const gap = 20;
  const cardWidth = (CANVAS_WIDTH - paddingX * 2 - gap * (keys.length - 1)) / keys.length;
  const cardHeight = 96;
  const cardY = 88;

  const cards = keys
    .map((key, index) => {
      const x = paddingX + index * (cardWidth + gap);
      const meta = STAT_META[key];
      return `  <g transform="translate(${x}, ${cardY})">
    <rect x="0" y="0" width="${cardWidth}" height="${cardHeight}" rx="16" fill="${theme.card}" />
    <text x="20" y="38" font-family="'Segoe UI Emoji', 'Noto Color Emoji', sans-serif" font-size="26">${meta.emoji}</text>
    <text x="56" y="42" font-family="'Segoe UI', ui-sans-serif, system-ui, sans-serif" font-size="26" font-weight="700" fill="${theme.text}">${escapeXml(stats[key])}</text>
    <text x="20" y="72" font-family="'Segoe UI', ui-sans-serif, system-ui, sans-serif" font-size="14" fill="${theme.muted}">${meta.label}</text>
  </g>`;
    })
    .join('\n');

  return `<svg width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" viewBox="0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.accentFrom}" />
      <stop offset="100%" stop-color="${theme.accentTo}" />
    </linearGradient>
  </defs>

  <rect x="0" y="0" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" rx="20" fill="${theme.bg}" />
  <rect x="0.5" y="0.5" width="${CANVAS_WIDTH - 1}" height="${CANVAS_HEIGHT - 1}" rx="19.5" fill="none" stroke="${theme.border}" stroke-width="1" />

  <text x="${paddingX}" y="44" font-family="'Segoe UI', ui-sans-serif, system-ui, sans-serif" font-size="20" font-weight="600" fill="${theme.text}">Mimo Stats</text>
  <rect x="${paddingX}" y="54" width="48" height="4" rx="2" fill="url(#accentGradient)" />

${cards}
</svg>`;
}
