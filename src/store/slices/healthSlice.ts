/**
 * Health Slice
 *
 * Redux slice for health entries state management.
 * Handles fetching, adding, and querying health data.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HealthState, HealthEntry, HealthEntryFormData } from '../../types/health';
import { fetchHealthEntries, createHealthEntry } from '../../api/healthApi';
import { RootState } from '../index';

const initialState: HealthState = {
    entries: [],
    isLoading: false,
    error: null,
};

/**
 * Async thunk: Fetch all health entries.
 */
export const loadEntries = createAsyncThunk(
    'health/loadEntries',
    async (_, { rejectWithValue }) => {
        try {
            const entries = await fetchHealthEntries();
            return entries;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to load health entries.');
        }
    },
);

/**
 * Async thunk: Add a new health entry.
 */
export const addEntry = createAsyncThunk(
    'health/addEntry',
    async (
        { formData, userId }: { formData: HealthEntryFormData; userId: string },
        { rejectWithValue },
    ) => {
        try {
            const entry = await createHealthEntry({
                userId,
                date: new Date().toISOString().split('T')[0],
                heartRate: Number(formData.heartRate),
                bloodPressure: {
                    systolic: Number(formData.systolic),
                    diastolic: Number(formData.diastolic),
                },
                oxygenLevel: Number(formData.oxygenLevel),
                temperature: Number(formData.temperature),
                symptoms: formData.symptoms,
                notes: formData.notes,
            });
            return entry;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to save health entry.');
        }
    },
);

const healthSlice = createSlice({
    name: 'health',
    initialState,
    reducers: {
        clearHealthError: (state) => {
            state.error = null;
        },
        clearEntries: (state) => {
            state.entries = [];
        },
    },
    extraReducers: (builder) => {
        // Load entries
        builder
            .addCase(loadEntries.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loadEntries.fulfilled, (state, action) => {
                state.isLoading = false;
                state.entries = action.payload;
            })
            .addCase(loadEntries.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Add entry
        builder
            .addCase(addEntry.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addEntry.fulfilled, (state, action) => {
                state.isLoading = false;
                state.entries = [action.payload, ...state.entries];
            })
            .addCase(addEntry.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

// ─── Selectors ───────────────────────────────────────────────

/**
 * Selects entries sorted by date (latest first).
 */
export const selectSortedEntries = (state: RootState): HealthEntry[] => {
    return [...state.health.entries].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
};

/**
 * Selects today's most recent health entry.
 */
export const selectTodayLatestEntry = (state: RootState): HealthEntry | null => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = state.health.entries.filter((entry) =>
        entry.date.startsWith(today),
    );

    if (todayEntries.length === 0) return null;

    return todayEntries.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0];
};

export const { clearHealthError, clearEntries } = healthSlice.actions;
export default healthSlice.reducer;
