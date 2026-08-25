import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { signInWithPassword } from '@shared/api/firebase';
import { encrypt, saveWidgetToken } from '@entities/widget-token';

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

  let refreshToken: string;

  try {
    const result = await signInWithPassword(email, password);
    refreshToken = result.refreshToken;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    return NextResponse.json({ error: message }, { status: 401 });
  }

  try {
    const widgetId = randomUUID();
    await saveWidgetToken(widgetId, encrypt(refreshToken));
    return NextResponse.json({ widgetId });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to store widget token';
    return NextResponse.json(
      { error: `Login succeeded, but saving the widget failed: ${message}` },
      { status: 500 }
    );
  }
}
