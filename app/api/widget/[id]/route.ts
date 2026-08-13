import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/crypto';
import { loadWidgetToken } from '@/lib/store';
import { refreshIdToken } from '@/lib/firebase';
import { fetchMimoStats } from '@/lib/mimo';
import { buildSvg, ALL_STATS, type StatKey } from '@/lib/svg';
import { resolveTheme } from '@/lib/themes';

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
    const refreshToken = decrypt(encryptedRefreshToken);
    const idToken = await refreshIdToken(refreshToken);
    const stats = await fetchMimoStats(idToken);
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
