'use client';

import { useState, type FormEvent } from 'react';
import { connectAccount } from '../api/connectAccount';

export type ConnectStatus = 'idle' | 'connecting' | 'connected' | 'error';

export function useConnectAccount() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<ConnectStatus>('idle');
  const [widgetId, setWidgetId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function connect(event: FormEvent) {
    event.preventDefault();
    setStatus('connecting');
    setErrorMessage(null);

    try {
      const result = await connectAccount(email, password);
      setWidgetId(result.widgetId);
      setStatus('connected');
      setPassword('');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Login failed');
      setStatus('error');
    }
  }

  function reset() {
    setWidgetId(null);
    setStatus('idle');
  }

  return { email, setEmail, password, setPassword, status, widgetId, errorMessage, connect, reset };
}
