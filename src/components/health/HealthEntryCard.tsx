/**
 * HealthEntryCard Component
 *
 * List item card for displaying a health entry summary.
 * Used in the Health History screen.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { HealthEntry } from '../../types/health';
import {
    isHeartRateAbnormal,
    isOxygenLevelAbnormal,
    isTemperatureAbnormal,
    hasAbnormalValues,
} from '../../services/alertService';
import { colors, spacing, borderRadius, typography, shadows } from '../../utils/theme';

interface HealthEntryCardProps {
    entry: HealthEntry;
    onPress: () => void;
}

const HealthEntryCard: React.FC<HealthEntryCardProps> = ({ entry, onPress }) => {
    const abnormal = hasAbnormalValues(entry);
    const date = new Date(entry.createdAt);
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <TouchableOpacity
            style={[styles.card, shadows.sm, abnormal && styles.abnormalCard]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <View>
                    <Text style={styles.date}>{formattedDate}</Text>
                    <Text style={styles.time}>{formattedTime}</Text>
                </View>
                {abnormal && (
                    <View style={styles.warningBadge}>
                        <Text style={styles.warningText}>⚠ Alert</Text>
                    </View>
                )}
            </View>

            <View style={styles.metricsRow}>
                <MetricPill
                    label="HR"
                    value={`${entry.heartRate}`}
                    unit="bpm"
                    abnormal={isHeartRateAbnormal(entry.heartRate)}
                />
                <MetricPill
                    label="SpO2"
                    value={`${entry.oxygenLevel}`}
                    unit="%"
                    abnormal={isOxygenLevelAbnormal(entry.oxygenLevel)}
                />
                <MetricPill
                    label="Temp"
                    value={`${entry.temperature}`}
                    unit="°C"
                    abnormal={isTemperatureAbnormal(entry.temperature)}
                />
                <MetricPill
                    label="BP"
                    value={`${entry.bloodPressure.systolic}/${entry.bloodPressure.diastolic}`}
                    unit=""
                    abnormal={false}
                />
            </View>

            {entry.symptoms.length > 0 && (
                <Text style={styles.symptoms} numberOfLines={1}>
                    {entry.symptoms.join(' · ')}
                </Text>
            )}
        </TouchableOpacity>
    );
};

// ─── Inner Component: MetricPill ─────────────────────────────

interface MetricPillProps {
    label: string;
    value: string;
    unit: string;
    abnormal: boolean;
}

const MetricPill: React.FC<MetricPillProps> = ({ label, value, unit, abnormal }) => (
    <View style={[styles.pill, abnormal && styles.pillAbnormal]}>
        <Text style={[styles.pillLabel, abnormal && styles.pillAbnormalText]}>{label}</Text>
        <Text style={[styles.pillValue, abnormal && styles.pillAbnormalText]}>
            {value}
            {unit ? ` ${unit}` : ''}
        </Text>
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.borderLight,
    },
    abnormalCard: {
        borderColor: colors.error,
        borderLeftWidth: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.sm,
    },
    date: {
        ...typography.label,
        fontSize: 15,
    },
    time: {
        ...typography.caption,
        marginTop: 2,
    },
    warningBadge: {
        backgroundColor: colors.errorLight,
        borderRadius: borderRadius.full,
        paddingHorizontal: spacing.sm,
        paddingVertical: 3,
    },
    warningText: {
        color: colors.error,
        fontSize: 11,
        fontWeight: '600',
    },
    metricsRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    pill: {
        backgroundColor: colors.surfaceAlt,
        borderRadius: borderRadius.sm,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        flex: 1,
        alignItems: 'center',
    },
    pillAbnormal: {
        backgroundColor: colors.errorLight,
    },
    pillLabel: {
        ...typography.caption,
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    pillAbnormalText: {
        color: colors.error,
    },
    pillValue: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textPrimary,
        marginTop: 1,
    },
    symptoms: {
        ...typography.caption,
        color: colors.textSecondary,
    },
});

export default HealthEntryCard;
