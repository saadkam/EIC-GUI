export const theme = {
  assets: {
    // Local background image asset
    backgroundImage: require('../../src/assets/background.jpeg'),
  },
  colors: {
    // Canvas & Aura Background
    background: '#0B0813',
    auraViolet: 'rgba(99, 102, 241, 0.15)',
    auraMint: 'rgba(16, 185, 129, 0.12)',
    auraCyan: 'rgba(56, 189, 248, 0.12)',

    // Translucent Glass Surfaces & Cards
    surface: 'rgba(255, 255, 255, 0.04)',
    surfaceHeader: 'rgba(255, 255, 255, 0.03)',
    surfaceBorder: 'rgba(255, 255, 255, 0.08)',
    rowBorder: 'rgba(255, 255, 255, 0.04)',
    glassInput: 'rgba(20, 15, 38, 0.75)',

    // Aura Accent Glows
    mintGlow: '#10B981',
    mintGlowGlass: 'rgba(16,185,129,0.7)',
    mintGlowBorder: 'rgba(16, 185, 129, 0.5)',
    pinkGlow: '#F43F5E',
    pinkGlowGlass: 'rgba(244, 63, 94, 0.7)',
    pinkGlowBorder: 'rgba(244, 63, 94, 0.5)',
    cyanGlow: '#06B6D4',
    cyanGlowGlass: 'rgba(6, 182, 212, 0.7)',
    cyanGlowBorder: 'rgba(6, 182, 212, 0.5)',

    // Brand Accents
    primary: '#06B6D4',
    accentGreen: '#10B981',
    accentPink: '#F43F5E',
    accentPurple: '#A78BFA',

    // Text & Badges
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.75)',
    textMuted: 'rgba(255, 255, 255, 0.45)',
    badgeBg: 'rgba(255, 255, 255, 0.06)',
    badgeBorder: 'rgba(255, 255, 255, 0.12)',

    // Shell / Navigation
    sidebarBg: 'rgba(15, 12, 29, 0.75)',
    sidebarBorder: 'rgba(255, 255, 255, 0.0)',
  },
  spacing: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 14,
    lg: 20,
    xl: 24,
  },
  typography: {
    fontSizeSm: 11,
    fontSizeMd: 13,
    fontSizeLg: 16,
    fontSizeXl: 22,
    fontWeightNormal: '400',
    fontWeightMedium: '500',
    fontWeightBold: '700',
  },
};

export type Theme = typeof theme;