import { ThemePicker } from '@features/select-theme';
import { StatsToggle } from '@features/toggle-stat';
import type { StatKey } from '@entities/widget-stat';

export function WidgetPreview({
  themeId,
  onThemeChange,
  visibleStats,
  onToggleStat,
  imageUrl,
  t,
}: {
  themeId: string;
  onThemeChange: (id: string) => void;
  visibleStats: StatKey[];
  onToggleStat: (key: StatKey) => void;
  imageUrl: string;
  t: (key: string) => string;
}) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      <aside className="flex w-full shrink-0 flex-col gap-6 sm:w-44">
        <ThemePicker themeId={themeId} onChange={onThemeChange} t={t} />

        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-medium text-neutral-500">{t('statsToShow')}</span>
          <StatsToggle visibleStats={visibleStats} onToggle={onToggleStat} t={t} />
        </div>
      </aside>

      <div className="flex flex-1 items-center justify-center">
        <img src={imageUrl} alt="Mimo stats preview" className="w-full rounded-2xl sm:w-[33vw] sm:min-w-[220px]" />
      </div>
    </div>
  );
}
