/**
 * Healthcare Hub Custom Error System
 * Centralized error handling with detailed logging and user-friendly messages
 */

import React from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  WifiOff,
  Database,
  CreditCard,
  Calendar,
  UserX,
  FileWarning,
  Server,
  Bug,
  Lock,
  Bell,
  Upload,
  MessageSquare,
  Phone,
  Video,
  FileText,
  Stethoscope,
  Activity,
  AlertCircle,
  XCircle,
  Info,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

// ========== ERROR TYPES AND ENUMS ==========

export enum ErrorSeverity {
  INFO = 'INFO',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum ErrorCategory {
  // Authentication & Authorization
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  SESSION = 'SESSION',
  
  // Data Related
  VALIDATION = 'VALIDATION',
  DATABASE = 'DATABASE',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  
  // Network & External Services
  NETWORK = 'NETWORK',
  TIMEOUT = 'TIMEOUT',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE',
  API = 'API',
  
  // Healthcare Specific
  APPOINTMENT = 'APPOINTMENT',
  TELEHEALTH = 'TELEHEALTH',
  PRESCRIPTION = 'PRESCRIPTION',
  MEDICAL_RECORD = 'MEDICAL_RECORD',
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  
  // Communication
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  NOTIFICATION = 'NOTIFICATION',
  
  // File & Upload
  FILE_UPLOAD = 'FILE_UPLOAD',
  STORAGE = 'STORAGE',
  
  // Payment
  PAYMENT = 'PAYMENT',
  BILLING = 'BILLING',
  
  // System
  CONFIGURATION = 'CONFIGURATION',
  RATE_LIMIT = 'RATE_LIMIT',
  SECURITY = 'SECURITY',
  UNKNOWN = 'UNKNOWN',
}

export interface ErrorMetadata {
  userId?: string;
  requestId?: string;
  endpoint?: string;
  timestamp?: Date;
  severity?: ErrorSeverity;
  category?: ErrorCategory;
  retryable?: boolean;
  retryCount?: number;
  suggestion?: string;
  technicalDetails?: Record<string, any>;
  userFacingMessage?: string;
  helpLink?: string;
  supportEmail?: string;
}

// ========== BASE ERROR CLASS ==========

export class HealthcareError extends Error {
  public readonly name: string = 'HealthcareError';
  public readonly timestamp: Date;
  public readonly severity: ErrorSeverity;
  public readonly category: ErrorCategory;
  public readonly metadata: ErrorMetadata;
  public readonly retryable: boolean;
  public readonly originalError?: Error;

  constructor(
    message: string,
    options: {
      severity?: ErrorSeverity;
      category?: ErrorCategory;
      metadata?: ErrorMetadata;
      retryable?: boolean;
      originalError?: Error;
    } = {}
  ) {
    super(message);
    
    this.timestamp = new Date();
    this.severity = options.severity || ErrorSeverity.MEDIUM;
    this.category = options.category || ErrorCategory.UNKNOWN;
    this.metadata = options.metadata || {};
    this.retryable = options.retryable ?? true;
    this.originalError = options.originalError;
    
    // Ensure proper prototype chain
    Object.setPrototypeOf(this, HealthcareError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
      timestamp: this.timestamp.toISOString(),
      severity: this.severity,
      category: this.category,
      metadata: this.metadata,
      retryable: this.retryable,
      originalError: this.originalError?.message,
    };
  }
}

// ========== SPECIALIZED ERROR CLASSES ==========

// Authentication Errors
export class AuthenticationError extends HealthcareError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(message, {
      severity: ErrorSeverity.HIGH,
      category: ErrorCategory.AUTHENTICATION,
      metadata,
      retryable: false,
    });
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends HealthcareError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(message, {
      severity: ErrorSeverity.HIGH,
      category: ErrorCategory.AUTHORIZATION,
      metadata,
      retryable: false,
    });
    this.name = 'AuthorizationError';
  }
}

// Appointment Errors
export class AppointmentError extends HealthcareError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(message, {
      severity: ErrorSeverity.MEDIUM,
      category: ErrorCategory.APPOINTMENT,
      metadata,
      retryable: true,
    });
    this.name = 'AppointmentError';
  }
}

