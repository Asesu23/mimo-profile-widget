import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { signInWithPassword } from '@/lib/firebase';
import { encrypt } from '@/lib/crypto';
import { saveWidgetToken } from '@/lib/store';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  let email: string | undefined;
  let password: string | undefined;

  try {
    const body = await request.json();
    email = body.email;
    password = body.password;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  try {
    // The password lives only in this function's memory for this single request.
    // It is never logged and never written to storage. Only the resulting
    // Firebase refresh token is persisted, and only after AES-256-GCM encryption.
    const { refreshToken } = await signInWithPassword(email, password);
    const widgetId = randomUUID();

    await saveWidgetToken(widgetId, encrypt(refreshToken));

    return NextResponse.json({ widgetId });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
