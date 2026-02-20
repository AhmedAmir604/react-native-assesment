/**
 * Auth Slice
 *
 * Redux slice for authentication state management.
 * Handles login, logout, and session persistence.
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginCredentials } from '../../types/health';
import { loginApi } from '../../api/authApi';
import {
    saveAuthToken,
    saveUserData,
    removeAuthToken,
    removeUserData,
    getAuthToken,
    getUserData,
} from '../../services/storageService';

const initialState: AuthState = {
    user: null,
    token: null,
    isLoading: false,
    error: null,
};

/**
 * Async thunk: Login user with credentials.
 */
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const response = await loginApi(credentials);
            // Persist auth data securely
            await saveAuthToken(response.token);
            await saveUserData(response.user);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Login failed. Please try again.');
        }
    },
);

/**
 * Async thunk: Restore session from secure storage.
 */
export const restoreSession = createAsyncThunk(
    'auth/restoreSession',
    async (_, { rejectWithValue }) => {
        try {
            const token = await getAuthToken();
            const user = await getUserData();

            if (token && user) {
                return { token, user };
            }
            return null;
        } catch (error: any) {
            return rejectWithValue('Failed to restore session.');
        }
    },
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.error = null;
            state.isLoading = false;
            // Clear storage (fire-and-forget)
            removeAuthToken();
            removeUserData();
        },
        clearAuthError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Restore session
        builder
            .addCase(restoreSession.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(restoreSession.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload) {
                    state.user = action.payload.user;
                    state.token = action.payload.token;
                }
            })
            .addCase(restoreSession.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
