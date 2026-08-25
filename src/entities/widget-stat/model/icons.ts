import type { StatKey } from './types';

export const STAT_ICON_VIEWBOX: Record<StatKey, string> = {
  streak: '0 0 24 24',
  coins: '0 0 20 20',
  sparks: '0 0 20 20',
};

export const STREAK_ICON_PATH =
  'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z';

export const SPARKS_ICON_PATH =
  'M13.315 2.119a.833.833 0 00-1.436-.73l-9.445 10.556a.833.833 0 00.622 1.388h7.302l-1.45 6.77a.833.833 0 001.435.73l9.446-10.556a.833.833 0 00-.622-1.388h-7.302l1.45-6.77z';
