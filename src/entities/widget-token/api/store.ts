import { getRedis } from '@shared/api/redis';

const KEY_PREFIX = 'mimo-widget:';

export async function saveWidgetToken(widgetId: string, encryptedRefreshToken: string): Promise<void> {
  await getRedis().set(`${KEY_PREFIX}${widgetId}`, encryptedRefreshToken);
}

export async function loadWidgetToken(widgetId: string): Promise<string | null> {
  return getRedis().get<string>(`${KEY_PREFIX}${widgetId}`);
}

export async function deleteWidgetToken(widgetId: string): Promise<void> {
  await getRedis().del(`${KEY_PREFIX}${widgetId}`);
}
