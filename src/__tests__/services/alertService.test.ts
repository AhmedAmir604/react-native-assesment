/**
 * Alert Service Tests
 *
 * Tests for health alert detection business logic.
 */

import {
    checkHealthAlerts,
    isHeartRateAbnormal,
    isOxygenLevelAbnormal,
    isTemperatureAbnormal,
    hasAbnormalValues,
    formatAlertMessages,
} from '../../services/alertService';
import { HealthEntry } from '../../types/health';

// ─── Test Helpers ────────────────────────────────────────────

const createMockEntry = (overrides: Partial<HealthEntry> = {}): HealthEntry => ({
    id: 'test_entry_1',
    userId: 'usr_001',
    date: '2026-02-18',
    heartRate: 72,
    bloodPressure: { systolic: 120, diastolic: 80 },
    oxygenLevel: 98,
    temperature: 36.6,
    symptoms: [],
    notes: '',
    createdAt: '2026-02-18T10:00:00.000Z',
    ...overrides,
});

describe('Alert Service', () => {
    // ─── Individual Metric Checks ────────────────────────────

    describe('isHeartRateAbnormal', () => {
        it('should return false for normal heart rate', () => {
            expect(isHeartRateAbnormal(72)).toBe(false);
            expect(isHeartRateAbnormal(120)).toBe(false);
        });

        it('should return true for elevated heart rate (> 120)', () => {
            expect(isHeartRateAbnormal(121)).toBe(true);
            expect(isHeartRateAbnormal(180)).toBe(true);
        });
    });

    describe('isOxygenLevelAbnormal', () => {
        it('should return false for normal SpO2', () => {
            expect(isOxygenLevelAbnormal(98)).toBe(false);
            expect(isOxygenLevelAbnormal(90)).toBe(false);
        });

        it('should return true for low SpO2 (< 90)', () => {
            expect(isOxygenLevelAbnormal(89)).toBe(true);
            expect(isOxygenLevelAbnormal(70)).toBe(true);
        });
    });

    describe('isTemperatureAbnormal', () => {
        it('should return false for normal temperature', () => {
            expect(isTemperatureAbnormal(36.6)).toBe(false);
            expect(isTemperatureAbnormal(39)).toBe(false);
        });

        it('should return true for fever (> 39°C)', () => {
            expect(isTemperatureAbnormal(39.1)).toBe(true);
            expect(isTemperatureAbnormal(41)).toBe(true);
        });
    });

    // ─── Full Entry Alert Check ──────────────────────────────

    describe('checkHealthAlerts', () => {
        it('should return empty array for normal entry', () => {
            const entry = createMockEntry();
            const alerts = checkHealthAlerts(entry);
            expect(alerts).toHaveLength(0);
        });

        it('should detect elevated heart rate', () => {
            const entry = createMockEntry({ heartRate: 130 });
            const alerts = checkHealthAlerts(entry);
            expect(alerts).toHaveLength(1);
            expect(alerts[0].metric).toBe('Heart Rate');
        });

        it('should detect low SpO2', () => {
            const entry = createMockEntry({ oxygenLevel: 85 });
            const alerts = checkHealthAlerts(entry);
            expect(alerts).toHaveLength(1);
            expect(alerts[0].metric).toBe('Blood Oxygen (SpO2)');
            expect(alerts[0].severity).toBe('critical');
        });

        it('should detect fever', () => {
            const entry = createMockEntry({ temperature: 39.5 });
            const alerts = checkHealthAlerts(entry);
            expect(alerts).toHaveLength(1);
            expect(alerts[0].metric).toBe('Body Temperature');
        });

        it('should detect multiple abnormal values', () => {
            const entry = createMockEntry({
                heartRate: 150,
                oxygenLevel: 85,
                temperature: 40,
            });
            const alerts = checkHealthAlerts(entry);
            expect(alerts).toHaveLength(3);
        });
    });

    // ─── Utility Functions ───────────────────────────────────

    describe('hasAbnormalValues', () => {
        it('should return false for normal entry', () => {
            expect(hasAbnormalValues(createMockEntry())).toBe(false);
        });

        it('should return true if any value is abnormal', () => {
            expect(hasAbnormalValues(createMockEntry({ heartRate: 150 }))).toBe(true);
        });
    });

    describe('formatAlertMessages', () => {
        it('should return empty string for no alerts', () => {
            expect(formatAlertMessages([])).toBe('');
        });

        it('should format alert messages with warning symbol', () => {
            const alerts = checkHealthAlerts(createMockEntry({ heartRate: 150 }));
            const formatted = formatAlertMessages(alerts);
            expect(formatted).toContain('⚠');
            expect(formatted).toContain('120');
        });
    });
});
