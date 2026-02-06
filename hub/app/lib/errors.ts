/**
 * Healthcare Application Error Handling System
 * Comprehensive error management for healthcare applications
 */

// ========== ERROR TYPES ==========

export enum ErrorCategory {
  // System Errors
  SYSTEM = 'SYSTEM',
  DATABASE = 'DATABASE',
  NETWORK = 'NETWORK',
  SECURITY = 'SECURITY',
  
  // Business Logic Errors
  VALIDATION = 'VALIDATION',
  BUSINESS_LOGIC = 'BUSINESS_LOGIC',
  WORKFLOW = 'WORKFLOW',
  
  // User Errors
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  USER_INPUT = 'USER_INPUT',
  
  // External Services
  EXTERNAL_API = 'EXTERNAL_API',
  PAYMENT = 'PAYMENT',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  
  // Healthcare Specific
  APPOINTMENT = 'APPOINTMENT',
  PATIENT_DATA = 'PATIENT_DATA',
  MEDICAL_RECORDS = 'MEDICAL_RECORDS',
  TELEHEALTH = 'TELEHEALTH',
  PRESCRIPTION = 'PRESCRIPTION',
}

export enum ErrorSeverity {
  LOW = 'LOW',        // Minor issues that don't affect core functionality
  MEDIUM = 'MEDIUM',  // Issues that affect some functionality
  HIGH = 'HIGH',      // Issues that affect core functionality
  CRITICAL = 'CRITICAL', // System-wide failures or security breaches
}

export enum ErrorCode {
  // System Errors (1000-1999)
  INTERNAL_SERVER_ERROR = 1000,
  DATABASE_CONNECTION_FAILED = 1001,
  DATABASE_QUERY_FAILED = 1002,
  FILE_SYSTEM_ERROR = 1003,
  MEMORY_ALLOCATION_ERROR = 1004,
  
  // Network Errors (2000-2999)
  NETWORK_TIMEOUT = 2000,
  NETWORK_CONNECTION_FAILED = 2001,
  DNS_RESOLUTION_FAILED = 2002,
  SSL_CERTIFICATE_ERROR = 2003,
  
  // Security Errors (3000-3999)
  UNAUTHORIZED_ACCESS = 3000,
  INVALID_TOKEN = 3001,
  TOKEN_EXPIRED = 3002,
  PERMISSION_DENIED = 3003,
  RATE_LIMIT_EXCEEDED = 3004,
  CSRF_TOKEN_INVALID = 3005,
  
  // Validation Errors (4000-4999)
  VALIDATION_FAILED = 4000,
  INVALID_EMAIL = 4001,
  INVALID_PHONE = 4002,
  INVALID_DATE = 4003,
  INVALID_TIME = 4004,
  REQUIRED_FIELD_MISSING = 4005,
  INVALID_FILE_TYPE = 4006,
  FILE_SIZE_EXCEEDED = 4007,
  
  // Business Logic Errors (5000-5999)
  APPOINTMENT_CONFLICT = 5000,
  DOCTOR_UNAVAILABLE = 5001,
  PATIENT_NOT_FOUND = 5002,
  DOCTOR_NOT_FOUND = 5003,
  APPOINTMENT_NOT_FOUND = 5004,
  INSUFFICIENT_PERMISSIONS = 5005,
  WORKFLOW_VIOLATION = 5006,
  
  // User Input Errors (6000-6999)
  INVALID_CREDENTIALS = 6000,
  USER_NOT_FOUND = 6001,
  USER_ALREADY_EXISTS = 6002,
  INVALID_PASSWORD = 6003,
  ACCOUNT_LOCKED = 6004,
  EMAIL_NOT_VERIFIED = 6005,
  
  // External Service Errors (7000-7999)
  PAYMENT_FAILED = 7000,
  PAYMENT_GATEWAY_ERROR = 7001,
  SMS_SEND_FAILED = 7002,
  EMAIL_SEND_FAILED = 7003,
  TELEHEALTH_SERVICE_ERROR = 7004,
  EHR_INTEGRATION_ERROR = 7005,
  
  // Healthcare Specific Errors (8000-8999)
  MEDICAL_RECORD_NOT_FOUND = 8000,
  PRESCRIPTION_NOT_FOUND = 8001,
  LAB_RESULT_NOT_FOUND = 8002,
  PATIENT_CONSENT_REQUIRED = 8003,
  HIPAA_COMPLIANCE_VIOLATION = 8004,
  MEDICAL_AID_NOT_ACCEPTED = 8005,
  EMERGENCY_CONTACT_REQUIRED = 8006,
}

