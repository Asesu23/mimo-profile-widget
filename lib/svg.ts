import type { MimoStats } from './mimo';
import type { WidgetTheme } from './themes';

export type StatKey = 'streak' | 'coins' | 'sparks';

export const ALL_STATS: StatKey[] = ['streak', 'coins', 'sparks'];

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 200;

function escapeXml(value: unknown): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function icon(key: StatKey, color: string, card: string): string {
  if (key === 'streak') {
    return `<path fill="${color}" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.176 7.547 7.547 0 01-1.705-1.715.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z"/>`;
  }
  if (key === 'coins') {
    return `<circle cx="12" cy="12" r="10" fill="${color}"/><circle cx="12" cy="12" r="6" fill="${card}"/><circle cx="12" cy="12" r="6" fill="none" stroke="${color}" stroke-width="1.5"/>`;
  }
  return `<path fill="${color}" d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z"/>`;
}

const STAT_LABEL: Record<StatKey, string> = {
  streak: 'Streak',
  coins: 'Coins',
  sparks: 'XP',
};

export function buildSvg(stats: MimoStats, theme: WidgetTheme, visibleStats: StatKey[]): string {
  const keys = visibleStats.length > 0 ? visibleStats : ALL_STATS;
  const paddingX = 32;
  const gap = 20;
  const cardWidth = (CANVAS_WIDTH - paddingX * 2 - gap * (keys.length - 1)) / keys.length;
  const cardHeight = 100;
  const cardY = 84;
  const badgeR = 19;

  const cards = keys
    .map((key, index) => {
      const x = paddingX + index * (cardWidth + gap);
      const badgeCx = 30;
      const badgeCy = cardHeight / 2;
      return `  <g transform="translate(${x}, ${cardY})">
    <rect x="0" y="0" width="${cardWidth}" height="${cardHeight}" rx="18" fill="${theme.card}" />
    <circle cx="${badgeCx}" cy="${badgeCy}" r="${badgeR}" fill="${theme.accentFrom}22" />
    <svg x="${badgeCx - 11}" y="${badgeCy - 11}" width="22" height="22" viewBox="0 0 20 20">${icon(key, theme.accentFrom, theme.card)}</svg>
    <text x="62" y="${badgeCy - 4}" font-family="'Segoe UI', ui-sans-serif, system-ui, sans-serif" font-size="24" font-weight="700" fill="${theme.text}">${escapeXml(stats[key])}</text>
    <text x="62" y="${badgeCy + 18}" font-family="'Segoe UI', ui-sans-serif, system-ui, sans-serif" font-size="13" fill="${theme.muted}">${STAT_LABEL[key]}</text>
  </g>`;
    })
    .join('\n');

  return `<svg width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" viewBox="0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.accentFrom}" />
      <stop offset="100%" stop-color="${theme.accentTo}" />
    </linearGradient>
    <radialGradient id="glow" cx="85%" cy="10%" r="60%">
      <stop offset="0%" stop-color="${theme.accentFrom}" stop-opacity="0.18" />
      <stop offset="100%" stop-color="${theme.accentFrom}" stop-opacity="0" />
    </radialGradient>
    <clipPath id="clip"><rect x="0" y="0" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" rx="20" /></clipPath>
  </defs>

  <g clip-path="url(#clip)">
    <rect x="0" y="0" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" fill="${theme.bg}" />
    <rect x="0" y="0" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" fill="url(#glow)" />
  </g>
  <rect x="0.5" y="0.5" width="${CANVAS_WIDTH - 1}" height="${CANVAS_HEIGHT - 1}" rx="19.5" fill="none" stroke="${theme.border}" stroke-width="1" />

  <text x="${paddingX}" y="42" font-family="'Segoe UI', ui-sans-serif, system-ui, sans-serif" font-size="19" font-weight="700" fill="${theme.text}">Mimo Stats</text>
  <rect x="${paddingX}" y="52" width="44" height="4" rx="2" fill="url(#accentGradient)" />

${cards}
</svg>`;
}
