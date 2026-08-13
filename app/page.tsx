'use client';

import { useState } from 'react';

type Status = 'idle' | 'connecting' | 'connected' | 'error';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [widgetId, setWidgetId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<'image' | 'markdown' | null>(null);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const imageUrl = widgetId ? `${origin}/api/widget/${widgetId}` : '';
  const markdown = widgetId
    ? `[![Mimo Stats](${imageUrl})](https://mimo.org)`
    : '';

  async function handleConnect(event: React.FormEvent) {
    event.preventDefault();
    setStatus('connecting');
    setErrorMessage(null);

    try {
      const response = await fetch('/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Login failed');
      }

      setWidgetId(data.widgetId);
      setStatus('connected');
      setPassword('');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Login failed');
      setStatus('error');
    }
  }

  async function handleDisconnect() {
    if (!widgetId) return;
    await fetch(`/api/disconnect/${widgetId}`, { method: 'DELETE' });
    setWidgetId(null);
    setStatus('idle');
  }

  async function copyToClipboard(value: string, kind: 'image' | 'markdown') {
    await navigator.clipboard.writeText(value);
    setCopied(kind);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <main className="min-h-screen bg-surface px-6 py-16">
      <div className="mx-auto flex max-w-xl flex-col gap-12">
        <header className="flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            unofficial · read-only
          </span>
          <h1 className="text-3xl font-bold text-white">Mimo Profile Widget</h1>
          <p className="text-sm text-neutral-400">
            A live streak / XP / coins badge for your GitHub README, generated from your Mimo account.
          </p>
        </header>

        {status !== 'connected' && (
          <form onSubmit={handleConnect} className="flex flex-col gap-4 rounded-2xl border border-surface-border bg-surface-card p-6">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-medium text-neutral-400">
                Mimo email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-white outline-none focus:border-accent"
                placeholder="you@example.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-medium text-neutral-400">
                Mimo password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-white outline-none focus:border-accent"
                placeholder="••••••••"
              />
            </div>

            <p className="text-xs leading-relaxed text-neutral-500">
              Your password is used once to sign in and is never stored or logged. Only an encrypted
              refresh token is kept, which you can revoke at any time. See{' '}
              <a href="#how-it-works" className="text-accent underline">
                how this works
              </a>
              .
            </p>

            {errorMessage && <p className="text-xs text-red-400">{errorMessage}</p>}

            <button
              type="submit"
              disabled={status === 'connecting'}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-soft hover:text-surface disabled:opacity-50"
            >
              {status === 'connecting' ? 'Connecting…' : 'Connect account'}
            </button>
          </form>
        )}

        {status === 'connected' && widgetId && (
          <section className="flex flex-col gap-4 rounded-2xl border border-surface-border bg-surface-card p-6">
            <img src={imageUrl} alt="Mimo stats preview" className="w-full max-w-[480px]" />

            <Field
              label="Image URL"
              value={imageUrl}
              onCopy={() => copyToClipboard(imageUrl, 'image')}
              copied={copied === 'image'}
            />
            <Field
              label="README markdown"
              value={markdown}
              onCopy={() => copyToClipboard(markdown, 'markdown')}
              copied={copied === 'markdown'}
            />

            <button
              type="button"
              onClick={handleDisconnect}
              className="self-start text-xs text-red-400 underline decoration-dotted"
            >
              Disconnect and delete stored token
            </button>
          </section>
        )}

        <section id="how-it-works" className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-white">How this works</h2>
          <div className="flex flex-col gap-2 rounded-2xl border border-surface-border bg-surface-card p-6 font-mono text-xs text-neutral-400">
            <FlowStep step="1" text="password → sent once, over HTTPS, to sign in" />
            <FlowStep step="2" text="password → discarded · refresh token → AES-256-GCM encrypted" />
            <FlowStep step="3" text="encrypted token → stored, keyed by a random widget id" />
            <FlowStep step="4" text="/api/widget/<id> → decrypts, refreshes, renders svg, no secrets in the url" last />
          </div>
          <p className="text-xs text-neutral-500">
            Mimo has no public API for this data, so this project authenticates the same way the
            official web app does. It is not affiliated with or endorsed by Mimo. Use at your own
            discretion — see the repository README for the full security notes.
          </p>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-neutral-400">{label}</span>
      <div className="flex items-center gap-2">
        <code className="flex-1 truncate rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-neutral-300">
          {value}
        </code>
        <button
          type="button"
          onClick={onCopy}
          className="rounded-lg border border-surface-border px-3 py-2 text-xs text-neutral-300 hover:border-accent hover:text-accent"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

function FlowStep({ step, text, last }: { step: string; text: string; last?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent text-[10px] text-accent">
        {step}
      </span>
      <span>{text}</span>
      {!last && <span className="ml-auto text-accent">↓</span>}
    </div>
  );
}