// ========== ERROR INTERFACES ==========

export interface ErrorMetadata {
  [key: string]: any;
  userId?: string;
  patientId?: string;
  doctorId?: string;
  appointmentId?: string;
  consultationId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp?: string;
  stackTrace?: string;
  requestId?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
}

export interface ErrorContext {
  userId?: string;
  role?: string;
  action?: string;
  resource?: string;
  location?: string;
  additionalInfo?: Record<string, any>;
}

export interface ErrorLogEntry {
  id: string;
  errorCode: ErrorCode;
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: string;
  metadata: ErrorMetadata;
  timestamp: Date;
  resolved: boolean;
  resolution?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
}

// ========== MAIN ERROR CLASS ==========

export class HealthcareError extends Error {
  public readonly category: ErrorCategory;
  public readonly severity: ErrorSeverity;
  public readonly errorCode: ErrorCode;
  public readonly metadata: ErrorMetadata;
  public readonly context?: ErrorContext;
  public readonly isOperational: boolean;
  public readonly timestamp: Date;
  
  constructor(
    message: string,
    category: ErrorCategory,
    severity: ErrorSeverity,
    errorCode: ErrorCode,
    metadata: ErrorMetadata = {},
    context?: ErrorContext,
    isOperational: boolean = true
  ) {
    super(message);
    
    this.name = 'HealthcareError';
    this.category = category;
    this.severity = severity;
    this.errorCode = errorCode;
    this.metadata = {
      ...metadata,
      timestamp: new Date().toISOString(),
      stackTrace: this.stack,
    };
    this.context = context;
    this.isOperational = isOperational;
    this.timestamp = new Date();
    
    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, HealthcareError.prototype);
  }
  
  /**
   * Convert error to JSON for API responses
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      category: this.category,
      severity: this.severity,
      errorCode: this.errorCode,
      metadata: this.metadata,
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      isOperational: this.isOperational,
    };
  }
  
  /**
   * Get HTTP status code based on error category
   */
  getHttpStatusCode(): number {
    switch (this.category) {
      case ErrorCategory.AUTHENTICATION:
        return 401;
      case ErrorCategory.AUTHORIZATION:
        return 403;
      case ErrorCategory.VALIDATION:
        return 400;
      case ErrorCategory.BUSINESS_LOGIC:
        return 422;
      case ErrorCategory.SYSTEM:
      case ErrorCategory.DATABASE:
      case ErrorCategory.NETWORK:
        return 500;
      case ErrorCategory.EXTERNAL_API:
        return 502;
      default:
        return 500;
    }
  }
  
  /**
   * Check if error should be logged
   */
  shouldLog(): boolean {
    return this.severity !== ErrorSeverity.LOW || !this.isOperational;
  }
  
  /**
   * Check if error should trigger alert
   */
  shouldAlert(): boolean {
    return this.severity === ErrorSeverity.HIGH || this.severity === ErrorSeverity.CRITICAL;
  }
}

// ========== SPECIFIC ERROR CLASSES ==========

// System Errors
export class SystemError extends HealthcareError {
  constructor(
    message: string,
    errorCode: ErrorCode,
    metadata: ErrorMetadata = {},
    context?: ErrorContext
  ) {
    super(
      message,
      ErrorCategory.SYSTEM,
      ErrorSeverity.HIGH,
      errorCode,
      metadata,
      context,
      false // System errors are usually non-operational
    );
  }
}

export class DatabaseError extends HealthcareError {
  constructor(
    message: string,
    errorCode: ErrorCode,
    metadata: ErrorMetadata = {},
    context?: ErrorContext
  ) {
    super(
      message,
      ErrorCategory.DATABASE,
      ErrorSeverity.HIGH,
      errorCode,
      metadata,
      context,
      false
    );
  }
}

export class NetworkError extends HealthcareError {
  constructor(
    message: string,
    errorCode: ErrorCode,
    metadata: ErrorMetadata = {},
    context?: ErrorContext
  ) {
    super(
      message,
      ErrorCategory.NETWORK,
      ErrorSeverity.MEDIUM,
      errorCode,
      metadata,
      context,
      true
    );
  }
}

