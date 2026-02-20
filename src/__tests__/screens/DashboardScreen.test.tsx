/**
 * Dashboard Screen Component Tests
 *
 * Tests that the Dashboard correctly renders user name,
 * metric cards, empty state, and action buttons.
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import healthReducer from '../../store/slices/healthSlice';
import DashboardScreen from '../../screens/DashboardScreen';
import { RootState } from '../../store';

// ─── Mocks ───────────────────────────────────────────────────

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
    }),
}));

jest.mock('../../services/storageService', () => ({
    getHealthEntries: jest.fn().mockResolvedValue([]),
    saveHealthEntries: jest.fn().mockResolvedValue(undefined),
}));

// ─── Helpers ─────────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */
const createTestStore = (preloadedState: any) =>
    configureStore({
        reducer: {
            auth: authReducer,
            health: healthReducer,
        },
        preloadedState,
        middleware: (getDefaultMiddleware: any) =>
            getDefaultMiddleware({ serializableCheck: false }),
    } as any);

const renderWithStore = (store: any) =>
    render(
        <Provider store={store}>
            <DashboardScreen navigation={{ navigate: jest.fn() } as any} />
        </Provider>,
    );

// ─── Tests ───────────────────────────────────────────────────

describe('DashboardScreen', () => {
    it('should render the user name', () => {
        const store = createTestStore({
            auth: {
                user: { id: 'usr_001', name: 'John Doe', email: 'user@example.com' },
                token: 'mock_token',
                isLoading: false,
                error: null,
            },
            health: {
                entries: [],
                isLoading: false,
                error: null,
            },
        });

        const { getByText } = renderWithStore(store);
        expect(getByText('John Doe')).toBeTruthy();
    });

    it('should show empty state when no entries exist', () => {
        const store = createTestStore({
            auth: {
                user: { id: 'usr_001', name: 'John Doe', email: 'user@example.com' },
                token: 'mock_token',
                isLoading: false,
                error: null,
            },
            health: {
                entries: [],
                isLoading: false,
                error: null,
            },
        });

        const { getByText } = renderWithStore(store);
        expect(getByText('No Readings Today')).toBeTruthy();
    });

    it('should render quick action buttons', () => {
        const store = createTestStore({
            auth: {
                user: { id: 'usr_001', name: 'John Doe', email: 'user@example.com' },
                token: 'mock_token',
                isLoading: false,
                error: null,
            },
            health: {
                entries: [],
                isLoading: false,
                error: null,
            },
        });

        const { getByText } = renderWithStore(store);
        expect(getByText('＋  Add Health Entry')).toBeTruthy();
        expect(getByText('📋  View History')).toBeTruthy();
    });

    it('should display health metrics when today entry exists', () => {
        const today = new Date().toISOString().split('T')[0];
        const store = createTestStore({
            auth: {
                user: { id: 'usr_001', name: 'John Doe', email: 'user@example.com' },
                token: 'mock_token',
                isLoading: false,
                error: null,
            },
            health: {
                entries: [
                    {
                        id: 'entry_1',
                        userId: 'usr_001',
                        date: today,
                        heartRate: 75,
                        bloodPressure: { systolic: 120, diastolic: 80 },
                        oxygenLevel: 98,
                        temperature: 36.6,
                        symptoms: [],
                        notes: '',
                        createdAt: new Date().toISOString(),
                    },
                ],
                isLoading: false,
                error: null,
            },
        });

        const { getByText } = renderWithStore(store);
        expect(getByText('75')).toBeTruthy();
        expect(getByText('98')).toBeTruthy();
    });
});
