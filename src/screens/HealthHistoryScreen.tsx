/**
 * Health History Screen
 *
 * Displays a list of past health entries, sorted by date (latest first).
 * Highlights abnormal values visually.
 */

import React, { useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../store';
import { loadEntries, selectSortedEntries } from '../store/slices/healthSlice';
import HealthEntryCard from '../components/health/HealthEntryCard';
import { HealthEntry } from '../types/health';
import { colors, spacing, typography } from '../utils/theme';

type HealthHistoryScreenProps = {
    navigation: NativeStackNavigationProp<any>;
};

const HealthHistoryScreen: React.FC<HealthHistoryScreenProps> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const entries = useAppSelector(selectSortedEntries);
    const { isLoading } = useAppSelector((state) => state.health);

    useEffect(() => {
        dispatch(loadEntries());
    }, [dispatch]);

    const onRefresh = useCallback(() => {
        dispatch(loadEntries());
    }, [dispatch]);

    const handleEntryPress = useCallback(
        (entry: HealthEntry) => {
            navigation.navigate('HealthEntryDetail', { entryId: entry.id });
        },
        [navigation],
    );

    const renderItem = useCallback(
        ({ item }: { item: HealthEntry }) => (
            <HealthEntryCard entry={item} onPress={() => handleEntryPress(item)} />
        ),
        [handleEntryPress],
    );

    const keyExtractor = useCallback((item: HealthEntry) => item.id, []);

    const renderEmptyState = useCallback(
        () => (
            <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📋</Text>
                <Text style={styles.emptyTitle}>No Health Records</Text>
                <Text style={styles.emptySubtitle}>
                    Your health entries will appear here once you start logging.
                </Text>
            </View>
        ),
        [],
    );

    if (isLoading && entries.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={entries}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                    />
                }
                ListEmptyComponent={renderEmptyState}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    listContent: {
        padding: spacing.lg,
        paddingBottom: spacing.xxl,
        flexGrow: 1,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing.xxl * 2,
    },
    emptyIcon: {
        fontSize: 48,
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
        paddingHorizontal: spacing.xl,
    },
});

export default HealthHistoryScreen;
