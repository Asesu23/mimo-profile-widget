export interface WidgetTheme {
  id: string;
  name: string;
  bg: string;
  bgTo: string;
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
    bg: '#120B1F',
    bgTo: '#1F1030',
    card: '#15121F',
    border: '#2A2640',
    accentFrom: '#D946EF',
    accentTo: '#F0ABFC',
    text: '#FFFFFF',
    muted: '#B4AFC4',
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    bg: '#0A0E17',
    bgTo: '#0D1B33',
    card: '#111827',
    border: '#1F2937',
    accentFrom: '#3B82F6',
    accentTo: '#93C5FD',
    text: '#FFFFFF',
    muted: '#A9B6CC',
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    bg: '#1A0F0A',
    bgTo: '#33170D',
    card: '#2A160D',
    border: '#472313',
    accentFrom: '#F97316',
    accentTo: '#FDBA74',
    text: '#FFF7ED',
    muted: '#E4B99B',
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    bg: '#08120C',
    bgTo: '#0E2617',
    card: '#0F1F16',
    border: '#1F3B28',
    accentFrom: '#22C55E',
    accentTo: '#86EFAC',
    text: '#F0FDF4',
    muted: '#ABD9BC',
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber',
    bg: '#04070A',
    bgTo: '#06231A',
    card: '#0A0F14',
    border: '#123626',
    accentFrom: '#39FF88',
    accentTo: '#A7FFDB',
    text: '#E9FFF3',
    muted: '#7FCBA9',
  },
  mono: {
    id: 'mono',
    name: 'Mono',
    bg: '#0A0A0A',
    bgTo: '#1C1C1C',
    card: '#161616',
    border: '#2B2B2B',
    accentFrom: '#E5E5E5',
    accentTo: '#FFFFFF',
    text: '#FFFFFF',
    muted: '#ADADAD',
  },
};

export const DEFAULT_THEME_ID = 'dark';

export function resolveTheme(id: string | null | undefined): WidgetTheme {
  if (id && THEMES[id]) return THEMES[id];
  return THEMES[DEFAULT_THEME_ID];
}