// Security Errors
export class SecurityError extends HealthcareError {
  constructor(
    message: string,
    errorCode: ErrorCode,
    metadata: ErrorMetadata = {},
    context?: ErrorContext
  ) {
    super(
      message,
      ErrorCategory.SECURITY,
      ErrorSeverity.HIGH,
      errorCode,
      metadata,
      context,
      false
    );
  }
}

export class AuthenticationError extends HealthcareError {
  constructor(
    message: string,
    errorCode: ErrorCode = ErrorCode.UNAUTHORIZED_ACCESS,
    metadata: ErrorMetadata = {},
    context?: ErrorContext
  ) {
    super(
      message,
      ErrorCategory.AUTHENTICATION,
      ErrorSeverity.MEDIUM,
      errorCode,
      metadata,
      context,
      true
    );
  }
}

export class AuthorizationError extends HealthcareError {
  constructor(
    message: string,
    errorCode: ErrorCode = ErrorCode.PERMISSION_DENIED,
    metadata: ErrorMetadata = {},
    context?: ErrorContext
  ) {
    super(
      message,
      ErrorCategory.AUTHORIZATION,
      ErrorSeverity.MEDIUM,
      errorCode,
      metadata,
      context,
      true
    );
  }
}

// Validation Errors
export class ValidationError extends HealthcareError {
  constructor(
    message: string,
    errorCode: ErrorCode = ErrorCode.VALIDATION_FAILED,
    metadata: ErrorMetadata = {},
    context?: ErrorContext
  ) {
    super(
      message,
      ErrorCategory.VALIDATION,
      ErrorSeverity.LOW,
      errorCode,
      metadata,
      context,
      true
    );
  }
}

// Business Logic Errors
export class BusinessLogicError extends HealthcareError {
  constructor(
    message: string,
    errorCode: ErrorCode,
    metadata: ErrorMetadata = {},
    context?: ErrorContext
  ) {
    super(
      message,
      ErrorCategory.BUSINESS_LOGIC,
      ErrorSeverity.MEDIUM,
      errorCode,
      metadata,
      context,
      true
    );
  }
}

export class AppointmentError extends HealthcareError {
  constructor(
    message: string,
    errorCode: ErrorCode,
    metadata: ErrorMetadata = {},
    context?: ErrorContext
  ) {
    super(
      message,
      ErrorCategory.APPOINTMENT,
      ErrorSeverity.MEDIUM,
      errorCode,
      metadata,
      context,
      true
    );
  }
}

// External Service Errors
export class ExternalServiceError extends HealthcareError {
  constructor(
    message: string,
    errorCode: ErrorCode,
    metadata: ErrorMetadata = {},
    context?: ErrorContext
  ) {
    super(
      message,
      ErrorCategory.EXTERNAL_API,
      ErrorSeverity.MEDIUM,
      errorCode,
      metadata,
      context,
      true
    );
  }
}

export class PaymentError extends HealthcareError {
  constructor(
    message: string,
    errorCode: ErrorCode = ErrorCode.PAYMENT_FAILED,
    metadata: ErrorMetadata = {},
    context?: ErrorContext
  ) {
    super(
      message,
      ErrorCategory.PAYMENT,
      ErrorSeverity.HIGH,
      errorCode,
      metadata,
      context,
      true
    );
  }
}

export class SMSError extends HealthcareError {
  constructor(
    message: string,
    errorCode: ErrorCode = ErrorCode.SMS_SEND_FAILED,
    metadata: ErrorMetadata = {},
    context?: ErrorContext
  ) {
    super(
      message,
      ErrorCategory.SMS,
      ErrorSeverity.LOW,
      errorCode,
      metadata,
      context,
      true
    );
  }
}

// Healthcare Specific Errors
export class PatientDataError extends HealthcareError {
  constructor(
    message: string,
    errorCode: ErrorCode,
    metadata: ErrorMetadata = {},
    context?: ErrorContext
  ) {
    super(
      message,
      ErrorCategory.PATIENT_DATA,
      ErrorSeverity.HIGH,
      errorCode,
      metadata,
      context,
      true
    );
  }
}

export class MedicalRecordsError extends HealthcareError {
  constructor(
    message: string,
    errorCode: ErrorCode,
    metadata: ErrorMetadata = {},
    context?: ErrorContext
  ) {
    super(
      message,
      ErrorCategory.MEDICAL_RECORDS,
      ErrorSeverity.HIGH,
      errorCode,
      metadata,
      context,
      true
    );
  }
}

