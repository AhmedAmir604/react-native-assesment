/**
 * Health API (Mock)
 *
 * Simulates health data API calls backed by local storage.
 * Follows REST API patterns for easy migration to a real backend.
 */

import { HealthEntry } from '../types/health';
import { API_DELAY_MS } from '../utils/constants';
import {
    getHealthEntries,
    addHealthEntry as addToStorage,
} from '../services/storageService';

/**
 * Simulates network delay.
 */
const simulateDelay = (ms: number = API_DELAY_MS): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * GET /health-entries
 * Fetches all health entries, sorted by date (latest first).
 */
export const fetchHealthEntries = async (): Promise<HealthEntry[]> => {
    await simulateDelay();

    const entries = await getHealthEntries();

    // Sort by date, newest first
    return entries.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
};

/**
 * GET /health-entries/:id
 * Fetches a single health entry by ID.
 */
export const fetchHealthEntryById = async (id: string): Promise<HealthEntry | null> => {
    await simulateDelay(400);

    const entries = await getHealthEntries();
    return entries.find((entry) => entry.id === id) || null;
};

/**
 * POST /health-entries
 * Creates a new health entry.
 */
export const createHealthEntry = async (
    entry: Omit<HealthEntry, 'id' | 'createdAt'>,
): Promise<HealthEntry> => {
    await simulateDelay();

    const newEntry: HealthEntry = {
        ...entry,
        id: `entry_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        createdAt: new Date().toISOString(),
    };

    await addToStorage(newEntry);
    return newEntry;
};

/**
 * GET /health-entries/today
 * Fetches today's health entries.
 */
export const fetchTodayEntries = async (): Promise<HealthEntry[]> => {
    await simulateDelay(400);

    const entries = await getHealthEntries();
    const today = new Date().toISOString().split('T')[0];

    return entries
        .filter((entry) => entry.date.startsWith(today))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};
