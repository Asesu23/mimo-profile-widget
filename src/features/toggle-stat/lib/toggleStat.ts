import { ALL_STATS, type StatKey } from '@entities/widget-stat';

export function toggleStatKey(current: StatKey[], key: StatKey): StatKey[] {
  if (current.includes(key)) {
    if (current.length === 1) return current;
    return current.filter((item) => item !== key);
  }
  return ALL_STATS.filter((item) => current.includes(item) || item === key);
}
