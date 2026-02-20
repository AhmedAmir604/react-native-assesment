/**
 * App Entry Point
 *
 * Wraps the application with Redux Provider and SafeAreaProvider.
 * Restores session on app launch.
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store, useAppDispatch } from './src/store';
import { restoreSession } from './src/store/slices/authSlice';
import RootNavigator from './src/navigation/RootNavigator';

/**
 * Inner App component that has access to Redux dispatch.
 */
const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <>
      <StatusBar style="dark" />
      <RootNavigator />
    </>
  );
};

/**
 * Root App component with providers.
 */
export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
}
