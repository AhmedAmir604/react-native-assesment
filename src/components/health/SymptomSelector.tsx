/**
 * SymptomSelector Component
 *
 * Multi-select chip list for symptom selection.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../utils/theme';
import { SYMPTOMS_LIST } from '../../utils/constants';

interface SymptomSelectorProps {
    selectedSymptoms: string[];
    onToggle: (symptom: string) => void;
}

const SymptomSelector: React.FC<SymptomSelectorProps> = ({
    selectedSymptoms,
    onToggle,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Symptoms</Text>
            <View style={styles.chipContainer}>
                {SYMPTOMS_LIST.map((symptom) => {
                    const isSelected = selectedSymptoms.includes(symptom);
                    return (
                        <TouchableOpacity
                            key={symptom}
                            style={[styles.chip, isSelected && styles.chipSelected]}
                            onPress={() => onToggle(symptom)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                                {symptom}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    label: {
        ...typography.label,
        marginBottom: spacing.sm,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    chip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },
    chipSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    chipText: {
        ...typography.bodySmall,
        color: colors.textPrimary,
    },
    chipTextSelected: {
        color: colors.textInverse,
        fontWeight: '600',
    },
});

export default SymptomSelector;
