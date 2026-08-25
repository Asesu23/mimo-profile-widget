import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

function getKey(): Buffer {
  const raw = process.env.WIDGET_ENCRYPTION_KEY;

  if (!raw) {
    throw new Error('WIDGET_ENCRYPTION_KEY environment variable is required');
  }

  const key = Buffer.from(raw, 'base64');

  if (key.length !== 32) {
    throw new Error('WIDGET_ENCRYPTION_KEY must decode to exactly 32 bytes (base64-encoded)');
  }

  return key;
}

export function encrypt(plainText: string): string {
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
}

export function decrypt(payload: string): string {
  const key = getKey();
  const buffer = Buffer.from(payload, 'base64');
  const iv = buffer.subarray(0, 12);
  const authTag = buffer.subarray(12, 28);
  const encrypted = buffer.subarray(28);

  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
}
