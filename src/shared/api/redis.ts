import { Redis } from '@upstash/redis';

let client: Redis | null = null;

export function getRedis(): Redis {
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
