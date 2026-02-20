/**
 * Input Component
 *
 * Reusable text input with label, error message, and icon support.
 */

import React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TextInputProps,
    ViewStyle,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../utils/theme';

interface InputProps extends TextInputProps {
    label: string;
    error?: string;
    containerStyle?: ViewStyle;
    suffix?: string;
}

const Input: React.FC<InputProps> = ({
    label,
    error,
    containerStyle,
    suffix,
    ...inputProps
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
                <TextInput
                    style={styles.input}
                    placeholderTextColor={colors.textTertiary}
                    {...inputProps}
                />
                {suffix && <Text style={styles.suffix}>{suffix}</Text>}
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    label: {
        ...typography.label,
        marginBottom: spacing.xs,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.sm,
        paddingHorizontal: spacing.md,
    },
    input: {
        flex: 1,
        ...typography.body,
        paddingVertical: spacing.md,
        color: colors.textPrimary,
    },
    inputError: {
        borderColor: colors.error,
        backgroundColor: colors.errorLight,
    },
    suffix: {
        ...typography.bodySmall,
        color: colors.textTertiary,
        marginLeft: spacing.sm,
    },
    errorText: {
        ...typography.caption,
        color: colors.error,
        marginTop: spacing.xs,
    },
});

export default Input;
