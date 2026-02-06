/**
 * Healthcare Hub Custom Error System
 * Centralized error handling with detailed logging and user-friendly messages
 */

// Error severity levels
export enum ErrorSeverity {
  LOW = 'LOW',        // Informational, no immediate action needed
  MEDIUM = 'MEDIUM',  // Warning, should be monitored
  HIGH = 'HIGH',      // Error, requires attention
  CRITICAL = 'CRITICAL', // System failure, immediate action required
}

// Error categories
export enum ErrorCategory {
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  DATABASE = 'DATABASE',
  NETWORK = 'NETWORK',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE',
  PAYMENT = 'PAYMENT',
  APPOINTMENT = 'APPOINTMENT',
  TELEHEALTH = 'TELEHEALTH',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  FILE_UPLOAD = 'FILE_UPLOAD',
  CONFIGURATION = 'CONFIGURATION',
  UNKNOWN = 'UNKNOWN',
}

//