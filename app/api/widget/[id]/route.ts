import { NextRequest, NextResponse } from 'next/server';
import { decrypt, loadWidgetToken } from '@entities/widget-token';
import { refreshIdToken } from '@shared/api/firebase';
import { fetchMimoStats, getCachedStats, setCachedStats } from '@entities/mimo-stats';
import { buildSvg } from '@shared/lib/svg/buildSvg';
import { ALL_STATS, type StatKey } from '@entities/widget-stat';
import { resolveTheme } from '@entities/widget-theme';

export const runtime = 'nodejs';

function parseVisibleStats(raw: string | null): StatKey[] {
  if (!raw) return ALL_STATS;
  const requested = raw.split(',').map((key) => key.trim());
  const valid = requested.filter((key): key is StatKey => (ALL_STATS as string[]).includes(key));
  return valid.length > 0 ? valid : ALL_STATS;
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const encryptedRefreshToken = await loadWidgetToken(params.id);

  if (!encryptedRefreshToken) {
    return new NextResponse('Widget not found', { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const theme = resolveTheme(searchParams.get('theme'));
  const visibleStats = parseVisibleStats(searchParams.get('stats'));

  try {
    let stats = await getCachedStats(params.id);

    if (!stats) {
      const refreshToken = decrypt(encryptedRefreshToken);
      const idToken = await refreshIdToken(refreshToken);
      stats = await fetchMimoStats(idToken);
      await setCachedStats(params.id, stats);
    }

    const svg = buildSvg(stats, theme, visibleStats);

    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=1800, s-maxage=1800',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new NextResponse(`<!-- mimo widget error: ${message} -->`, {
      status: 502,
      headers: { 'Content-Type': 'image/svg+xml' },
    });
  }
}
