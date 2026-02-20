/**
 * Health Entry Detail Screen
 *
 * Displays full details of a single health entry.
 * Highlights abnormal values visually.
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { useAppSelector } from '../store';
import MetricCard from '../components/health/MetricCard';
import {
    isHeartRateAbnormal,
    isOxygenLevelAbnormal,
    isTemperatureAbnormal,
    checkHealthAlerts,
} from '../services/alertService';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/theme';

type HealthEntryDetailScreenProps = {
    route: RouteProp<{ params: { entryId: string } }, 'params'>;
};

const HealthEntryDetailScreen: React.FC<HealthEntryDetailScreenProps> = ({ route }) => {
    const { entryId } = route.params;
    const entry = useAppSelector((state) =>
        state.health.entries.find((e) => e.id === entryId),
    );

    const alerts = useMemo(() => {
        if (!entry) return [];
        return checkHealthAlerts(entry);
    }, [entry]);

    if (!entry) {
        return (
            <View style={styles.notFound}>
                <Text style={styles.notFoundText}>Entry not found.</Text>
            </View>
        );
    }

    const date = new Date(entry.createdAt);
    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            {/* Date Header */}
            <View style={styles.dateHeader}>
                <Text style={styles.date}>{formattedDate}</Text>
                <Text style={styles.time}>{formattedTime}</Text>
            </View>

            {/* Alerts Banner */}
            {alerts.length > 0 && (
                <View style={[styles.alertBanner, shadows.sm]}>
                    <Text style={styles.alertTitle}>⚠️ Health Alerts</Text>
                    {alerts.map((alert) => (
                        <Text key={alert.id} style={styles.alertMessage}>
                            • {alert.message}
                        </Text>
                    ))}
                </View>
            )}

            {/* Vital Signs Grid */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Vital Signs</Text>
                <View style={styles.metricsGrid}>
                    <View style={styles.metricsRow}>
                        <MetricCard
                            label="Heart Rate"
                            value={entry.heartRate}
                            unit="bpm"
                            icon="💓"
                            isAbnormal={isHeartRateAbnormal(entry.heartRate)}
                        />
                        <View style={styles.gap} />
                        <MetricCard
                            label="SpO2"
                            value={entry.oxygenLevel}
                            unit="%"
                            icon="🫁"
                            isAbnormal={isOxygenLevelAbnormal(entry.oxygenLevel)}
                        />
                    </View>
                    <View style={styles.metricsRow}>
                        <MetricCard
                            label="Temperature"
                            value={entry.temperature}
                            unit="°C"
                            icon="🌡️"
                            isAbnormal={isTemperatureAbnormal(entry.temperature)}
                        />
                        <View style={styles.gap} />
                        <MetricCard
                            label="Blood Pressure"
                            value={`${entry.bloodPressure.systolic}/${entry.bloodPressure.diastolic}`}
                            unit="mmHg"
                            icon="🩸"
                        />
                    </View>
                </View>
            </View>

            {/* Symptoms */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Symptoms</Text>
                {entry.symptoms.length > 0 ? (
                    <View style={styles.symptomsContainer}>
                        {entry.symptoms.map((symptom) => (
                            <View key={symptom} style={styles.symptomChip}>
                                <Text style={styles.symptomText}>{symptom}</Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <Text style={styles.noData}>No symptoms reported</Text>
                )}
            </View>

            {/* Notes */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notes</Text>
                <Text style={styles.notes}>
                    {entry.notes || 'No additional notes'}
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.lg,
        paddingBottom: spacing.xxl,
    },
    notFound: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    notFoundText: {
        ...typography.body,
        color: colors.textSecondary,
    },
    dateHeader: {
        marginBottom: spacing.lg,
    },
    date: {
        ...typography.h2,
    },
    time: {
        ...typography.bodySmall,
        marginTop: spacing.xs,
    },
    alertBanner: {
        backgroundColor: colors.errorLight,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.lg,
        borderLeftWidth: 3,
        borderLeftColor: colors.error,
    },
    alertTitle: {
        ...typography.label,
        color: colors.error,
        marginBottom: spacing.sm,
    },
    alertMessage: {
        ...typography.bodySmall,
        color: colors.error,
        lineHeight: 22,
    },
    section: {
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        ...typography.h3,
        marginBottom: spacing.md,
    },
    metricsGrid: {
        gap: spacing.sm,
    },
    metricsRow: {
        flexDirection: 'row',
    },
    gap: {
        width: spacing.sm,
    },
    symptomsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    symptomChip: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.full,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    symptomText: {
        ...typography.bodySmall,
        color: colors.textInverse,
        fontWeight: '500',
    },
    noData: {
        ...typography.bodySmall,
        color: colors.textTertiary,
        fontStyle: 'italic',
    },
    notes: {
        ...typography.body,
        lineHeight: 24,
        color: colors.textSecondary,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.sm,
        padding: spacing.md,
    },
});

export default HealthEntryDetailScreen;
