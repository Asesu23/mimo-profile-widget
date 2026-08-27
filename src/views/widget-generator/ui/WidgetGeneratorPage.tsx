'use client';

import { useMemo, useState } from 'react';
import { DEFAULT_THEME_ID } from '@entities/widget-theme';
import { ALL_STATS, type StatKey } from '@entities/widget-stat';
import { useConnectAccount } from '@features/connect-account';
import { disconnectAccount } from '@features/disconnect-account';
import { toggleStatKey } from '@features/toggle-stat';
import { LocaleSwitch } from '@features/switch-locale';
import { useTranslation } from '@shared/lib/i18n';
import { ConnectForm } from '@widgets/connect-form';
import { WidgetPreview } from '@widgets/widget-preview';
import { WidgetLinks } from '@widgets/widget-links';

export function WidgetGeneratorPage() {
  const { locale, setLocale, t } = useTranslation();
  const { email, setEmail, password, setPassword, status, widgetId, errorMessage, connect, reset } =
    useConnectAccount();

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

  async function handleDisconnect() {
    if (!widgetId) return;
    await disconnectAccount(widgetId);
    reset();
  }

  function toggleStat(key: StatKey) {
    setVisibleStats((current) => toggleStatKey(current, key));
  }

  const header = (
    <header className="flex flex-col items-center gap-1 text-center">
      <h1 className="text-2xl font-bold tracking-tight text-white">{t('title')}</h1>
      <p className="text-sm text-neutral-500">{t('subtitle')}</p>
    </header>
  );

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-surface px-6 py-16">
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full opacity-20 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #D946EF, transparent 70%)' }}
      />

      <div className="absolute right-6 top-6 z-10">
        <LocaleSwitch locale={locale} onToggle={() => setLocale(locale === 'en' ? 'ru' : 'en')} />
      </div>

      <div className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8">
        {status === 'connected' && widgetId ? (
          <>
            {header}
            <section className="flex flex-col gap-8">
              <WidgetPreview
                themeId={themeId}
                onThemeChange={setThemeId}
                visibleStats={visibleStats}
                onToggleStat={toggleStat}
                imageUrl={imageUrl}
                t={t}
              />
              <WidgetLinks imageUrl={imageUrl} markdown={markdown} onDisconnect={handleDisconnect} t={t} />
            </section>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-8">
            {header}
            <div className="w-full max-w-lg">
              <ConnectForm
                email={email}
                password={password}
                status={status}
                errorMessage={errorMessage}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onSubmit={connect}
                t={t}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
