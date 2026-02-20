/**
 * Login Screen
 *
 * Mock authentication with form validation,
 * error handling, and loading state management.
 */

import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import { loginUser, clearAuthError } from '../store/slices/authSlice';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { colors, spacing, typography, borderRadius } from '../utils/theme';

const LoginScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isLoading, error } = useAppSelector((state) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});

    const validateForm = useCallback((): boolean => {
        const errors: { email?: string; password?: string } = {};

        if (!email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!password.trim()) {
            errors.password = 'Password is required';
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }, [email, password]);

    const handleLogin = useCallback(async () => {
        if (error) dispatch(clearAuthError());
        if (!validateForm()) return;

        dispatch(loginUser({ email: email.trim(), password }));
    }, [email, password, validateForm, dispatch, error]);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoIcon}>♡</Text>
                    </View>
                    <Text style={styles.title}>Health Tracker</Text>
                    <Text style={styles.subtitle}>
                        Monitor your vitals and stay healthy
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {error && (
                        <View style={styles.errorBanner}>
                            <Text style={styles.errorBannerText}>{error}</Text>
                        </View>
                    )}

                    <Input
                        label="Email"
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        error={formErrors.email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <Input
                        label="Password"
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            if (formErrors.password)
                                setFormErrors((prev) => ({ ...prev, password: undefined }));
                        }}
                        error={formErrors.password}
                        secureTextEntry
                        autoCapitalize="none"
                    />

                    <Button
                        title="Sign In"
                        onPress={handleLogin}
                        loading={isLoading}
                        style={styles.loginButton}
                    />

                    <Text style={styles.hint}>
                        Demo: user@example.com / password123
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xxl,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    logoContainer: {
        width: 72,
        height: 72,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    logoIcon: {
        fontSize: 32,
        color: colors.textInverse,
    },
    title: {
        ...typography.h1,
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...typography.bodySmall,
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    errorBanner: {
        backgroundColor: colors.errorLight,
        borderRadius: borderRadius.sm,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderLeftWidth: 3,
        borderLeftColor: colors.error,
    },
    errorBannerText: {
        ...typography.bodySmall,
        color: colors.error,
    },
    loginButton: {
        marginTop: spacing.sm,
    },
    hint: {
        ...typography.caption,
        textAlign: 'center',
        marginTop: spacing.lg,
    },
});

export default LoginScreen;