export class AppointmentConflictError extends AppointmentError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(message, metadata);
    this.name = 'AppointmentConflictError';
    this.severity = ErrorSeverity.MEDIUM;
    this.category = ErrorCategory.CONFLICT;
  }
}

export class AppointmentNotFoundError extends AppointmentError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(message, metadata);
    this.name = 'AppointmentNotFoundError';
    this.severity = ErrorSeverity.LOW;
    this.category = ErrorCategory.NOT_FOUND;
  }
}

// Telehealth Errors
export class TelehealthError extends HealthcareError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(message, {
      severity: ErrorSeverity.HIGH,
      category: ErrorCategory.TELEHEALTH,
      metadata,
      retryable: true,
    });
    this.name = 'TelehealthError';
  }
}

export class VideoConsultationError extends TelehealthError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(message, metadata);
    this.name = 'VideoConsultationError';
  }
}

// Payment Errors
export class PaymentError extends HealthcareError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(message, {
      severity: ErrorSeverity.HIGH,
      category: ErrorCategory.PAYMENT,
      metadata,
      retryable: true,
    });
    this.name = 'PaymentError';
  }
}

// SMS/Email Errors
export class CommunicationError extends HealthcareError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(message, {
      severity: ErrorSeverity.MEDIUM,
      category: ErrorCategory.NOTIFICATION,
      metadata,
      retryable: true,
    });
    this.name = 'CommunicationError';
  }
}

export class SMSError extends CommunicationError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(message, metadata);
    this.name = 'SMSError';
    this.category = ErrorCategory.SMS;
  }
}

export class EmailError extends CommunicationError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(message, metadata);
    this.name = 'EmailError';
    this.category = ErrorCategory.EMAIL;
  }
}

// Validation Errors
export class ValidationError extends HealthcareError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(message, {
      severity: ErrorSeverity.LOW,
      category: ErrorCategory.VALIDATION,
      metadata,
      retryable: false,
    });
    this.name = 'ValidationError';
  }
}

// Database Errors
export class DatabaseError extends HealthcareError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(message, {
      severity: ErrorSeverity.CRITICAL,
      category: ErrorCategory.DATABASE,
      metadata,
      retryable: true,
    });
    this.name = 'DatabaseError';
  }
}

// Network Errors
export class NetworkError extends HealthcareError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(message, {
      severity: ErrorSeverity.HIGH,
      category: ErrorCategory.NETWORK,
      metadata,
      retryable: true,
    });
    this.name = 'NetworkError';
  }
}

// Rate Limit Errors
export class RateLimitError extends HealthcareError {
  constructor(message: string, metadata?: ErrorMetadata) {
    super(message, {
      severity: ErrorSeverity.MEDIUM,
      category: ErrorCategory.RATE_LIMIT,
      metadata,
      retryable: true,
    });
    this.name = 'RateLimitError';
  }
}

