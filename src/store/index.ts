/**
 * Redux Store Configuration
 *
 * Centralized store setup with typed hooks for use throughout the app.
 */

import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import healthReducer from './slices/healthSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        health: healthReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Allow date strings in state
        }),
});

// ─── Typed Hooks ─────────────────────────────────────────────

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/**
 * Typed dispatch hook — use this instead of plain useDispatch.
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * Typed selector hook — use this instead of plain useSelector.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
