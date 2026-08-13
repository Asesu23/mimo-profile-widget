import { NextRequest, NextResponse } from 'next/server';
import { deleteWidgetToken } from '@/lib/store';

export const runtime = 'nodejs';

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  await deleteWidgetToken(params.id);
  return NextResponse.json({ ok: true });
}
