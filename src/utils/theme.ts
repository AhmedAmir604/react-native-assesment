/**
 * Theme Configuration
 *
 * Centralized design tokens for a minimal black & white modern UI.
 */

import { StyleSheet } from 'react-native';

export const colors = {
    // Primary palette
    primary: '#000000',
    primaryLight: '#1A1A1A',
    secondary: '#FFFFFF',

    // Grays
    background: '#F8F8F8',
    surface: '#FFFFFF',
    surfaceAlt: '#F0F0F0',
    border: '#E0E0E0',
    borderLight: '#EEEEEE',

    // Text
    textPrimary: '#000000',
    textSecondary: '#666666',
    textTertiary: '#999999',
    textInverse: '#FFFFFF',

    // Status
    error: '#DC3545',
    errorLight: '#FFF0F0',
    warning: '#F59E0B',
    warningLight: '#FFFBEB',
    success: '#10B981',
    successLight: '#ECFDF5',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
    shadow: 'rgba(0, 0, 0, 0.08)',
} as const;

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
} as const;

export const borderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
} as const;

export const typography = {
    h1: {
        fontSize: 28,
        fontWeight: '700' as const,
        letterSpacing: -0.5,
        color: colors.textPrimary,
    },
    h2: {
        fontSize: 22,
        fontWeight: '600' as const,
        letterSpacing: -0.3,
        color: colors.textPrimary,
    },
    h3: {
        fontSize: 18,
        fontWeight: '600' as const,
        color: colors.textPrimary,
    },
    body: {
        fontSize: 16,
        fontWeight: '400' as const,
        color: colors.textPrimary,
    },
    bodySmall: {
        fontSize: 14,
        fontWeight: '400' as const,
        color: colors.textSecondary,
    },
    caption: {
        fontSize: 12,
        fontWeight: '400' as const,
        color: colors.textTertiary,
    },
    label: {
        fontSize: 14,
        fontWeight: '500' as const,
        color: colors.textPrimary,
    },
    metric: {
        fontSize: 32,
        fontWeight: '700' as const,
        color: colors.textPrimary,
    },
} as const;

export const shadows = StyleSheet.create({
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 6,
    },
});
