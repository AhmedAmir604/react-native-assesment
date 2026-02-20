/**
 * Application-wide constants.
 */

// ─── Validation Ranges ──────────────────────────────────────

export const VALIDATION_RANGES = {
    heartRate: { min: 40, max: 200, unit: 'bpm' },
    oxygenLevel: { min: 70, max: 100, unit: '%' },
    temperature: { min: 34, max: 42, unit: '°C' },
    systolic: { min: 60, max: 250, unit: 'mmHg' },
    diastolic: { min: 40, max: 150, unit: 'mmHg' },
} as const;

// ─── Alert Thresholds ────────────────────────────────────────

export const ALERT_THRESHOLDS = {
    heartRate: { max: 120, message: 'Heart rate is elevated above 120 bpm' },
    oxygenLevel: { min: 90, message: 'Blood oxygen level is critically low (below 90%)' },
    temperature: { max: 39, message: 'Body temperature exceeds 39°C (fever detected)' },
} as const;

// ─── Symptoms List ───────────────────────────────────────────

export const SYMPTOMS_LIST: string[] = [
    'Headache',
    'Fatigue',
    'Nausea',
    'Dizziness',
    'Cough',
    'Shortness of Breath',
    'Chest Pain',
    'Fever',
];

// ─── Mock Credentials ────────────────────────────────────────

export const MOCK_USER = {
    id: 'usr_001',
    name: 'John Doe',
    email: 'user@example.com',
    password: 'password123',
};

// ─── Storage Keys ────────────────────────────────────────────

export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    HEALTH_ENTRIES: 'health_entries',
    USER_DATA: 'user_data',
} as const;

// ─── API Simulation ──────────────────────────────────────────

export const API_DELAY_MS = 800; // Simulated network delay
