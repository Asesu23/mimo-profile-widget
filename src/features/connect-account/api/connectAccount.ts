export async function connectAccount(email: string, password: string): Promise<{ widgetId: string }> {
  const response = await fetch('/api/connect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? 'Login failed');
  }

  return data;
}
