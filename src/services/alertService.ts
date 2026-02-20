/**
 * Alert Service
 *
 * Pure functions for detecting abnormal health readings.
 * Completely decoupled from UI components.
 */

import { HealthEntry, HealthAlert } from '../types/health';
import { ALERT_THRESHOLDS } from '../utils/constants';

/**
 * Checks a health entry for abnormal values and returns alerts.
 */
export const checkHealthAlerts = (entry: HealthEntry): HealthAlert[] => {
    const alerts: HealthAlert[] = [];

    // Check heart rate
    if (entry.heartRate > ALERT_THRESHOLDS.heartRate.max) {
        alerts.push({
            id: `alert_hr_${entry.id}`,
            metric: 'Heart Rate',
            value: entry.heartRate,
            threshold: ALERT_THRESHOLDS.heartRate.max,
            message: ALERT_THRESHOLDS.heartRate.message,
            severity: 'warning',
        });
    }

    // Check blood oxygen level (SpO2)
    if (entry.oxygenLevel < ALERT_THRESHOLDS.oxygenLevel.min) {
        alerts.push({
            id: `alert_spo2_${entry.id}`,
            metric: 'Blood Oxygen (SpO2)',
            value: entry.oxygenLevel,
            threshold: ALERT_THRESHOLDS.oxygenLevel.min,
            message: ALERT_THRESHOLDS.oxygenLevel.message,
            severity: 'critical',
        });
    }

    // Check body temperature
    if (entry.temperature > ALERT_THRESHOLDS.temperature.max) {
        alerts.push({
            id: `alert_temp_${entry.id}`,
            metric: 'Body Temperature',
            value: entry.temperature,
            threshold: ALERT_THRESHOLDS.temperature.max,
            message: ALERT_THRESHOLDS.temperature.message,
            severity: 'warning',
        });
    }

    return alerts;
};

/**
 * Checks if a specific metric value is abnormal.
 * Used for visual highlighting in UI.
 */
export const isHeartRateAbnormal = (heartRate: number): boolean => {
    return heartRate > ALERT_THRESHOLDS.heartRate.max;
};

export const isOxygenLevelAbnormal = (oxygenLevel: number): boolean => {
    return oxygenLevel < ALERT_THRESHOLDS.oxygenLevel.min;
};

export const isTemperatureAbnormal = (temperature: number): boolean => {
    return temperature > ALERT_THRESHOLDS.temperature.max;
};

/**
 * Checks if any metric in a health entry is abnormal.
 */
export const hasAbnormalValues = (entry: HealthEntry): boolean => {
    return (
        isHeartRateAbnormal(entry.heartRate) ||
        isOxygenLevelAbnormal(entry.oxygenLevel) ||
        isTemperatureAbnormal(entry.temperature)
    );
};

/**
 * Formats alert messages for display (e.g., in Alert.alert).
 */
export const formatAlertMessages = (alerts: HealthAlert[]): string => {
    if (alerts.length === 0) return '';
    return alerts.map((alert) => `⚠ ${alert.message}`).join('\n\n');
};
