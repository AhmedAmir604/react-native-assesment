/**
 * Navigation Configuration
 *
 * Defines the app's navigation structure:
 * - Auth Stack (Login) when not authenticated
 * - App Stack (Dashboard, AddEntry, History, Detail) when authenticated
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '../store';

// Screens
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AddHealthEntryScreen from '../screens/AddHealthEntryScreen';
import HealthHistoryScreen from '../screens/HealthHistoryScreen';
import HealthEntryDetailScreen from '../screens/HealthEntryDetailScreen';

import { colors } from '../utils/theme';

// ─── Stack Param Types ───────────────────────────────────────

export type AuthStackParamList = {
    Login: undefined;
};

export type AppStackParamList = {
    Dashboard: undefined;
    AddHealthEntry: undefined;
    HealthHistory: undefined;
    HealthEntryDetail: { entryId: string };
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

// ─── Auth Navigator ──────────────────────────────────────────

const AuthNavigator: React.FC = () => (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
);

// ─── App Navigator ───────────────────────────────────────────

const AppNavigator: React.FC = () => (
    <AppStack.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: colors.background,
            },
            headerTintColor: colors.textPrimary,
            headerTitleStyle: {
                fontWeight: '600',
                fontSize: 17,
            },
            headerShadowVisible: false,
        }}
    >
        <AppStack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ headerShown: false }}
        />
        <AppStack.Screen
            name="AddHealthEntry"
            component={AddHealthEntryScreen}
            options={{ title: 'Add Health Entry' }}
        />
        <AppStack.Screen
            name="HealthHistory"
            component={HealthHistoryScreen}
            options={{ title: 'Health History' }}
        />
        <AppStack.Screen
            name="HealthEntryDetail"
            options={{ title: 'Entry Details' }}
        >
            {(props: any) => <HealthEntryDetailScreen {...props} />}
        </AppStack.Screen>
    </AppStack.Navigator>
);

// ─── Root Navigator ──────────────────────────────────────────

const RootNavigator: React.FC = () => {
    const token = useAppSelector((state) => state.auth.token);

    return (
        <NavigationContainer>
            {token ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
};

export default RootNavigator;
