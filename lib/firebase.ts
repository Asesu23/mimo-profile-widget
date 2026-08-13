const WEB_ORIGIN = 'https://mimo.org';
const FIREBASE_API_KEY = process.env.MIMO_FIREBASE_API_KEY ?? 'AIzaSyCmjHOtgjUJFO6Fvn6lLQDfzzVv21boYNY';
const SIGN_IN_ENDPOINT = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
const REFRESH_ENDPOINT = `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`;

interface SignInResult {
  idToken: string;
  refreshToken: string;
}

export async function signInWithPassword(email: string, password: string): Promise<SignInResult> {
  const response = await fetch(SIGN_IN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Referer: `${WEB_ORIGIN}/`,
    },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true,
      clientType: 'CLIENT_TYPE_WEB',
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.error?.message ?? 'Unknown Firebase error';
    throw new Error(`Login failed: ${message}`);
  }

  if (!data?.idToken || !data?.refreshToken) {
    throw new Error('Firebase response did not include idToken/refreshToken');
  }

  return { idToken: data.idToken, refreshToken: data.refreshToken };
}

export async function refreshIdToken(refreshToken: string): Promise<string> {
  const response = await fetch(REFRESH_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.error?.message ?? 'Unknown Firebase refresh error';
    throw new Error(`Token refresh failed: ${message}`);
  }

  if (!data?.id_token) {
    throw new Error('Firebase refresh response did not include id_token');
  }

  return data.id_token;
}
