/**
 * Mock for expo-secure-store
 * Used in testing environment.
 */

const store: Record<string, string> = {};

export const setItemAsync = async (key: string, value: string): Promise<void> => {
    store[key] = value;
};

export const getItemAsync = async (key: string): Promise<string | null> => {
    return store[key] || null;
};

export const deleteItemAsync = async (key: string): Promise<void> => {
    delete store[key];
};
