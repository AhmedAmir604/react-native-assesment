/**
 * Mock for @react-native-async-storage/async-storage
 * Used in testing environment.
 */

const store: Record<string, string> = {};

const AsyncStorage = {
    getItem: async (key: string): Promise<string | null> => {
        return store[key] || null;
    },
    setItem: async (key: string, value: string): Promise<void> => {
        store[key] = value;
    },
    removeItem: async (key: string): Promise<void> => {
        delete store[key];
    },
    clear: async (): Promise<void> => {
        Object.keys(store).forEach((key) => delete store[key]);
    },
};

export default AsyncStorage;
