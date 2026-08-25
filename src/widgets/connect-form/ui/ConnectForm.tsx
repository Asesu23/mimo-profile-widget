import type { FormEvent } from 'react';
import type { ConnectStatus } from '@features/connect-account';

export function ConnectForm({
  email,
  password,
  status,
  errorMessage,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  t,
}: {
  email: string;
  password: string;
  status: ConnectStatus;
  errorMessage: string | null;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  t: (key: string) => string;
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 rounded-2xl border border-surface-border bg-surface-card p-5">
      <input
        type="email"
        required
        value={email}
        onChange={(event) => onEmailChange(event.target.value)}
        className="rounded-xl border border-surface-border bg-surface px-3.5 py-2.5 text-sm text-white outline-none focus:border-accent"
        placeholder={t('emailLabel')}
      />
      <input
        type="password"
        required
        value={password}
        onChange={(event) => onPasswordChange(event.target.value)}
        className="rounded-xl border border-surface-border bg-surface px-3.5 py-2.5 text-sm text-white outline-none focus:border-accent"
        placeholder={t('passwordLabel')}
      />

      {errorMessage && <p className="text-xs text-red-400">{errorMessage}</p>}

      <button
        type="submit"
        disabled={status === 'connecting'}
        className="rounded-xl bg-accent py-2.5 text-sm font-semibold text-white transition hover:bg-accent-soft hover:text-surface disabled:opacity-50"
      >
        {status === 'connecting' ? t('connecting') : t('connect')}
      </button>

      <details className="group mt-1 text-xs text-neutral-500">
        <summary className="cursor-pointer select-none list-none text-accent/80 hover:text-accent">
          {t('howItWorks')}
        </summary>
        <ul className="mt-2 flex flex-col gap-1.5 border-l border-surface-border pl-3 font-mono text-[11px] leading-relaxed">
          <li>{t('step1')}</li>
          <li>{t('step2')}</li>
          <li>{t('step3')}</li>
          <li>{t('step4')}</li>
        </ul>
      </details>
    </form>
  );
}
