const API_ORIGIN = 'https://api.mimo.org/v1';

export interface MimoStats {
  streak: number;
  coins: number;
  sparks: number;
  username: string | null;
}

async function authorizedGet(path: string, token: string) {
  const response = await fetch(`${API_ORIGIN}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Mimo request to ${path} failed: ${response.status}`);
  }

  return response.json();
}

export async function fetchMimoStats(token: string): Promise<MimoStats> {
  const settings = await authorizedGet('/user/settings', token);
  const userId = settings.id ?? settings.userId ?? settings.user_id;

  if (!userId) {
    throw new Error('Could not resolve Mimo user id from /user/settings response');
  }

  const [profile, coinsData] = await Promise.all([
    authorizedGet(`/users/${userId}/profile`, token),
    authorizedGet('/user/coins', token),
  ]);

  const username =
    settings.username ??
    settings.displayName ??
    settings.name ??
    settings.nickname ??
    settings.handle ??
    profile.username ??
    profile.displayName ??
    profile.name ??
    profile.nickname ??
    profile.handle ??
    null;

  return {
    streak: profile.activeStreakLength ?? 0,
    sparks: profile.sparks ?? 0,
    coins: coinsData.coins ?? 0,
    username,
  };
}
