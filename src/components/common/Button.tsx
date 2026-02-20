/**
 * Button Component
 *
 * Reusable button with primary/secondary/outline variants and loading state.
 */

import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../utils/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    style,
}) => {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            style={[
                styles.base,
                variantStyles[variant],
                isDisabled && styles.disabled,
                style,
            ]}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'outline' ? colors.primary : colors.textInverse}
                    size="small"
                />
            ) : (
                <Text
                    style={[
                        styles.text,
                        variantTextStyles[variant],
                        isDisabled && styles.disabledText,
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 52,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
    disabled: {
        opacity: 0.5,
    },
    disabledText: {
        opacity: 0.7,
    },
});

const variantStyles: Record<ButtonVariant, ViewStyle> = {
    primary: {
        backgroundColor: colors.primary,
    },
    secondary: {
        backgroundColor: colors.surfaceAlt,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: colors.primary,
    },
};

const variantTextStyles: Record<ButtonVariant, TextStyle> = {
    primary: {
        color: colors.textInverse,
    },
    secondary: {
        color: colors.textPrimary,
    },
    outline: {
        color: colors.textPrimary,
    },
};

export default Button;