export class TelehealthError extends HealthcareError {
  constructor(
    message: string,
    errorCode: ErrorCode,
    metadata: ErrorMetadata = {},
    context?: ErrorContext
  ) {
    super(
      message,
      ErrorCategory.TELEHEALTH,
      ErrorSeverity.MEDIUM,
      errorCode,
      metadata,
      context,
      true
    );
  }
}

// ========== ERROR FACTORY ==========

export class ErrorFactory {
  /**
   * Create a validation error
   */
  static validation(
    message: string,
    field?: string,
    value?: any,
    context?: ErrorContext
  ): ValidationError {
    return new ValidationError(
      message,
      ErrorCode.VALIDATION_FAILED,
      { field, value },
      context
    );
  }
  
  /**
   * Create an authentication error
   */
  static authentication(
    message: string = 'Authentication required',
    context?: ErrorContext
  ): AuthenticationError {
    return new AuthenticationError(
      message,
      ErrorCode.UNAUTHORIZED_ACCESS,
      {},
      context
    );
  }
  
  /**
   * Create an authorization error
   */
  static authorization(
    message: string = 'Insufficient permissions',
    resource?: string,
    action?: string,
    context?: ErrorContext
  ): AuthorizationError {
    return new AuthorizationError(
      message,
      ErrorCode.PERMISSION_DENIED,
      { resource, action },
      context
    );
  }
  
  /**
   * Create an appointment conflict error
   */
  static appointmentConflict(
    doctorId: string,
    date: Date,
    time: string,
    context?: ErrorContext
  ): AppointmentError {
    return new AppointmentError(
      'Appointment time slot is already booked',
      ErrorCode.APPOINTMENT_CONFLICT,
      { doctorId, date, time },
      context
    );
  }
  
  /**
   * Create a doctor unavailable error
   */
  static doctorUnavailable(
    doctorId: string,
    date: Date,
    context?: ErrorContext
  ): AppointmentError {
    return new AppointmentError(
      'Doctor is not available on the selected date',
      ErrorCode.DOCTOR_UNAVAILABLE,
      { doctorId, date },
      context
    );
  }
  
  /**
   * Create a patient not found error
   */
  static patientNotFound(
    patientId: string,
    context?: ErrorContext
  ): PatientDataError {
    return new PatientDataError(
      'Patient not found',
      ErrorCode.PATIENT_NOT_FOUND,
      { patientId },
      context
    );
  }
  
  /**
   * Create a doctor not found error
   */
  static doctorNotFound(
    doctorId: string,
    context?: ErrorContext
  ): BusinessLogicError {
    return new BusinessLogicError(
      'Doctor not found',
      ErrorCode.DOCTOR_NOT_FOUND,
      { doctorId },
      context
    );
  }
  
  /**
   * Create an appointment not found error
   */
  static appointmentNotFound(
    appointmentId: string,
    context?: ErrorContext
  ): AppointmentError {
    return new AppointmentError(
      'Appointment not found',
      ErrorCode.APPOINTMENT_NOT_FOUND,
      { appointmentId },
      context
    );
  }
  
  /**
   * Create a payment error
   */
  static paymentFailed(
    paymentId: string,
    reason: string,
    context?: ErrorContext
  ): PaymentError {
    return new PaymentError(
      `Payment failed: ${reason}`,
      ErrorCode.PAYMENT_FAILED,
      { paymentId, reason },
      context
    );
  }
  
  /**
   * Create an SMS sending error
   */
  static smsSendFailed(
    phoneNumber: string,
    reason: string,
    context?: ErrorContext
  ): SMSError {
    return new SMSError(
      `Failed to send SMS: ${reason}`,
      ErrorCode.SMS_SEND_FAILED,
      { phoneNumber, reason },
      context
    );
  }
  
  /**
   * Create a telehealth service error
   */
  static telehealthServiceError(
    consultationId: string,
    reason: string,
    context?: ErrorContext
  ): TelehealthError {
    return new TelehealthError(
      `Telehealth service error: ${reason}`,
      ErrorCode.TELEHEALTH_SERVICE_ERROR,
      { consultationId, reason },
      context
    );
  }
  
  /**
   * Create a medical record not found error
   */
  static medicalRecordNotFound(
    recordId: string,
    context?: ErrorContext
  ): MedicalRecordsError {
    return new MedicalRecordsError(
      'Medical record not found',
      ErrorCode.MEDICAL_RECORD_NOT_FOUND,
      { recordId },
      context
    );
  }
  
