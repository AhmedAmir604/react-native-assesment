/**
 * Validation Service
 *
 * Pure functions for validating health entry form data.
 * Completely decoupled from UI components.
 */

import { HealthEntryFormData, ValidationResult, ValidationError } from '../types/health';
import { VALIDATION_RANGES } from '../utils/constants';

/**
 * Validates the complete health entry form data.
 */
export const validateHealthEntry = (data: HealthEntryFormData): ValidationResult => {
    const errors: ValidationError[] = [];

    errors.push(...validateHeartRate(data.heartRate));
    errors.push(...validateOxygenLevel(data.oxygenLevel));
    errors.push(...validateTemperature(data.temperature));
    errors.push(...validateBloodPressure(data.systolic, data.diastolic));

    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Validates heart rate value.
 */
export const validateHeartRate = (value: string): ValidationError[] => {
    const errors: ValidationError[] = [];
    const { min, max } = VALIDATION_RANGES.heartRate;

    if (!value || value.trim() === '') {
        errors.push({ field: 'heartRate', message: 'Heart rate is required' });
        return errors;
    }

    const numValue = Number(value);

    if (isNaN(numValue)) {
        errors.push({ field: 'heartRate', message: 'Heart rate must be a valid number' });
        return errors;
    }

    if (numValue < min || numValue > max) {
        errors.push({
            field: 'heartRate',
            message: `Heart rate must be between ${min} and ${max} bpm`,
        });
    }

    return errors;
};

/**
 * Validates blood oxygen level (SpO2).
 */
export const validateOxygenLevel = (value: string): ValidationError[] => {
    const errors: ValidationError[] = [];
    const { min, max } = VALIDATION_RANGES.oxygenLevel;

    if (!value || value.trim() === '') {
        errors.push({ field: 'oxygenLevel', message: 'Blood oxygen level is required' });
        return errors;
    }

    const numValue = Number(value);

    if (isNaN(numValue)) {
        errors.push({ field: 'oxygenLevel', message: 'Blood oxygen level must be a valid number' });
        return errors;
    }

    if (numValue < min || numValue > max) {
        errors.push({
            field: 'oxygenLevel',
            message: `Blood oxygen level must be between ${min}% and ${max}%`,
        });
    }

    return errors;
};

/**
 * Validates body temperature.
 */
export const validateTemperature = (value: string): ValidationError[] => {
    const errors: ValidationError[] = [];
    const { min, max } = VALIDATION_RANGES.temperature;

    if (!value || value.trim() === '') {
        errors.push({ field: 'temperature', message: 'Body temperature is required' });
        return errors;
    }

    const numValue = Number(value);

    if (isNaN(numValue)) {
        errors.push({ field: 'temperature', message: 'Body temperature must be a valid number' });
        return errors;
    }

    if (numValue < min || numValue > max) {
        errors.push({
            field: 'temperature',
            message: `Body temperature must be between ${min}°C and ${max}°C`,
        });
    }

    return errors;
};

/**
 * Validates blood pressure (systolic and diastolic).
 */
export const validateBloodPressure = (
    systolic: string,
    diastolic: string,
): ValidationError[] => {
    const errors: ValidationError[] = [];
    const systolicRange = VALIDATION_RANGES.systolic;
    const diastolicRange = VALIDATION_RANGES.diastolic;

    // Systolic validation
    if (!systolic || systolic.trim() === '') {
        errors.push({ field: 'systolic', message: 'Systolic pressure is required' });
    } else {
        const sysValue = Number(systolic);
        if (isNaN(sysValue)) {
            errors.push({ field: 'systolic', message: 'Systolic pressure must be a valid number' });
        } else if (sysValue < systolicRange.min || sysValue > systolicRange.max) {
            errors.push({
                field: 'systolic',
                message: `Systolic pressure must be between ${systolicRange.min} and ${systolicRange.max} mmHg`,
            });
        }
    }

    // Diastolic validation
    if (!diastolic || diastolic.trim() === '') {
        errors.push({ field: 'diastolic', message: 'Diastolic pressure is required' });
    } else {
        const diaValue = Number(diastolic);
        if (isNaN(diaValue)) {
            errors.push({ field: 'diastolic', message: 'Diastolic pressure must be a valid number' });
        } else if (diaValue < diastolicRange.min || diaValue > diastolicRange.max) {
            errors.push({
                field: 'diastolic',
                message: `Diastolic pressure must be between ${diastolicRange.min} and ${diastolicRange.max} mmHg`,
            });
        }
    }

    // Cross-field: systolic should be greater than diastolic
    if (systolic && diastolic) {
        const sysValue = Number(systolic);
        const diaValue = Number(diastolic);
        if (!isNaN(sysValue) && !isNaN(diaValue) && sysValue <= diaValue) {
            errors.push({
                field: 'systolic',
                message: 'Systolic pressure must be greater than diastolic pressure',
            });
        }
    }

    return errors;
};

/**
 * Gets the error message for a specific field from validation errors.
 */
export const getFieldError = (
    errors: ValidationError[],
    field: string,
): string | undefined => {
    return errors.find((error) => error.field === field)?.message;
};
