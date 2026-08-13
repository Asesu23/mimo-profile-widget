export interface WidgetTheme {
  id: string;
  name: string;
  bg: string;
  card: string;
  border: string;
  accentFrom: string;
  accentTo: string;
  text: string;
  muted: string;
}

export const THEMES: Record<string, WidgetTheme> = {
  dark: {
    id: 'dark',
    name: 'Dark',
    bg: '#0B0A12',
    card: '#15121F',
    border: '#2A2640',
    accentFrom: '#D946EF',
    accentTo: '#F0ABFC',
    text: '#FFFFFF',
    muted: '#9CA3AF',
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    bg: '#0A0E17',
    card: '#111827',
    border: '#1F2937',
    accentFrom: '#3B82F6',
    accentTo: '#93C5FD',
    text: '#FFFFFF',
    muted: '#94A3B8',
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    bg: '#1A0F0A',
    card: '#2A160D',
    border: '#472313',
    accentFrom: '#F97316',
    accentTo: '#FDBA74',
    text: '#FFF7ED',
    muted: '#D6A98A',
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    bg: '#08120C',
    card: '#0F1F16',
    border: '#1F3B28',
    accentFrom: '#22C55E',
    accentTo: '#86EFAC',
    text: '#F0FDF4',
    muted: '#9CC7AC',
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber',
    bg: '#04070A',
    card: '#0A0F14',
    border: '#123626',
    accentFrom: '#39FF88',
    accentTo: '#A7FFDB',
    text: '#E9FFF3',
    muted: '#5FA98A',
  },
  mono: {
    id: 'mono',
    name: 'Mono',
    bg: '#0A0A0A',
    card: '#161616',
    border: '#2B2B2B',
    accentFrom: '#E5E5E5',
    accentTo: '#FFFFFF',
    text: '#FFFFFF',
    muted: '#9CA3AF',
  },
};

export const DEFAULT_THEME_ID = 'dark';

export function resolveTheme(id: string | null | undefined): WidgetTheme {
  if (id && THEMES[id]) return THEMES[id];
  return THEMES[DEFAULT_THEME_ID];
}
