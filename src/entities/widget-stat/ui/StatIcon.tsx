import { STAT_ICON_VIEWBOX, STREAK_ICON_PATH, SPARKS_ICON_PATH } from '../model/icons';
import type { StatKey } from '../model/types';

export function StatIcon({ statKey, className }: { statKey: StatKey; className?: string }) {
  return (
    <svg viewBox={STAT_ICON_VIEWBOX[statKey]} className={className}>
      {statKey === 'streak' && <path fill="currentColor" d={STREAK_ICON_PATH} />}
      {statKey === 'coins' && <circle cx="10" cy="10" r="8" fill="currentColor" />}
      {statKey === 'sparks' && <path fill="currentColor" d={SPARKS_ICON_PATH} />}
    </svg>
  );
}
