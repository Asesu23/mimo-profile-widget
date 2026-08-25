import { getRedis } from '@shared/api/redis';
import type { MimoStats } from '../model/types';

const CACHE_PREFIX = 'mimo-widget:stats:';
const CACHE_TTL_SECONDS = 300;

export async function getCachedStats(widgetId: string): Promise<MimoStats | null> {
  return getRedis().get<MimoStats>(`${CACHE_PREFIX}${widgetId}`);
}

export async function setCachedStats(widgetId: string, stats: MimoStats): Promise<void> {
  await getRedis().set(`${CACHE_PREFIX}${widgetId}`, stats, { ex: CACHE_TTL_SECONDS });
}