  /**
   * Create a database error
   */
  static databaseError(
    operation: string,
    table: string,
    error: any,
    context?: ErrorContext
  ): DatabaseError {
    return new DatabaseError(
      `Database error during ${operation}`,
      ErrorCode.DATABASE_QUERY_FAILED,
      { operation, table, originalError: error.message },
      context
    );
  }
  
  /**
   * Create a network error
   */
  static networkError(
    endpoint: string,
    method: string,
    error: any,
    context?: ErrorContext
  ): NetworkError {
    return new NetworkError(
      `Network error calling ${endpoint}`,
      ErrorCode.NETWORK_CONNECTION_FAILED,
      { endpoint, method, originalError: error.message },
      context
    );
  }
  
  /**
   * Create a system error
   */
  static systemError(
    component: string,
    error: any,
    context?: ErrorContext
  ): SystemError {
    return new SystemError(
      `System error in ${component}`,
      ErrorCode.INTERNAL_SERVER_ERROR,
      { component, originalError: error.message },
      context
    );
  }
}

// ========== ERROR HANDLER ==========

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLogs: Map<string, ErrorLogEntry> = new Map();
  
  private constructor() {}
  
  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }
  
  /**
   * Handle an error
   */
  async handleError(error: HealthcareError | Error): Promise<void> {
    const healthcareError = this.normalizeError(error);
    
    // Log the error
    if (healthcareError.shouldLog()) {
      await this.logError(healthcareError);
    }
    
    // Send alerts for critical errors
    if (healthcareError.shouldAlert()) {
      await this.sendAlert(healthcareError);
    }
    
    // Monitor error rates
    this.monitorErrorRates(healthcareError);
  }
  
  /**
   * Normalize any error to HealthcareError
   */
  private normalizeError(error: HealthcareError | Error): HealthcareError {
    if (error instanceof HealthcareError) {
      return error;
    }
    
    // Convert generic errors to HealthcareError
    return new HealthcareError(
      error.message,
      ErrorCategory.SYSTEM,
      ErrorSeverity.MEDIUM,
      ErrorCode.INTERNAL_SERVER_ERROR,
      { originalError: error.message, stackTrace: error.stack },
      undefined,
      false
    );
  }
  
  /**
   * Log error to database and console
   */
  private async logError(error: HealthcareError): Promise<void> {
    const logEntry: ErrorLogEntry = {
      id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      errorCode: error.errorCode,
      category: error.category,
      severity: error.severity,
      message: error.message,
      metadata: error.metadata,
      timestamp: new Date(),
      resolved: false,
    };
    
    // Store in memory
    this.errorLogs.set(logEntry.id, logEntry);
    
    // Log to console based on environment
    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 Healthcare Error:', {
        id: logEntry.id,
        message: error.message,
        category: error.category,
        severity: error.severity,
        code: error.errorCode,
        metadata: error.metadata,
        stack: error.stack,
      });
    } else {
      // Production logging (structured JSON)
      console.error(JSON.stringify({
        level: 'error',
        timestamp: logEntry.timestamp.toISOString(),
        errorId: logEntry.id,
        errorCode: error.errorCode,
        category: error.category,
        severity: error.severity,
        message: error.message,
        metadata: error.metadata,
      }));
    }
    
    // Save to database (async)
    try {
      await this.saveErrorToDatabase(logEntry);
    } catch (dbError) {
      console.error('Failed to save error to database:', dbError);
    }
  }
  
  /**
   * Send alert for critical errors
   */
  private async sendAlert(error: HealthcareError): Promise<void> {
    // Implement alerting logic (Slack, Email, SMS, etc.)
    const alertChannels = process.env.ERROR_ALERT_CHANNELS?.split(',') || [];
    
    for (const channel of alertChannels) {
      try {
        switch (channel.trim()) {
          case 'slack':
            await this.sendSlackAlert(error);
            break;
          case 'email':
            await this.sendEmailAlert(error);
            break;
          case 'sms':
            await this.sendSMSAlert(error);
            break;
        }
      } catch (alertError) {
        console.error(`Failed to send alert via ${channel}:`, alertError);
      }
    }
  }
  
  /**
   * Monitor error rates for system health
   */
  private monitorErrorRates(error: HealthcareError): void {
    // Implement error rate monitoring
    // Track errors per minute/hour for different categories
    // Trigger alerts if error rates exceed thresholds
  }
  
  /**
   * Save error to database
   */
  private async saveErrorToDatabase(logEntry: ErrorLogEntry): Promise<void> {
    // This would use your database client (Prisma, etc.)
    // Example implementation:
    /*
    await prisma.errorLog.create({
      data: {
        id: logEntry.id,
        errorCode: logEntry.errorCode,
        category: logEntry.category,
        severity: logEntry.severity,
        message: logEntry.message,
        metadata: logEntry.metadata,
        timestamp: logEntry.timestamp,
        resolved: logEntry.resolved,
      },
    });
    */
  }
  
  /**
   * Send Slack alert
   */
  private async sendSlackAlert(error: HealthcareError): Promise<void> {
    const webhookUrl = process.env.SLACK_ERROR_WEBHOOK_URL;
    if (!webhookUrl) return;
    
    const payload = {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🚨 Healthcare System Error Alert',
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Category:*\n${error.category}`,
            },
            {
              type: 'mrkdwn',
              text: `*Severity:*\n${error.severity}`,
            },
            {
              type: 'mrkdwn',
              text: `*Code:*\n${error.errorCode}`,
            },
            {
              type: 'mrkdwn',
              text: `*Time:*\n${error.timestamp.toISOString()}`,
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Message:*\n${error.message}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Context:*\n\`\`\`${JSON.stringify(error.context, null, 2)}\`\`\``,
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `Environment: ${process.env.NODE_ENV} | App: ${process.env.APP_NAME || 'HealthcareHub'}`,
            },
          ],
        },
      ],
    };
    
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }
  
  /**
   * Send email alert
   */
  private async sendEmailAlert(error: HealthcareError): Promise<void> {
    // Implement email alert using Resend or other email service
  }
  
  /**
   * Send SMS alert
   */
  private async sendSMSAlert(error: HealthcareError): Promise<void> {
    // Implement SMS alert using your SMS service
  }
  
  /**
   * Get all error logs
   */
  getErrorLogs(): ErrorLogEntry[] {
    return Array.from(this.errorLogs.values());
  }
  
  /**
   * Get error by ID
   */
  getErrorById(id: string): ErrorLogEntry | undefined {
    return this.errorLogs.get(id);
  }
  
  /**
   * Mark error as resolved
   */
  async markAsResolved(id: string, resolution: string, resolvedBy: string): Promise<boolean> {
    const error = this.errorLogs.get(id);
    if (!error) return false;
    
    error.resolved = true;
    error.resolution = resolution;
    error.resolvedAt = new Date();
    error.resolvedBy = resolvedBy;
    
    // Update in database
    await this.updateErrorInDatabase(error);
    
    return true;
  }
  
  /**
   * Update error in database
   */
  private async updateErrorInDatabase(error: ErrorLogEntry): Promise<void> {
    // Update error in database
    /*
    await prisma.errorLog.update({
      where: { id: error.id },
      data: {
        resolved: error.resolved,
        resolution: error.resolution,
        resolvedAt: error.resolvedAt,
        resolvedBy: error.resolvedBy,
      },
    });
    */
  }
  
  /**
   * Clear old error logs (cleanup)
   */
  async clearOldLogs(days: number = 30): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    // Clear from memory
    for (const [id, error] of this.errorLogs.entries()) {
      if (error.timestamp < cutoffDate) {
        this.errorLogs.delete(id);
      }
    }
    
    // Clear from database
    /*
    await prisma.errorLog.deleteMany({
      where: {
        timestamp: {
          lt: cutoffDate,
        },
      },
    });
    */
  }
}

