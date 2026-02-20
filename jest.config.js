/** @type {import('jest').Config} */
module.exports = {
    preset: 'jest-expo',
    transformIgnorePatterns: [
        'node_modules/(?!(jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|@reduxjs/toolkit|react-redux|immer)',
    ],
    moduleNameMapper: {
        '^expo-secure-store$': '<rootDir>/src/__mocks__/expo-secure-store.ts',
        '^@react-native-async-storage/async-storage$':
            '<rootDir>/src/__mocks__/async-storage.ts',
    },
    testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
};
