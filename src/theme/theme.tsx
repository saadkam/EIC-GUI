// src/theme/theme.ts

export const theme = {
  colors: {
    // Backgrounds
    background: '#180227',    // Deep violet main screen background
    surface: '#220B38',       // Slightly lifted card/panel surface
    sidebarBg: '#1E293B',     // Dark slate sidebar background
    sidebarBorder: '#334155', // Subtle divider color
    
    // Accents & Interactive
    primary: '#38BDF8',       // Sky blue active state
    primaryHover: '#334155',  // Darker slate for icon background
    textPrimary: '#FFFFFF',
    textMuted: '#CBD5E1',
    
    // Status colors
    success: '#00F5A0',       // Neon mint green for positive metrics/sales
    danger: '#FF2E93',        // Magenta for expenses/alerts

    surfaceHeader: '#2E0F4B',
    surfaceBorder: '#3B1754',
    rowBorder: '#2C0E43',
    textSecondary: '#94A3B8',
    accentGreen: '#00F5A0',
    accentPink: '#FF2E93',
    accentBlue: '#38BDF8',
    accentPurple: '#A78BFA',
    badgeBg: '#33124D',
    cancelBg: '#334155',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  typography: {
    fontSizeSm: 12,
    fontSizeMd: 15,
    fontSizeLg: 18,
    fontWeightNormal: '500' as const,
    fontWeightBold: '700' as const,
  }
};