// ========== ERROR MIDDLEWARE ==========

import { NextRequest, NextResponse } from 'next/server';

export function withErrorHandler(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    try {
      return await handler(request, ...args);
    } catch (error) {
      const errorHandler = ErrorHandler.getInstance();
      
      // Normalize error
      const healthcareError = error instanceof HealthcareError 
        ? error 
        : new HealthcareError(
            error instanceof Error ? error.message : 'Unknown error',
            ErrorCategory.SYSTEM,
            ErrorSeverity.MEDIUM,
            ErrorCode.INTERNAL_SERVER_ERROR,
            {
              endpoint: request.nextUrl.pathname,
              method: request.method,
              stackTrace: error instanceof Error ? error.stack : undefined,
            }
          );
      
      // Handle the error
      await errorHandler.handleError(healthcareError);
      
      // Return appropriate response
      return NextResponse.json(
        {
          success: false,
          error: {
            code: healthcareError.errorCode,
            message: healthcareError.message,
            category: healthcareError.category,
            ...(process.env.NODE_ENV === 'development' && {
              details: healthcareError.metadata,
              stack: healthcareError.stack,
            }),
          },
        },
        {
          status: healthcareError.getHttpStatusCode(),
          headers: {
            'X-Error-Code': healthcareError.errorCode.toString(),
            'X-Error-Category': healthcareError.category,
          },
        }
      );
    }
  };
}

