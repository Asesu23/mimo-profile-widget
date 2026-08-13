import { Redis } from '@upstash/redis';

const KEY_PREFIX = 'mimo-widget:';

let client: Redis | null = null;

function getRedis(): Redis {
  if (!client) {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;

    if (!url || !token) {
      throw new Error('KV_REST_API_URL and KV_REST_API_TOKEN environment variables are required');
    }

    client = new Redis({ url, token });
  }
  return client;
}

export async function saveWidgetToken(widgetId: string, encryptedRefreshToken: string): Promise<void> {
  await getRedis().set(`${KEY_PREFIX}${widgetId}`, encryptedRefreshToken);
}

export async function loadWidgetToken(widgetId: string): Promise<string | null> {
  return getRedis().get<string>(`${KEY_PREFIX}${widgetId}`);
}

export async function deleteWidgetToken(widgetId: string): Promise<void> {
  await getRedis().del(`${KEY_PREFIX}${widgetId}`);
}
