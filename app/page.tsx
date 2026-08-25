'use client';

import { useMemo, useState } from 'react';
import { THEMES, DEFAULT_THEME_ID } from '@/lib/themes';
import { buildMascot } from '@/lib/mascot';
import { ALL_STATS, type StatKey } from '@/lib/svg';

type Status = 'idle' | 'connecting' | 'connected' | 'error';
type Locale = 'en' | 'ru';

const STRINGS: Record<Locale, Record<string, string>> = {
  en: {
    title: 'Mimo Profile Widget',
    subtitle: 'Streak, XP and coins - live, in your README.',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    howItWorks: 'How it works',
    step1: 'Password → sent once, over HTTPS',
    step2: 'Discarded → only an encrypted refresh token is kept',
    step3: 'Public URL → holds no secrets, decrypts server-side on each view',
    step4: 'Disconnect anytime to delete the stored token',
    connect: 'Connect account',
    connecting: 'Connecting…',
    theme: 'Theme',
    statsToShow: 'Stats',
    imageUrl: 'Image URL',
    readmeMarkdown: 'README markdown',
    copy: 'Copy',
    copied: 'Copied',
    disconnect: 'Disconnect',
    statStreak: 'Streak',
    statCoins: 'Coins',
    statXp: 'XP',
  },
  ru: {
    title: 'Mimo Profile Widget',
    subtitle: 'Стрик, XP и монеты - живые, прямо в README.',
    emailLabel: 'Email',
    passwordLabel: 'Пароль',
    howItWorks: 'Как это работает',
    step1: 'Пароль → отправляется один раз, по HTTPS',
    step2: 'Удаляется → остаётся только зашифрованный refresh-токен',
    step3: 'Публичная ссылка → без секретов, расшифровка на сервере при каждом просмотре',
    step4: 'Можно отключить в любой момент — токен удалится',
    connect: 'Подключить',
    connecting: 'Подключаем…',
    theme: 'Тема',
    statsToShow: 'Статы',
    imageUrl: 'Ссылка',
    readmeMarkdown: 'Markdown',
    copy: 'Копировать',
    copied: 'Скопировано',
    disconnect: 'Отключить',
    statStreak: 'Стрик',
    statCoins: 'Монеты',
    statXp: 'XP',
  },
};

const STAT_LABEL_KEY: Record<StatKey, string> = {
  streak: 'statStreak',
  coins: 'statCoins',
  sparks: 'statXp',
};