// ========== UTILITY FUNCTIONS ==========

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  error: HealthcareError,
  includeDetails: boolean = process.env.NODE_ENV === 'development'
): {
  success: boolean;
  error: {
    code: ErrorCode;
    message: string;
    category: ErrorCategory;
    severity: ErrorSeverity;
    details?: any;
    timestamp: string;
  };
} {
  return {
    success: false,
    error: {
      code: error.errorCode,
      message: error.message,
      category: error.category,
      severity: error.severity,
      ...(includeDetails && {
        details: error.metadata,
        context: error.context,
      }),
      timestamp: error.timestamp.toISOString(),
    },
  };
}

/**
 * Check if error is operational (expected)
 */
export function isOperationalError(error: any): boolean {
  return error instanceof HealthcareError && error.isOperational;
}

/**
 * Generate user-friendly error messages
 */
export function getUserFriendlyMessage(error: HealthcareError): string {
  const defaultMessage = 'An unexpected error occurred. Please try again.';
  
  switch (error.errorCode) {
    case ErrorCode.APPOINTMENT_CONFLICT:
      return 'The selected time slot is already booked. Please choose another time.';
    
    case ErrorCode.DOCTOR_UNAVAILABLE:
      return 'The selected doctor is not available at this time. Please choose another doctor or time.';
    
    case ErrorCode.VALIDATION_FAILED:
      return 'Please check your input and try again.';
    
    case ErrorCode.UNAUTHORIZED_ACCESS:
      return 'Please sign in to continue.';
    
    case ErrorCode.PERMISSION_DENIED:
      return 'You do not have permission to perform this action.';
    
    case ErrorCode.PAYMENT_FAILED:
      return 'Payment processing failed. Please check your payment details and try again.';
    
    case ErrorCode.NETWORK_TIMEOUT:
      return 'The request timed out. Please check your internet connection and try again.';
    
    case ErrorCode.INVALID_CREDENTIALS:
      return 'Invalid email or password. Please try again.';
    
    case ErrorCode.USER_NOT_FOUND:
      return 'Account not found. Please check your details or sign up.';
    
    case ErrorCode.USER_ALREADY_EXISTS:
      return 'An account with this email already exists. Please sign in or use a different email.';
    
    default:
      return defaultMessage;
  }
}

/**
 * Log error with context
 */
export function logErrorWithContext(
  error: Error | HealthcareError,
  context: ErrorContext = {}
): void {
  const errorHandler = ErrorHandler.getInstance();
  const healthcareError = error instanceof HealthcareError 
    ? error 
    : new HealthcareError(
        error.message,
        ErrorCategory.SYSTEM,
        ErrorSeverity.MEDIUM,
        ErrorCode.INTERNAL_SERVER_ERROR,
        { originalError: error.message, stackTrace: error.stack },
        context
      );
  
  errorHandler.handleError(healthcareError);
}

// ========== ERROR CODES MAPPING ==========

