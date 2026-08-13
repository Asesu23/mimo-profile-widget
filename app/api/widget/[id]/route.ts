import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/crypto';
import { loadWidgetToken } from '@/lib/store';
import { refreshIdToken } from '@/lib/firebase';
import { fetchMimoStats } from '@/lib/mimo';
import { buildSvg } from '@/lib/svg';

export const runtime = 'nodejs';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const encryptedRefreshToken = await loadWidgetToken(params.id);

  if (!encryptedRefreshToken) {
    return new NextResponse('Widget not found', { status: 404 });
  }

  try {
    const refreshToken = decrypt(encryptedRefreshToken);
    const idToken = await refreshIdToken(refreshToken);
    const stats = await fetchMimoStats(idToken);
    const svg = buildSvg(stats);

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
