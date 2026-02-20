/**
 * MetricCard Component
 *
 * Displays a single health metric with value, unit, and label.
 * Highlights abnormal values in red.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../../utils/theme';

interface MetricCardProps {
    label: string;
    value: string | number;
    unit: string;
    isAbnormal?: boolean;
    icon?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
    label,
    value,
    unit,
    isAbnormal = false,
    icon,
}) => {
    return (
        <View style={[styles.card, shadows.md, isAbnormal && styles.abnormalCard]}>
            <View style={styles.header}>
                {icon && <Text style={styles.icon}>{icon}</Text>}
                <Text style={[styles.label, isAbnormal && styles.abnormalLabel]}>{label}</Text>
            </View>
            <View style={styles.valueRow}>
                <Text style={[styles.value, isAbnormal && styles.abnormalValue]}>
                    {value}
                </Text>
                <Text style={[styles.unit, isAbnormal && styles.abnormalUnit]}>{unit}</Text>
            </View>
            {isAbnormal && (
                <View style={styles.warningBadge}>
                    <Text style={styles.warningText}>⚠ Abnormal</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        flex: 1,
        minWidth: '45%',
    },
    abnormalCard: {
        backgroundColor: colors.errorLight,
        borderWidth: 1,
        borderColor: colors.error,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    icon: {
        fontSize: 18,
        marginRight: spacing.xs,
    },
    label: {
        ...typography.caption,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    abnormalLabel: {
        color: colors.error,
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    value: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    abnormalValue: {
        color: colors.error,
    },
    unit: {
        ...typography.bodySmall,
        marginLeft: spacing.xs,
    },
    abnormalUnit: {
        color: colors.error,
    },
    warningBadge: {
        marginTop: spacing.sm,
        backgroundColor: colors.error,
        borderRadius: borderRadius.full,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        alignSelf: 'flex-start',
    },
    warningText: {
        color: colors.textInverse,
        fontSize: 10,
        fontWeight: '600',
    },
});

export default MetricCard;
