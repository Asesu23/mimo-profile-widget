export async function disconnectAccount(widgetId: string): Promise<void> {
  await fetch(`/api/disconnect/${widgetId}`, { method: 'DELETE' });
}
