import type { MimoStats } from './mimo';

function escapeXml(value: unknown): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function buildSvg({ streak, coins, sparks }: MimoStats): string {
  const width = 480;
  const height = 150;

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D946EF" />
      <stop offset="100%" stop-color="#F0ABFC" />
    </linearGradient>
  </defs>

  <rect x="0" y="0" width="${width}" height="${height}" rx="16" fill="#0B0A12" />
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="15.5" fill="none" stroke="#2A2640" stroke-width="1" />

  <text x="24" y="34" font-family="'Segoe UI', ui-sans-serif, system-ui, sans-serif" font-size="15" font-weight="600" fill="#FFFFFF">Mimo Stats</text>
  <rect x="24" y="42" width="36" height="3" rx="1.5" fill="url(#accentGradient)" />

  <g transform="translate(24, 66)">
    <rect x="0" y="0" width="130" height="66" rx="12" fill="#15121F" />
    <text x="16" y="28" font-family="'Segoe UI Emoji', 'Noto Color Emoji', sans-serif" font-size="18">🔥</text>
    <text x="42" y="30" font-family="'Segoe UI', ui-sans-serif, system-ui, sans-serif" font-size="18" font-weight="700" fill="#FFFFFF">${escapeXml(streak)}</text>
    <text x="16" y="50" font-family="'Segoe UI', ui-sans-serif, system-ui, sans-serif" font-size="11" fill="#9CA3AF">Streak</text>
  </g>

  <g transform="translate(174, 66)">
    <rect x="0" y="0" width="130" height="66" rx="12" fill="#15121F" />
    <text x="16" y="28" font-family="'Segoe UI Emoji', 'Noto Color Emoji', sans-serif" font-size="18">🪙</text>
    <text x="42" y="30" font-family="'Segoe UI', ui-sans-serif, system-ui, sans-serif" font-size="18" font-weight="700" fill="#FFFFFF">${escapeXml(coins)}</text>
    <text x="16" y="50" font-family="'Segoe UI', ui-sans-serif, system-ui, sans-serif" font-size="11" fill="#9CA3AF">Coins</text>
  </g>

  <g transform="translate(324, 66)">
    <rect x="0" y="0" width="130" height="66" rx="12" fill="#15121F" />
    <text x="16" y="28" font-family="'Segoe UI Emoji', 'Noto Color Emoji', sans-serif" font-size="18">⚡</text>
    <text x="42" y="30" font-family="'Segoe UI', ui-sans-serif, system-ui, sans-serif" font-size="18" font-weight="700" fill="#FFFFFF">${escapeXml(sparks)}</text>
    <text x="16" y="50" font-family="'Segoe UI', ui-sans-serif, system-ui, sans-serif" font-size="11" fill="#9CA3AF">XP</text>
  </g>
</svg>`;
}
