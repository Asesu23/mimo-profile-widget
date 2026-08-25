import { THEMES } from '@entities/widget-theme';

export function ThemePicker({
  themeId,
  onChange,
  t,
}: {
  themeId: string;
  onChange: (id: string) => void;
  t: (key: string) => string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-medium text-neutral-500">{t('theme')}</span>
      <div className="grid grid-cols-3 gap-2">
        {Object.values(THEMES).map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => onChange(theme.id)}
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
  );
}
