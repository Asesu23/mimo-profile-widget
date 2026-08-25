import { ALL_STATS, StatIcon, type StatKey } from '@entities/widget-stat';

const STAT_LABEL_KEY: Record<StatKey, string> = {
  streak: 'statStreak',
  coins: 'statCoins',
  sparks: 'statXp',
};

export function StatsToggle({
  visibleStats,
  onToggle,
  t,
}: {
  visibleStats: StatKey[];
  onToggle: (key: StatKey) => void;
  t: (key: string) => string;
}) {
  return (
    <div className="flex flex-col gap-2">
      {ALL_STATS.map((key) => {
        const active = visibleStats.includes(key);
        return (
          <button
            key={key}
            type="button"
            onClick={() => onToggle(key)}
            className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-xs font-medium transition ${
              active
                ? 'border-accent bg-accent/15 text-white'
                : 'border-transparent bg-surface-card text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <StatIcon statKey={key} className="h-4 w-4" />
            {t(STAT_LABEL_KEY[key])}
          </button>
        );
      })}
    </div>
  );
}
