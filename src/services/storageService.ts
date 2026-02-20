/**
 * Storage Service
 *
 * Abstraction layer for local data persistence.
 * Uses AsyncStorage for health data and SecureStore for sensitive auth data.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { HealthEntry, User } from '../types/health';
import { STORAGE_KEYS } from '../utils/constants';

// ─── Platform-aware Secure Storage ──────────────────────────
// expo-secure-store is native-only; falls back to AsyncStorage on web.

let SecureStore: {
    setItemAsync: (key: string, value: string) => Promise<void>;
    getItemAsync: (key: string) => Promise<string | null>;
    deleteItemAsync: (key: string) => Promise<void>;
};

if (Platform.OS === 'web') {
    SecureStore = {
        setItemAsync: (key, value) => AsyncStorage.setItem(`secure_${key}`, value),
        getItemAsync: (key) => AsyncStorage.getItem(`secure_${key}`),
        deleteItemAsync: (key) => AsyncStorage.removeItem(`secure_${key}`),
    };
} else {
    SecureStore = require('expo-secure-store');
}

// ─── Secure Storage (Auth) ───────────────────────────────────

/**
 * Saves auth token securely.
 */
export const saveAuthToken = async (token: string): Promise<void> => {
    await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);
};

/**
 * Retrieves the stored auth token.
 */
export const getAuthToken = async (): Promise<string | null> => {
    return await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Removes the stored auth token.
 */
export const removeAuthToken = async (): Promise<void> => {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Saves user data securely.
 */
export const saveUserData = async (user: User): Promise<void> => {
    await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
};

/**
 * Retrieves stored user data.
 */
export const getUserData = async (): Promise<User | null> => {
    const data = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
};

/**
 * Removes stored user data.
 */
export const removeUserData = async (): Promise<void> => {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
};

// ─── AsyncStorage (Health Data) ──────────────────────────────

/**
 * Saves health entries to AsyncStorage.
 */
export const saveHealthEntries = async (entries: HealthEntry[]): Promise<void> => {
    const jsonValue = JSON.stringify(entries);
    await AsyncStorage.setItem(STORAGE_KEYS.HEALTH_ENTRIES, jsonValue);
};

/**
 * Retrieves all health entries from AsyncStorage.
 */
export const getHealthEntries = async (): Promise<HealthEntry[]> => {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.HEALTH_ENTRIES);
    return jsonValue ? JSON.parse(jsonValue) : [];
};

/**
 * Adds a single health entry to storage.
 */
export const addHealthEntry = async (entry: HealthEntry): Promise<HealthEntry[]> => {
    const entries = await getHealthEntries();
    const updatedEntries = [entry, ...entries];
    await saveHealthEntries(updatedEntries);
    return updatedEntries;
};

/**
 * Clears all health data (for testing/logout).
 */
export const clearHealthData = async (): Promise<void> => {
    await AsyncStorage.removeItem(STORAGE_KEYS.HEALTH_ENTRIES);
};

/**
 * Clears all stored data (auth + health).
 */
export const clearAllData = async (): Promise<void> => {
    await removeAuthToken();
    await removeUserData();
    await clearHealthData();
};
