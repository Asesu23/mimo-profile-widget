'use client';

import { useMemo, useState } from 'react';
import { THEMES, DEFAULT_THEME_ID } from '@/lib/themes';
import { ALL_STATS, type StatKey } from '@/lib/svg';

type Status = 'idle' | 'connecting' | 'connected' | 'error';
type Locale = 'en' | 'ru';

const STRINGS: Record<Locale, Record<string, string>> = {
  en: {
    badge: 'unofficial · read-only',
    title: 'Mimo Profile Widget',
    subtitle: 'A live streak / XP / coins badge for your GitHub README, generated from your Mimo account.',
    emailLabel: 'Mimo email',
    passwordLabel: 'Mimo password',
    passwordNote: 'Your password is used once to sign in and is never stored or logged. Only an encrypted refresh token is kept, which you can revoke at any time. See',
    howItWorksLink: 'how this works',
    connect: 'Connect account',
    connecting: 'Connecting…',
    customize: 'Customize',
    theme: 'Theme',
    statsToShow: 'Stats to show',
    imageUrl: 'Image URL',
    readmeMarkdown: 'README markdown',
    copy: 'Copy',
    copied: 'Copied',
    disconnect: 'Disconnect and delete stored token',
    howItWorksTitle: 'How this works',
    step1: 'password → sent once, over HTTPS, to sign in',
    step2: 'password → discarded · refresh token → AES-256-GCM encrypted',
    step3: 'encrypted token → stored, keyed by a random widget id',
    step4: '/api/widget/<id> → decrypts, refreshes, renders svg, no secrets in the url',
    footerNote:
      'Mimo has no public API for this data, so this project authenticates the same way the official web app does. It is not affiliated with or endorsed by Mimo. Use at your own discretion — see the repository README for the full security notes.',
    statStreak: 'Streak',
    statCoins: 'Coins',
    statXp: 'XP',
  },
  ru: {
    badge: 'неофициально · только чтение',
    title: 'Mimo Profile Widget',
    subtitle: 'Живой бейдж со стриком, XP и монетами для GitHub README, на основе твоего аккаунта Mimo.',
    emailLabel: 'Email от Mimo',
    passwordLabel: 'Пароль от Mimo',
    passwordNote:
      'Пароль используется один раз для входа и никогда не сохраняется и не логируется. Хранится только зашифрованный refresh-токен, который можно отозвать в любой момент. Подробнее —',
    howItWorksLink: 'как это работает',
    connect: 'Подключить аккаунт',
    connecting: 'Подключаем…',
    customize: 'Настройка',
    theme: 'Тема',
    statsToShow: 'Какие статы показывать',
    imageUrl: 'Ссылка на картинку',
    readmeMarkdown: 'Markdown для README',
    copy: 'Скопировать',
    copied: 'Скопировано',
    disconnect: 'Отключить и удалить токен',
    howItWorksTitle: 'Как это работает',
    step1: 'пароль → отправляется один раз, по HTTPS, для входа',
    step2: 'пароль → удаляется · refresh-токен → шифруется AES-256-GCM',
    step3: 'зашифрованный токен → сохраняется, привязан к случайному id виджета',
    step4: '/api/widget/<id> → расшифровывает, обновляет, рендерит svg, в ссылке нет секретов',
    footerNote:
      'У Mimo нет публичного API для этих данных, поэтому проект авторизуется так же, как официальное веб-приложение. Проект не аффилирован с Mimo и не одобрен им. Используй на свой страх и риск — подробности по безопасности в README репозитория.',
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
    <main className="min-h-screen bg-surface px-6 py-16">
      <div className="mx-auto flex max-w-xl flex-col gap-12">
        <header className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{t('badge')}</span>
            <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
            <p className="text-sm text-neutral-400">{t('subtitle')}</p>
          </div>
          <button
            type="button"
            onClick={() => setLocale((current) => (current === 'en' ? 'ru' : 'en'))}
            className="shrink-0 rounded-lg border border-surface-border px-3 py-1.5 text-xs font-medium text-neutral-300 hover:border-accent hover:text-accent"
          >
            {locale === 'en' ? 'RU' : 'EN'}
          </button>
        </header>

        {status !== 'connected' && (
          <form onSubmit={handleConnect} className="flex flex-col gap-4 rounded-2xl border border-surface-border bg-surface-card p-6">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-medium text-neutral-400">
                {t('emailLabel')}
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
                {t('passwordLabel')}
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
              {t('passwordNote')}{' '}
              <a href="#how-it-works" className="text-accent underline">
                {t('howItWorksLink')}
              </a>
              .
            </p>

            {errorMessage && <p className="text-xs text-red-400">{errorMessage}</p>}

            <button
              type="submit"
              disabled={status === 'connecting'}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-soft hover:text-surface disabled:opacity-50"
            >
              {status === 'connecting' ? t('connecting') : t('connect')}
            </button>
          </form>
        )}

        {status === 'connected' && widgetId && (
          <section className="flex flex-col gap-6 rounded-2xl border border-surface-border bg-surface-card p-6">
            <img src={imageUrl} alt="Mimo stats preview" className="w-full max-w-[600px]" />

            <div className="flex flex-col gap-3">
              <span className="text-xs font-medium text-neutral-400">{t('customize')}</span>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] text-neutral-500">{t('theme')}</span>
                <div className="flex flex-wrap gap-2">
                  {Object.values(THEMES).map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setThemeId(theme.id)}
                      title={theme.name}
                      className="h-7 w-7 rounded-full border-2 transition"
                      style={{
                        background: `linear-gradient(135deg, ${theme.accentFrom}, ${theme.accentTo})`,
                        borderColor: themeId === theme.id ? theme.accentFrom : 'transparent',
                        boxShadow: themeId === theme.id ? '0 0 0 2px rgba(255,255,255,0.15)' : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] text-neutral-500">{t('statsToShow')}</span>
                <div className="flex gap-4">
                  {ALL_STATS.map((key) => (
                    <label key={key} className="flex items-center gap-1.5 text-xs text-neutral-300">
                      <input
                        type="checkbox"
                        checked={visibleStats.includes(key)}
                        onChange={() => toggleStat(key)}
                        className="accent-accent"
                      />
                      {t(STAT_LABEL_KEY[key])}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <Field label={t('imageUrl')} value={imageUrl} onCopy={() => copyToClipboard(imageUrl, 'image')} copied={copied === 'image'} copyLabel={t('copy')} copiedLabel={t('copied')} />
            <Field label={t('readmeMarkdown')} value={markdown} onCopy={() => copyToClipboard(markdown, 'markdown')} copied={copied === 'markdown'} copyLabel={t('copy')} copiedLabel={t('copied')} />

            <button
              type="button"
              onClick={handleDisconnect}
              className="self-start text-xs text-red-400 underline decoration-dotted"
            >
              {t('disconnect')}
            </button>
          </section>
        )}

        {status !== 'connected' && (
          <section id="how-it-works" className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-white">{t('howItWorksTitle')}</h2>
            <div className="flex flex-col gap-2 rounded-2xl border border-surface-border bg-surface-card p-6 font-mono text-xs text-neutral-400">
              <FlowStep step="1" text={t('step1')} />
              <FlowStep step="2" text={t('step2')} />
              <FlowStep step="3" text={t('step3')} />
              <FlowStep step="4" text={t('step4')} last />
            </div>
            <p className="text-xs text-neutral-500">{t('footerNote')}</p>
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
          {copied ? copiedLabel : copyLabel}
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
