// Tokens do design aprovado (protótipo em openspec/config.yaml).

export type ColorTokens = {
  bg: string;
  surface: string;
  surface2: string;
  ink: string;
  muted: string;
  line: string;
  accent: string;
  onAccent: string;
  accentSoft: string;
  accentText: string;
  warn: string;
  warnSoft: string;
  code: string;
  codeInk: string;
  codeMuted: string;
  track: string;
};

export type ColorScheme = 'light' | 'dark';

export const palettes: Record<ColorScheme, ColorTokens> = {
  light: {
    bg: '#F3F4F7',
    surface: '#FFFFFF',
    surface2: '#ECEEF3',
    ink: '#121722',
    muted: '#596172',
    line: '#DCDFE6',
    accent: '#2D4BE0',
    onAccent: '#FFFFFF',
    accentSoft: '#E4E9FD',
    accentText: '#2440C8',
    warn: '#A4460B',
    warnSoft: '#FCECDF',
    code: '#0F141B',
    codeInk: '#DCE3EC',
    codeMuted: '#8C97A6',
    track: '#E2E5EB',
  },
  dark: {
    bg: '#0C1015',
    surface: '#151B23',
    surface2: '#1D252F',
    ink: '#E7ECF2',
    muted: '#9BA6B4',
    line: '#273140',
    accent: '#8296FF',
    onAccent: '#0A0F1F',
    accentSoft: '#1E2747',
    accentText: '#A9B6FF',
    warn: '#FFA466',
    warnSoft: '#3A2517',
    code: '#070A0E',
    codeInk: '#DCE3EC',
    codeMuted: '#7E8A99',
    track: '#232C37',
  },
};

/** Famílias carregadas no layout raiz. `undefined` = fonte do sistema. */
export const fontFamilies = {
  regular: 'IBMPlexSans_400Regular',
  medium: 'IBMPlexSans_500Medium',
  semibold: 'IBMPlexSans_600SemiBold',
  bold: 'IBMPlexSans_700Bold',
  mono: 'JetBrainsMono_400Regular',
  monoMedium: 'JetBrainsMono_500Medium',
} as const;

export type FontRole = keyof typeof fontFamilies;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;
export const radius = { sm: 8, md: 12, lg: 16, xl: 22 } as const;
