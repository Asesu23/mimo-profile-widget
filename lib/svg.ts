import type { MimoStats } from './mimo';
import type { WidgetTheme } from './themes';
import { buildMascot } from './mascot';

export type StatKey = 'streak' | 'coins' | 'sparks';

export const ALL_STATS: StatKey[] = ['streak', 'coins', 'sparks'];

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 210;

function escapeXml(value: unknown): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

// All icons share a single 20x20 coordinate system so none of them can render
// outside their allotted box.
function icon(key: StatKey, color: string, card: string): string {
  if (key === 'streak') {
    return `<path fill="${color}" d="M10 2c3 4 5 7 5 10.5 0 4-2.5 6.5-5 6.5s-5-2.5-5-6.5C5 9 7 6 10 2z"/><path fill="${card}" d="M10 7.5c1.4 1.8 2.3 3.2 2.3 5 0 2-1 3.5-2.3 3.5s-2.3-1.5-2.3-3.5c0-1.8.9-3.2 2.3-5z"/>`;
  }
  if (key === 'coins') {
    return `<circle cx="10" cy="10" r="8.5" fill="${color}"/><text x="10" y="14" text-anchor="middle" font-family="'Segoe UI', ui-sans-serif, system-ui, sans-serif" font-size="12" font-weight="800" fill="${card}">$</text>`;
  }
  return `<path fill="${color}" d="M13.315 2.119a.833.833 0 00-1.436-.73l-9.445 10.556a.833.833 0 00.622 1.388h7.302l-1.45 6.77a.833.833 0 001.435.73l9.446-10.556a.833.833 0 00-.622-1.388h-7.302l1.45-6.77z"/>`;
}

const STAT_LABEL: Record<StatKey, string> = {
  streak: 'Streak',
  coins: 'Coins',
  sparks: 'XP',
};

export function buildSvg(stats: MimoStats, theme: WidgetTheme, visibleStats: StatKey[]): string {
  const keys = visibleStats.length > 0 ? visibleStats : ALL_STATS;
  const paddingX = 28;
  const gap = 18;
  const cardWidth = (CANVAS_WIDTH - paddingX * 2 - gap * (keys.length - 1)) / keys.length;
  const cardHeight = 100;
  const cardY = 92;
  const badgeR = 19;

  const cards = keys
    .map((key, index) => {
      const x = paddingX + index * (cardWidth + gap);
      const badgeCx = cardWidth / 2;
      const badgeCy = 36;
      return `  <g transform="translate(${x}, ${cardY})">
    <rect x="0.5" y="0.5" width="${cardWidth - 1}" height="${cardHeight - 1}" rx="18" fill="#FFFFFF12" stroke="${theme.accentFrom}40" stroke-width="1.5" />
    <circle cx="${badgeCx}" cy="${badgeCy}" r="${badgeR}" fill="${theme.accentFrom}26" />
    <svg x="${badgeCx - 10}" y="${badgeCy - 10}" width="20" height="20" viewBox="0 0 20 20">${icon(key, theme.accentFrom, theme.bg)}</svg>
    <text x="${cardWidth / 2}" y="78" text-anchor="middle" font-family="'Segoe UI', ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="700" fill="${theme.text}">${escapeXml(stats[key])}</text>
    <text x="${cardWidth / 2}" y="95" text-anchor="middle" font-family="'Segoe UI', ui-sans-serif, system-ui, sans-serif" font-size="11" fill="${theme.muted}">${STAT_LABEL[key]}</text>
  </g>`;
    })
    .join('\n');

  const avatarHeight = 46;
  const avatarWidth = (140 / 156) * avatarHeight;
  const avatarY = 16;
  const username = stats.username ? truncate(stats.username, 22) : null;

  const header = `  <svg x="${paddingX}" y="${avatarY}" width="${avatarWidth.toFixed(1)}" height="${avatarHeight}" viewBox="0 0 140 156">${buildMascot(theme)}</svg>${
    username
      ? `\n  <text x="${paddingX + avatarWidth + 20}" y="${avatarY + avatarHeight / 2 + 6}" font-family="'Segoe UI', ui-sans-serif, system-ui, sans-serif" font-size="18" font-weight="700" fill="${theme.text}">${escapeXml(username)}</text>`
      : ''
  }`;

  return `<svg width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" viewBox="0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg}" />
      <stop offset="100%" stop-color="${theme.bgTo}" />
    </linearGradient>
    <radialGradient id="glow" cx="88%" cy="6%" r="65%">
      <stop offset="0%" stop-color="${theme.accentFrom}" stop-opacity="0.28" />
      <stop offset="100%" stop-color="${theme.accentFrom}" stop-opacity="0" />
    </radialGradient>
    <clipPath id="clip"><rect x="0" y="0" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" rx="22" /></clipPath>
  </defs>

  <g clip-path="url(#clip)">
    <rect x="0" y="0" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" fill="url(#bgGradient)" />
    <rect x="0" y="0" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" fill="url(#glow)" />
  </g>
  <rect x="0.5" y="0.5" width="${CANVAS_WIDTH - 1}" height="${CANVAS_HEIGHT - 1}" rx="21.5" fill="none" stroke="${theme.border}" stroke-width="1" />

${header}
${cards}
</svg>`;
}