function ChipIcon({ statKey, className }: { statKey: StatKey; className?: string }) {
  if (statKey === 'streak') {
    return (
      <svg viewBox="0 0 20 20" className={className}>
        <path fill="currentColor" d="M10 2c3 4 5 7 5 10.5 0 4-2.5 6.5-5 6.5s-5-2.5-5-6.5C5 9 7 6 10 2z" />
      </svg>
    );
  }
  if (statKey === 'coins') {
    return (
      <svg viewBox="0 0 20 20" className={className}>
        <circle cx="10" cy="10" r="8" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" className={className}>
      <path
        fill="currentColor"
        d="M13.315 2.119a.833.833 0 00-1.436-.73l-9.445 10.556a.833.833 0 00.622 1.388h7.302l-1.45 6.77a.833.833 0 001.435.73l9.446-10.556a.833.833 0 00-.622-1.388h-7.302l1.45-6.77z"
      />
    </svg>
  );
}

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>('en');
  const t = (key: string) => STRINGS[locale][key] ?? key;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [widgetId, setWidgetId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<'image' | 'markdown' | null>(null);

  const [themeId, setThemeId] = useState<string>(DEFAULT_THEME_ID);
  const [visibleStats, setVisibleStats] = useState<StatKey[]>(ALL_STATS);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const activeTheme = THEMES[themeId] ?? THEMES[DEFAULT_THEME_ID];

  const imageUrl = useMemo(() => {
    if (!widgetId) return '';
    const params = new URLSearchParams();
    if (themeId !== DEFAULT_THEME_ID) params.set('theme', themeId);
    if (visibleStats.length !== ALL_STATS.length) params.set('stats', visibleStats.join(','));
    const query = params.toString();
    return `${origin}/api/widget/${widgetId}${query ? `?${query}` : ''}`;
  }, [widgetId, themeId, visibleStats, origin]);

  const markdown = widgetId ? `[![Mimo Stats](${imageUrl})](https://mimo.org)` : '';

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

  function toggleStat(key: StatKey) {
    setVisibleStats((current) => {
      if (current.includes(key)) {
        if (current.length === 1) return current;
        return current.filter((item) => item !== key);
      }
      return ALL_STATS.filter((item) => current.includes(item) || item === key);
    });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-surface px-6 py-16">
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full opacity-20 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #D946EF, transparent 70%)' }}
      />

      <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0" dangerouslySetInnerHTML={{ __html: buildMascot(activeTheme) }} />
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight text-white">{t('title')}</h1>
              <p className="text-sm text-neutral-500">{t('subtitle')}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLocale((current) => (current === 'en' ? 'ru' : 'en'))}
            className="shrink-0 rounded-full border border-surface-border px-3 py-1 font-mono text-[11px] text-neutral-400 hover:border-accent hover:text-accent"
          >
            {locale === 'en' ? 'RU' : 'EN'}
          </button>
        </header>

        {status !== 'connected' && (
          <div className="mx-auto w-full max-w-lg">
            <form onSubmit={handleConnect} className="flex flex-col gap-3 rounded-2xl border border-surface-border bg-surface-card p-5">
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-xl border border-surface-border bg-surface px-3.5 py-2.5 text-sm text-white outline-none focus:border-accent"
                placeholder={t('emailLabel')}
              />
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
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
          </div>
        )}

        {status === 'connected' && widgetId && (
          <section className="flex flex-col gap-8">
            <div className="flex flex-col gap-6 sm:flex-row">
              <aside className="flex w-full shrink-0 flex-col gap-6 sm:w-44">
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-medium text-neutral-500">{t('theme')}</span>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.values(THEMES).map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setThemeId(theme.id)}
                        title={theme.name}
                        className="h-10 rounded-xl border-2 transition"
                        style={{
                          background: `linear-gradient(135deg, ${theme.accentFrom}, ${theme.accentTo})`,
                          borderColor: themeId === theme.id ? '#FFFFFF' : 'transparent',
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-medium text-neutral-500">{t('statsToShow')}</span>
                  <div className="flex flex-col gap-2">
                    {ALL_STATS.map((key) => {
                      const active = visibleStats.includes(key);
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => toggleStat(key)}
                          className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-xs font-medium transition ${
                            active
                              ? 'border-accent bg-accent/15 text-white'
                              : 'border-transparent bg-surface-card text-neutral-500 hover:text-neutral-300'
                          }`}
                        >
                          <ChipIcon statKey={key} className="h-4 w-4" />
                          {t(STAT_LABEL_KEY[key])}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </aside>

              <div className="flex flex-1 items-center justify-center">
                <img src={imageUrl} alt="Mimo stats preview" className="w-full rounded-2xl sm:w-[33vw] sm:min-w-[220px]" />
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-surface-border pt-6">
              <Field label={t('imageUrl')} value={imageUrl} onCopy={() => copyToClipboard(imageUrl, 'image')} copied={copied === 'image'} copyLabel={t('copy')} copiedLabel={t('copied')} />
              <Field label={t('readmeMarkdown')} value={markdown} onCopy={() => copyToClipboard(markdown, 'markdown')} copied={copied === 'markdown'} copyLabel={t('copy')} copiedLabel={t('copied')} />

              <button type="button" onClick={handleDisconnect} className="self-start text-[11px] text-red-400/80 hover:text-red-400">
                {t('disconnect')}
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onCopy,
  copied,
  copyLabel,
  copiedLabel,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
  copyLabel: string;
  copiedLabel: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-medium text-neutral-500">{label}</span>
      <div className="flex items-center gap-2">
        <code className="flex-1 truncate rounded-lg border border-surface-border bg-surface px-3 py-2 text-[11px] text-neutral-400">
          {value}
        </code>
        <button
          type="button"
          onClick={onCopy}
          className="shrink-0 rounded-lg border border-surface-border px-2.5 py-2 text-[11px] text-neutral-400 hover:border-accent hover:text-accent"
        >
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
    </div>
  );
}
