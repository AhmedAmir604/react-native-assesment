/**
 * Add Health Entry Screen
 *
 * Form for logging daily health metrics with validation,
 * symptom multi-select, and health alert detection.
 */

import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../store';
import { addEntry } from '../store/slices/healthSlice';
import { validateHealthEntry, getFieldError } from '../services/validationService';
import { checkHealthAlerts, formatAlertMessages } from '../services/alertService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import SymptomSelector from '../components/health/SymptomSelector';
import { HealthEntryFormData, ValidationError, HealthEntry } from '../types/health';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/theme';

type AddHealthEntryScreenProps = {
    navigation: NativeStackNavigationProp<any>;
};

const INITIAL_FORM: HealthEntryFormData = {
    heartRate: '',
    systolic: '',
    diastolic: '',
    oxygenLevel: '',
    temperature: '',
    symptoms: [],
    notes: '',
};

const AddHealthEntryScreen: React.FC<AddHealthEntryScreenProps> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const { isLoading } = useAppSelector((state) => state.health);

    const [formData, setFormData] = useState<HealthEntryFormData>(INITIAL_FORM);
    const [errors, setErrors] = useState<ValidationError[]>([]);

    const updateField = useCallback(
        (field: keyof HealthEntryFormData, value: string) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
            // Clear error for this field on change
            if (errors.length > 0) {
                setErrors((prev) => prev.filter((e) => e.field !== field));
            }
        },
        [errors],
    );

    const toggleSymptom = useCallback((symptom: string) => {
        setFormData((prev) => ({
            ...prev,
            symptoms: prev.symptoms.includes(symptom)
                ? prev.symptoms.filter((s) => s !== symptom)
                : [...prev.symptoms, symptom],
        }));
    }, []);

    const handleSubmit = useCallback(async () => {
        // Validate form
        const validation = validateHealthEntry(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        if (!user) return;

        try {
            // Save entry
            const result = await dispatch(
                addEntry({ formData, userId: user.id }),
            ).unwrap();

            // Check for health alerts
            const alerts = checkHealthAlerts(result as HealthEntry);

            if (Platform.OS === 'web') {
                // Web: use window.alert then navigate
                if (alerts.length > 0) {
                    window.alert(`⚠️ Health Alert\n\n${formatAlertMessages(alerts)}`);
                } else {
                    window.alert('✅ Health entry saved successfully.');
                }
                navigation.goBack();
            } else {
                // Mobile: use native Alert with callback
                if (alerts.length > 0) {
                    Alert.alert(
                        '⚠️ Health Alert',
                        formatAlertMessages(alerts),
                        [{ text: 'OK', onPress: () => navigation.goBack() }],
                    );
                } else {
                    Alert.alert(
                        '✅ Success',
                        'Health entry has been saved successfully.',
                        [{ text: 'OK', onPress: () => navigation.goBack() }],
                    );
                }
            }
        } catch (err) {
            if (Platform.OS === 'web') {
                window.alert('Failed to save health entry. Please try again.');
            } else {
                Alert.alert('Error', 'Failed to save health entry. Please try again.');
            }
        }
    }, [formData, user, dispatch, navigation]);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Vital Signs Section */}
                <View style={[styles.section, shadows.sm]}>
                    <Text style={styles.sectionTitle}>Vital Signs</Text>

                    <Input
                        label="Heart Rate"
                        placeholder="e.g., 72"
                        value={formData.heartRate}
                        onChangeText={(v) => updateField('heartRate', v)}
                        error={getFieldError(errors, 'heartRate')}
                        keyboardType="numeric"
                        suffix="bpm"
                    />

                    <Text style={styles.subLabel}>Blood Pressure</Text>
                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <Input
                                label="Systolic"
                                placeholder="e.g., 120"
                                value={formData.systolic}
                                onChangeText={(v) => updateField('systolic', v)}
                                error={getFieldError(errors, 'systolic')}
                                keyboardType="numeric"
                                suffix="mmHg"
                            />
                        </View>
                        <View style={styles.halfInput}>
                            <Input
                                label="Diastolic"
                                placeholder="e.g., 80"
                                value={formData.diastolic}
                                onChangeText={(v) => updateField('diastolic', v)}
                                error={getFieldError(errors, 'diastolic')}
                                keyboardType="numeric"
                                suffix="mmHg"
                            />
                        </View>
                    </View>

                    <Input
                        label="Blood Oxygen (SpO2)"
                        placeholder="e.g., 98"
                        value={formData.oxygenLevel}
                        onChangeText={(v) => updateField('oxygenLevel', v)}
                        error={getFieldError(errors, 'oxygenLevel')}
                        keyboardType="numeric"
                        suffix="%"
                    />

                    <Input
                        label="Body Temperature"
                        placeholder="e.g., 36.6"
                        value={formData.temperature}
                        onChangeText={(v) => updateField('temperature', v)}
                        error={getFieldError(errors, 'temperature')}
                        keyboardType="decimal-pad"
                        suffix="°C"
                    />
                </View>

                {/* Symptoms Section */}
                <View style={[styles.section, shadows.sm]}>
                    <Text style={styles.sectionTitle}>Symptoms</Text>
                    <SymptomSelector
                        selectedSymptoms={formData.symptoms}
                        onToggle={toggleSymptom}
                    />
                </View>

                {/* Notes Section */}
                <View style={[styles.section, shadows.sm]}>
                    <Text style={styles.sectionTitle}>Additional Notes</Text>
                    <Input
                        label=""
                        placeholder="Any additional observations or notes..."
                        value={formData.notes}
                        onChangeText={(v) => updateField('notes', v)}
                        multiline
                        numberOfLines={4}
                        style={{ minHeight: 100, textAlignVertical: 'top' }}
                    />
                </View>

                {/* Submit */}
                <Button
                    title="Save Entry"
                    onPress={handleSubmit}
                    loading={isLoading}
                    style={styles.submitButton}
                />
            </ScrollView>
        </KeyboardAvoidingView>
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
    section: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    sectionTitle: {
        ...typography.h3,
        marginBottom: spacing.md,
    },
    subLabel: {
        ...typography.label,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    row: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    halfInput: {
        flex: 1,
    },
    submitButton: {
        marginTop: spacing.sm,
    },
});

export default AddHealthEntryScreen;
