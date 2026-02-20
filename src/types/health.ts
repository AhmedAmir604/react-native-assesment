/**
 * Core type definitions for the Health Tracker application.
 * Loosely inspired by FHIR Observation resource structure.
 */

// ─── User & Auth ─────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// ─── Health Metrics ──────────────────────────────────────────

export interface BloodPressure {
  systolic: number;
  diastolic: number;
}

export interface HealthEntry {
  id: string;
  userId: string;
  date: string; // ISO 8601 format
  heartRate: number; // bpm
  bloodPressure: BloodPressure;
  oxygenLevel: number; // SpO2 %
  temperature: number; // °C
  symptoms: string[];
  notes: string;
  createdAt: string; // ISO 8601 format
}

export interface HealthEntryFormData {
  heartRate: string;
  systolic: string;
  diastolic: string;
  oxygenLevel: string;
  temperature: string;
  symptoms: string[];
  notes: string;
}

// ─── Health State ────────────────────────────────────────────

export interface HealthState {
  entries: HealthEntry[];
  isLoading: boolean;
  error: string | null;
}

// ─── Validation ──────────────────────────────────────────────

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// ─── Alerts ──────────────────────────────────────────────────

export type AlertSeverity = 'warning' | 'critical';

export interface HealthAlert {
  id: string;
  metric: string;
  value: number;
  threshold: number;
  message: string;
  severity: AlertSeverity;
}
