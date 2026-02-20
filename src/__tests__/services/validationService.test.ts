/**
 * Validation Service Tests
 *
 * Tests for health entry form validation rules.
 */

import {
    validateHealthEntry,
    validateHeartRate,
    validateOxygenLevel,
    validateTemperature,
    validateBloodPressure,
} from '../../services/validationService';
import { HealthEntryFormData } from '../../types/health';

describe('Validation Service', () => {
    // ─── Heart Rate ──────────────────────────────────────────

    describe('validateHeartRate', () => {
        it('should pass for valid heart rate', () => {
            expect(validateHeartRate('72')).toEqual([]);
            expect(validateHeartRate('40')).toEqual([]);
            expect(validateHeartRate('200')).toEqual([]);
        });

        it('should fail for empty value', () => {
            const errors = validateHeartRate('');
            expect(errors).toHaveLength(1);
            expect(errors[0].field).toBe('heartRate');
            expect(errors[0].message).toContain('required');
        });

        it('should fail for non-numeric value', () => {
            const errors = validateHeartRate('abc');
            expect(errors).toHaveLength(1);
            expect(errors[0].message).toContain('valid number');
        });

        it('should fail for out-of-range values', () => {
            expect(validateHeartRate('39')).toHaveLength(1);
            expect(validateHeartRate('201')).toHaveLength(1);
        });
    });

    // ─── SpO2 ────────────────────────────────────────────────

    describe('validateOxygenLevel', () => {
        it('should pass for valid SpO2', () => {
            expect(validateOxygenLevel('98')).toEqual([]);
            expect(validateOxygenLevel('70')).toEqual([]);
            expect(validateOxygenLevel('100')).toEqual([]);
        });

        it('should fail for empty value', () => {
            const errors = validateOxygenLevel('');
            expect(errors).toHaveLength(1);
            expect(errors[0].message).toContain('required');
        });

        it('should fail for out-of-range values', () => {
            expect(validateOxygenLevel('69')).toHaveLength(1);
            expect(validateOxygenLevel('101')).toHaveLength(1);
        });
    });

    // ─── Temperature ─────────────────────────────────────────

    describe('validateTemperature', () => {
        it('should pass for valid temperature', () => {
            expect(validateTemperature('36.6')).toEqual([]);
            expect(validateTemperature('34')).toEqual([]);
            expect(validateTemperature('42')).toEqual([]);
        });

        it('should fail for out-of-range values', () => {
            expect(validateTemperature('33.9')).toHaveLength(1);
            expect(validateTemperature('42.1')).toHaveLength(1);
        });
    });

    // ─── Blood Pressure ──────────────────────────────────────

    describe('validateBloodPressure', () => {
        it('should pass for valid blood pressure', () => {
            expect(validateBloodPressure('120', '80')).toEqual([]);
        });

        it('should fail when systolic is empty', () => {
            const errors = validateBloodPressure('', '80');
            expect(errors.some((e) => e.field === 'systolic')).toBe(true);
        });

        it('should fail when diastolic is empty', () => {
            const errors = validateBloodPressure('120', '');
            expect(errors.some((e) => e.field === 'diastolic')).toBe(true);
        });

        it('should fail when systolic <= diastolic', () => {
            const errors = validateBloodPressure('80', '120');
            expect(errors.some((e) => e.message.includes('greater than'))).toBe(true);
        });

        it('should fail for out-of-range systolic', () => {
            const errors = validateBloodPressure('50', '40');
            expect(errors.some((e) => e.field === 'systolic')).toBe(true);
        });
    });

    // ─── Full Form Validation ────────────────────────────────

    describe('validateHealthEntry', () => {
        const validFormData: HealthEntryFormData = {
            heartRate: '72',
            systolic: '120',
            diastolic: '80',
            oxygenLevel: '98',
            temperature: '36.6',
            symptoms: [],
            notes: '',
        };

        it('should pass for valid complete form data', () => {
            const result = validateHealthEntry(validFormData);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should fail with multiple errors for empty form', () => {
            const emptyForm: HealthEntryFormData = {
                heartRate: '',
                systolic: '',
                diastolic: '',
                oxygenLevel: '',
                temperature: '',
                symptoms: [],
                notes: '',
            };
            const result = validateHealthEntry(emptyForm);
            expect(result.isValid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });
    });
});