export const ErrorCodeMessages: Record<ErrorCode, string> = {
  // System Errors
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'Internal server error',
  [ErrorCode.DATABASE_CONNECTION_FAILED]: 'Database connection failed',
  [ErrorCode.DATABASE_QUERY_FAILED]: 'Database query failed',
  [ErrorCode.FILE_SYSTEM_ERROR]: 'File system error',
  [ErrorCode.MEMORY_ALLOCATION_ERROR]: 'Memory allocation error',
  
  // Network Errors
  [ErrorCode.NETWORK_TIMEOUT]: 'Network timeout',
  [ErrorCode.NETWORK_CONNECTION_FAILED]: 'Network connection failed',
  [ErrorCode.DNS_RESOLUTION_FAILED]: 'DNS resolution failed',
  [ErrorCode.SSL_CERTIFICATE_ERROR]: 'SSL certificate error',
  
  // Security Errors
  [ErrorCode.UNAUTHORIZED_ACCESS]: 'Unauthorized access',
  [ErrorCode.INVALID_TOKEN]: 'Invalid token',
  [ErrorCode.TOKEN_EXPIRED]: 'Token expired',
  [ErrorCode.PERMISSION_DENIED]: 'Permission denied',
  [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Rate limit exceeded',
  [ErrorCode.CSRF_TOKEN_INVALID]: 'CSRF token invalid',
  
  // Validation Errors
  [ErrorCode.VALIDATION_FAILED]: 'Validation failed',
  [ErrorCode.INVALID_EMAIL]: 'Invalid email address',
  [ErrorCode.INVALID_PHONE]: 'Invalid phone number',
  [ErrorCode.INVALID_DATE]: 'Invalid date format',
  [ErrorCode.INVALID_TIME]: 'Invalid time format',
  [ErrorCode.REQUIRED_FIELD_MISSING]: 'Required field missing',
  [ErrorCode.INVALID_FILE_TYPE]: 'Invalid file type',
  [ErrorCode.FILE_SIZE_EXCEEDED]: 'File size exceeded',
  
  // Business Logic Errors
  [ErrorCode.APPOINTMENT_CONFLICT]: 'Appointment time conflict',
  [ErrorCode.DOCTOR_UNAVAILABLE]: 'Doctor unavailable',
  [ErrorCode.PATIENT_NOT_FOUND]: 'Patient not found',
  [ErrorCode.DOCTOR_NOT_FOUND]: 'Doctor not found',
  [ErrorCode.APPOINTMENT_NOT_FOUND]: 'Appointment not found',
  [ErrorCode.INSUFFICIENT_PERMISSIONS]: 'Insufficient permissions',
  [ErrorCode.WORKFLOW_VIOLATION]: 'Workflow violation',
  
  // User Input Errors
  [ErrorCode.INVALID_CREDENTIALS]: 'Invalid credentials',
  [ErrorCode.USER_NOT_FOUND]: 'User not found',
  [ErrorCode.USER_ALREADY_EXISTS]: 'User already exists',
  [ErrorCode.INVALID_PASSWORD]: 'Invalid password',
  [ErrorCode.ACCOUNT_LOCKED]: 'Account locked',
  [ErrorCode.EMAIL_NOT_VERIFIED]: 'Email not verified',
  
  // External Service Errors
  [ErrorCode.PAYMENT_FAILED]: 'Payment failed',
  [ErrorCode.PAYMENT_GATEWAY_ERROR]: 'Payment gateway error',
  [ErrorCode.SMS_SEND_FAILED]: 'SMS send failed',
  [ErrorCode.EMAIL_SEND_FAILED]: 'Email send failed',
  [ErrorCode.TELEHEALTH_SERVICE_ERROR]: 'Telehealth service error',
  [ErrorCode.EHR_INTEGRATION_ERROR]: 'EHR integration error',
  
  // Healthcare Specific Errors
  [ErrorCode.MEDICAL_RECORD_NOT_FOUND]: 'Medical record not found',
  [ErrorCode.PRESCRIPTION_NOT_FOUND]: 'Prescription not found',
  [ErrorCode.LAB_RESULT_NOT_FOUND]: 'Lab result not found',
  [ErrorCode.PATIENT_CONSENT_REQUIRED]: 'Patient consent required',
  [ErrorCode.HIPAA_COMPLIANCE_VIOLATION]: 'HIPAA compliance violation',
  [ErrorCode.MEDICAL_AID_NOT_ACCEPTED]: 'Medical aid not accepted',
  [ErrorCode.EMERGENCY_CONTACT_REQUIRED]: 'Emergency contact required',
};

// ========== EXPORT ALL ==========

export default {
  HealthcareError,
  ErrorCategory,
  ErrorSeverity,
  ErrorCode,
  ErrorFactory,
  ErrorHandler,
  withErrorHandler,
  createErrorResponse,
  getUserFriendlyMessage,
  logErrorWithContext,
  isOperationalError,
  
  // Specific error classes
  SystemError,
  DatabaseError,
  NetworkError,
  SecurityError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  BusinessLogicError,
  AppointmentError,
  ExternalServiceError,
  PaymentError,
  SMSError,
  PatientDataError,
  MedicalRecordsError,
  TelehealthError,
};