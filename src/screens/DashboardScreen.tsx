/**
 * Dashboard Screen
 *
 * Displays logged-in user name, today's health summary,
 * and quick action buttons. State-driven UI updates.
 */

import React, { useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../store';
import { logout } from '../store/slices/authSlice';
import { loadEntries, selectTodayLatestEntry } from '../store/slices/healthSlice';
import MetricCard from '../components/health/MetricCard';
import Button from '../components/common/Button';
import {
    isHeartRateAbnormal,
    isOxygenLevelAbnormal,
    isTemperatureAbnormal,
} from '../services/alertService';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/theme';

type DashboardScreenProps = {
    navigation: NativeStackNavigationProp<any>;
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const { isLoading } = useAppSelector((state) => state.health);
    const todayEntry = useAppSelector(selectTodayLatestEntry);

    useEffect(() => {
        dispatch(loadEntries());
    }, [dispatch]);

    const onRefresh = useCallback(() => {
        dispatch(loadEntries());
    }, [dispatch]);

    const handleLogout = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);

    const getGreeting = (): string => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={colors.primary} />
            }
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>{getGreeting()}</Text>
                    <Text style={styles.userName}>{user?.name || 'User'}</Text>
                </View>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Sign Out</Text>
                </TouchableOpacity>
            </View>

            {/* Today's Summary */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Today's Vitals</Text>

                {todayEntry ? (
                    <View style={styles.metricsGrid}>
                        <View style={styles.metricsRow}>
                            <MetricCard
                                label="Heart Rate"
                                value={todayEntry.heartRate}
                                unit="bpm"
                                icon="💓"
                                isAbnormal={isHeartRateAbnormal(todayEntry.heartRate)}
                            />
                            <View style={styles.metricGap} />
                            <MetricCard
                                label="SpO2"
                                value={todayEntry.oxygenLevel}
                                unit="%"
                                icon="🫁"
                                isAbnormal={isOxygenLevelAbnormal(todayEntry.oxygenLevel)}
                            />
                        </View>
                        <View style={styles.metricsRow}>
                            <MetricCard
                                label="Temperature"
                                value={todayEntry.temperature}
                                unit="°C"
                                icon="🌡️"
                                isAbnormal={isTemperatureAbnormal(todayEntry.temperature)}
                            />
                            <View style={styles.metricGap} />
                            <MetricCard
                                label="Blood Pressure"
                                value={`${todayEntry.bloodPressure.systolic}/${todayEntry.bloodPressure.diastolic}`}
                                unit="mmHg"
                                icon="🩸"
                            />
                        </View>
                    </View>
                ) : (
                    <View style={[styles.emptyState, shadows.sm]}>
                        <Text style={styles.emptyIcon}>📊</Text>
                        <Text style={styles.emptyTitle}>No Readings Today</Text>
                        <Text style={styles.emptySubtitle}>
                            Log your first health entry to see your vitals summary here.
                        </Text>
                    </View>
                )}
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsContainer}>
                    <Button
                        title="＋  Add Health Entry"
                        onPress={() => navigation.navigate('AddHealthEntry')}
                        variant="primary"
                        style={styles.actionButton}
                    />
                    <Button
                        title="📋  View History"
                        onPress={() => navigation.navigate('HealthHistory')}
                        variant="outline"
                        style={styles.actionButton}
                    />
                </View>
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
        paddingTop: spacing.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.xl,
    },
    greeting: {
        ...typography.bodySmall,
        marginBottom: 2,
    },
    userName: {
        ...typography.h1,
    },
    logoutButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.sm,
        borderWidth: 1,
        borderColor: colors.border,
        marginTop: spacing.xs,
    },
    logoutText: {
        ...typography.bodySmall,
        fontWeight: '500',
    },
    section: {
        marginBottom: spacing.xl,
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
    metricGap: {
        width: spacing.sm,
    },
    emptyState: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.xl,
        alignItems: 'center',
    },
    emptyIcon: {
        fontSize: 40,
        marginBottom: spacing.md,
    },
    emptyTitle: {
        ...typography.h3,
        marginBottom: spacing.xs,
    },
    emptySubtitle: {
        ...typography.bodySmall,
        textAlign: 'center',
        lineHeight: 20,
    },
    actionsContainer: {
        gap: spacing.sm,
    },
    actionButton: {
        width: '100%',
    },
});

export default DashboardScreen;