// ========== ERROR HANDLER ==========

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorListeners: Array<(error: HealthcareError) => void> = [];

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Handle any error and convert to HealthcareError if needed
  static handle(error: unknown, metadata?: ErrorMetadata): HealthcareError {
    const handler = ErrorHandler.getInstance();
    
    let healthcareError: HealthcareError;
    
    if (error instanceof HealthcareError) {
      healthcareError = error;
      if (metadata) {
        healthcareError.metadata = { ...healthcareError.metadata, ...metadata };
      }
    } else if (error instanceof Error) {
      healthcareError = new HealthcareError(error.message, {
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.UNKNOWN,
        metadata,
        originalError: error,
      });
    } else {
      healthcareError = new HealthcareError(
        typeof error === 'string' ? error : 'An unknown error occurred',
        {
          severity: ErrorSeverity.HIGH,
          category: ErrorCategory.UNKNOWN,
          metadata,
        }
      );
    }

    // Log the error
    handler.logError(healthcareError);
    
    // Notify listeners
    handler.notifyListeners(healthcareError);
    
    // Show user-facing toast if needed
    if (healthcareError.severity >= ErrorSeverity.MEDIUM) {
      handler.showUserNotification(healthcareError);
    }

    return healthcareError;
  }

  // Log error to various destinations
  private logError(error: HealthcareError): void {
    // Console logging in development
    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 Healthcare Error:', {
        ...error.toJSON(),
        timestamp: error.timestamp.toISOString(),
      });
    }

    // Send to logging service (Sentry, LogRocket, etc.)
    this.sendToLoggingService(error);

    // Log to database
    this.logToDatabase(error);
  }

  private async sendToLoggingService(error: HealthcareError): Promise<void> {
    try {
      // Integration with Sentry, LogRocket, etc.
      if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
        // Sentry integration
        const Sentry = await import('@sentry/nextjs');
        Sentry.captureException(error, {
          tags: {
            category: error.category,
            severity: error.severity,
          },
          extra: error.metadata,
        });
      }
    } catch (loggingError) {
      console.error('Failed to send error to logging service:', loggingError);
    }
  }

  private async logToDatabase(error: HealthcareError): Promise<void> {
    try {
      // Log to your database
      await fetch('/api/errors/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: error.toJSON(),
          environment: process.env.NODE_ENV,
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
          url: typeof window !== 'undefined' ? window.location.href : undefined,
        }),
      });
    } catch (dbError) {
      console.error('Failed to log error to database:', dbError);
    }
  }

  private showUserNotification(error: HealthcareError): void {
    const { title, description, variant } = this.getToastConfig(error);
    
    toast({
      title,
      description,
      variant,
      duration: error.severity === ErrorSeverity.CRITICAL ? 10000 : 5000,
    });
  }

  private getToastConfig(error: HealthcareError): {
    title: string;
    description: string;
    variant: 'default' | 'destructive' | 'success' | 'warning';
  } {
    const categoryConfigs: Record<ErrorCategory, {
      title: string;
      description: (error: HealthcareError) => string;
      variant: 'default' | 'destructive' | 'success' | 'warning';
    }> = {
      [ErrorCategory.AUTHENTICATION]: {
        title: 'Authentication Error',
        description: () => 'Please sign in again to continue.',
        variant: 'destructive',
      },
      [ErrorCategory.AUTHORIZATION]: {
        title: 'Access Denied',
        description: () => 'You do not have permission to perform this action.',
        variant: 'destructive',
      },
      [ErrorCategory.APPOINTMENT]: {
        title: 'Appointment Error',
        description: (error) => error.message || 'Unable to process appointment request.',
        variant: 'warning',
      },
      [ErrorCategory.TELEHEALTH]: {
        title: 'Telehealth Error',
        description: () => 'Unable to connect to video consultation. Please try again.',
        variant: 'destructive',
      },
      [ErrorCategory.PAYMENT]: {
        title: 'Payment Error',
        description: () => 'Payment processing failed. Please check your payment details.',
        variant: 'destructive',
      },
      [ErrorCategory.VALIDATION]: {
        title: 'Validation Error',
        description: (error) => error.message || 'Please check your input and try again.',
        variant: 'warning',
      },
      [ErrorCategory.NETWORK]: {
        title: 'Connection Error',
        description: () => 'Please check your internet connection and try again.',
        variant: 'warning',
      },
      [ErrorCategory.RATE_LIMIT]: {
        title: 'Too Many Requests',
        description: () => 'Please wait a moment before trying again.',
        variant: 'warning',
      },
      [ErrorCategory.NOTIFICATION]: {
        title: 'Notification Error',
        description: () => 'Unable to send notification. Service will retry automatically.',
        variant: 'default',
      },
      [ErrorCategory.FILE_UPLOAD]: {
        title: 'Upload Error',
        description: (error) => error.message || 'Unable to upload file. Please try again.',
        variant: 'warning',
      },
      // Default configuration
      [ErrorCategory.UNKNOWN]: {
        title: 'System Error',
        description: () => 'An unexpected error occurred. Our team has been notified.',
        variant: 'destructive',
      },
      // Add other categories as needed
      [ErrorCategory.SESSION]: {
        title: 'Session Expired',
        description: () => 'Your session has expired. Please sign in again.',
        variant: 'warning',
      },
      [ErrorCategory.DATABASE]: {
        title: 'Database Error',
        description: () => 'Unable to access data. Please try again later.',
        variant: 'destructive',
      },
      [ErrorCategory.NOT_FOUND]: {
        title: 'Not Found',
        description: (error) => error.message || 'The requested resource was not found.',
        variant: 'warning',
      },
      [ErrorCategory.CONFLICT]: {
        title: 'Conflict',
        description: (error) => error.message || 'There was a conflict with your request.',
        variant: 'warning',
      },
      [ErrorCategory.TIMEOUT]: {
        title: 'Request Timeout',
        description: () => 'The request took too long to complete. Please try again.',
        variant: 'warning',
      },
      [ErrorCategory.EXTERNAL_SERVICE]: {
        title: 'Service Unavailable',
        description: () => 'An external service is currently unavailable. Please try again later.',
        variant: 'warning',
      },
      [ErrorCategory.API]: {
        title: 'API Error',
        description: () => 'Unable to communicate with server. Please try again.',
        variant: 'destructive',
      },
      [ErrorCategory.PRESCRIPTION]: {
        title: 'Prescription Error',
        description: () => 'Unable to process prescription request.',
        variant: 'warning',
      },
      [ErrorCategory.MEDICAL_RECORD]: {
        title: 'Medical Record Error',
        description: () => 'Unable to access medical records.',
        variant: 'destructive',
      },
      [ErrorCategory.PATIENT]: {
        title: 'Patient Error',
        description: () => 'Unable to process patient request.',
        variant: 'warning',
      },
      [ErrorCategory.DOCTOR]: {
        title: 'Doctor Error',
        description: () => 'Unable to process doctor request.',
        variant: 'warning',
      },
      [ErrorCategory.SMS]: {
        title: 'SMS Error',
        description: () => 'Unable to send SMS notification.',
        variant: 'default',
      },
      [ErrorCategory.EMAIL]: {
        title: 'Email Error',
        description: () => 'Unable to send email notification.',
        variant: 'default',
      },
      [ErrorCategory.STORAGE]: {
        title: 'Storage Error',
        description: () => 'Unable to access file storage.',
        variant: 'destructive',
      },
      [ErrorCategory.BILLING]: {
        title: 'Billing Error',
        description: () => 'Unable to process billing request.',
        variant: 'destructive',
      },
      [ErrorCategory.CONFIGURATION]: {
        title: 'Configuration Error',
        description: () => 'System configuration error. Please contact support.',
        variant: 'destructive',
      },
      [ErrorCategory.SECURITY]: {
        title: 'Security Error',
        description: () => 'Security violation detected.',
        variant: 'destructive',
      },
    };

    const config = categoryConfigs[error.category] || categoryConfigs[ErrorCategory.UNKNOWN];
    
    return {
      title: config.title,
      description: config.description(error),
      variant: config.variant,
    };
  }

  addListener(listener: (error: HealthcareError) => void): void {
    this.errorListeners.push(listener);
  }

  removeListener(listener: (error: HealthcareError) => void): void {
    this.errorListeners = this.errorListeners.filter(l => l !== listener);
  }

  private notifyListeners(error: HealthcareError): void {
    this.errorListeners.forEach(listener => {
      try {
        listener(error);
      } catch (listenerError) {
        console.error('Error in error listener:', listenerError);
      }
    });
  }

  // Global error handler for React
  static setupGlobalErrorHandling(): void {
    if (typeof window !== 'undefined') {
      // Handle unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        event.preventDefault();
        ErrorHandler.handle(event.reason, {
          category: ErrorCategory.UNKNOWN,
          severity: ErrorSeverity.HIGH,
        });
      });

      // Handle uncaught errors
      window.addEventListener('error', (event) => {
        event.preventDefault();
        ErrorHandler.handle(event.error, {
          category: ErrorCategory.UNKNOWN,
          severity: ErrorSeverity.HIGH,
        });
      });
    }
  }
}

// ========== ERROR BOUNDARY COMPONENT ==========

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class HealthcareErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error
    const healthcareError = ErrorHandler.handle(error, {
      category: ErrorCategory.UNKNOWN,
      severity: ErrorSeverity.CRITICAL,
      metadata: {
        componentStack: errorInfo.componentStack,
      },
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleRetry = (): void => {
    window.location.reload();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl shadow-xl border-red-200">
            <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-gray-900">
                      Something went wrong
                    </CardTitle>
                    <p className="text-gray-600">
                      We've encountered an unexpected error
                    </p>
                  </div>
                </div>
                <Badge variant="destructive" className="text-sm">
                  Error
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Bug className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Error Details</h4>
                      <p className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded">
                        {this.state.error?.message || 'Unknown error'}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center">
                      <Info className="w-4 h-4 mr-2 text-blue-500" />
                      What happened?
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2"></