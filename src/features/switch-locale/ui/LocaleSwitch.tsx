import type { Locale } from '@shared/lib/i18n';

export function LocaleSwitch({ locale, onToggle }: { locale: Locale; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="shrink-0 rounded-full border border-surface-border px-3 py-1 font-mono text-[11px] text-neutral-400 hover:border-accent hover:text-accent"
    >
      {locale === 'en' ? 'RU' : 'EN'}
    </button>
  );
}
