import twilio from 'twilio';
import { PrismaClient } from '@prisma/client';
import { HealthcareError, ErrorCategory, ErrorSeverity } from './errors';

const prisma = new PrismaClient();

// ========== TYPES ==========

export interface SMSConfig {
  provider: 'twilio' | 'africas-talking' | 'vonage' | 'mock';
  credentials: {
    accountSid?: string;
    authToken?: string;
    phoneNumber?: string;
    apiKey?: string;
    username?: string;
    from?: string;
  };
}

export interface SMSMessage {
  to: string;
  body: string;
  from?: string;
  scheduledAt?: Date;
  statusCallback?: string;
  metadata?: {
    type?: string;
    appointmentId?: string;
    userId?: string;
    doctorId?: string;
    [key: string]: any;
  };
}

export interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  provider?: string;
  timestamp?: Date;
  cost?: number;
  status?: string;
}

export interface BulkSMSMessage {
  recipients: string[];
  body: string;
  from?: string;
  scheduledAt?: Date;
}

export interface BulkSMSResponse {
  success: boolean;
  total: number;
  sent: number;
  failed: number;
  results: Array<{
    to: string;
    success: boolean;
    messageId?: string;
    error?: string;
  }>;
  totalCost?: number;
}

export interface SMSBalance {
  provider: string;
  balance: number;
  currency: string;
  updatedAt: Date;
}

export interface DeliveryStatus {
  messageId: string;
  status: 'queued' | 'sent' | 'delivered' | 'failed' | 'undelivered';
  deliveredAt?: Date;
  errorCode?: string;
  errorMessage?: string;
  provider: string;
}

export interface SMSTemplate {
  id: string;
  name: string;
  category: string;
  template: string;
  variables: string[];
  example: string;
  enabled: boolean;
}

// ========== SMS TEMPLATES ==========

const SMS_TEMPLATES: SMSTemplate[] = [
  {
    id: 'appointment-confirmation',
    name: 'Appointment Confirmation',
    category: 'APPOINTMENT',
    template: `📅 Appointment Confirmed

Dear {{patientName}},

Your appointment with Dr. {{doctorName}} has been confirmed.

📅 Date: {{appointmentDate}}
⏰ Time: {{appointmentTime}}
📍 {{location}}
🔢 Ref: {{appointmentId}}

Please arrive 15 minutes early.
To cancel or reschedule, call {{phoneNumber}}.

Thank you,
{{clinicName}}`,
    variables: ['patientName', 'doctorName', 'appointmentDate', 'appointmentTime', 'location', 'appointmentId', 'phoneNumber', 'clinicName'],
    example: 'Example: Appointment with Dr. Smith on March 15 at 10:00 AM',
    enabled: true,
  },
  {
    id: 'appointment-reminder',
    name: 'Appointment Reminder',
    category: 'APPOINTMENT',
    template: `⏰ Appointment Reminder

Hi {{patientName}},

Reminder: Your appointment is in {{hoursBefore}} hours.

👨‍⚕️ Dr. {{doctorName}}
📅 {{appointmentDate}}
⏰ {{appointmentTime}}

{{telehealthLink ? '🎥 Telehealth Link: ' + telehealthLink + '\\n\\n' : ''}}Please bring your ID and medical aid card.

To cancel or reschedule: {{phoneNumber}}`,
    variables: ['patientName', 'hoursBefore', 'doctorName', 'appointmentDate', 'appointmentTime', 'telehealthLink', 'phoneNumber'],
    example: 'Reminder for appointment tomorrow at 2 PM',
    enabled: true,
  },
  {
    id: 'appointment-cancellation',
    name: 'Appointment Cancellation',
    category: 'APPOINTMENT',
    template: `❌ Appointment Cancelled

Dear {{patientName}},

Your appointment has been cancelled.

👨‍⚕️ Dr. {{doctorName}}
📅 {{appointmentDate}}
⏰ {{appointmentTime}}
{{reason ? '📝 Reason: ' + reason + '\\n' : ''}}
To book a new appointment, visit our website or call {{phoneNumber}}.

{{rescheduleLink ? '🔗 Reschedule: ' + rescheduleLink : ''}}`,
    variables: ['patientName', 'doctorName', 'appointmentDate', 'appointmentTime', 'reason', 'phoneNumber', 'rescheduleLink'],
    example: 'Appointment cancellation with reason',
    enabled: true,
  },
  {
    id: 'prescription-ready',
    name: 'Prescription Ready',
    category: 'PRESCRIPTION',
    template: `💊 Prescription Ready

Hi {{patientName}},

Your prescription from Dr. {{doctorName}} is ready.

📋 Prescription #: {{prescriptionId}}
🏥 {{pharmacyName}}
{{collectionPin ? '🔢 PIN: ' + collectionPin + '\\n' : ''}}
You can collect during pharmacy hours.
For queries: {{phoneNumber}}

Thank you,
{{clinicName}}`,
    variables: ['patientName', 'doctorName', 'prescriptionId', 'pharmacyName', 'collectionPin', 'phoneNumber', 'clinicName'],
    example: 'Prescription #RX12345 ready for collection',
    enabled: true,
  },
  {
    id: 'lab-results-ready',
    name: 'Lab Results Ready',
    category: 'LAB',
    template: `🧪 Lab Results Ready

Dear {{patientName}},

Your {{testType}} test results are ready.

🔬 Results ID: {{resultsId}}
{{doctorName ? '👨‍⚕️ Doctor: Dr. ' + doctorName + '\\n' : ''}}
{{portalLink 
  ? 'View results online: ' + portalLink
  : 'Please contact your doctor to discuss results.'}

For assistance: {{phoneNumber}}`,
    variables: ['patientName', 'testType', 'resultsId', 'doctorName', 'portalLink', 'phoneNumber'],
    example: 'Blood test results available online',
    enabled: true,
  },
  {
    id: 'telehealth-link',
    name: 'Telehealth Link',
    category: 'TELEHEALTH',
    template: `🎥 Telehealth Consultation

Hi {{patientName}},

Your telehealth consultation with Dr. {{doctorName}} is scheduled.

⏰ Time: {{meetingTime}}
🔗 Join: {{meetingLink}}
🔢 Meeting ID: {{meetingId}}
{{meetingPassword ? '🔐 Password: ' + meetingPassword + '\\n' : ''}}
💡 Please join 5 minutes early.
📱 Use Chrome/Firefox/Safari browser.
🎤 Ensure microphone & camera are working.

For technical support: {{phoneNumber}}`,
    variables: ['patientName', 'doctorName', 'meetingTime', 'meetingLink', 'meetingId', 'meetingPassword', 'phoneNumber'],
    example: 'Video consultation link for tomorrow',
    enabled: true,
  },
  {
    id: 'otp-verification',
    name: 'OTP Verification',
    category: 'SECURITY',
    template: `🔐 Verification Code

Your {{clinicName}} verification code is:

{{otp}}

Use this code to complete your {{purpose}}.
{{expiresIn ? 'This code expires in ' + expiresIn + ' minutes.\\n' : ''}}
Do not share this code with anyone.

Thank you,
{{clinicName}}`,
    variables: ['clinicName', 'otp', 'purpose', 'expiresIn'],
    example: 'Your OTP is 123456 for login',
    enabled: true,
  },
  {
    id: 'payment-confirmation',
    name: 'Payment Confirmation',
    category: 'PAYMENT',
    template: `💰 Payment Confirmed

Dear {{patientName}},

Your payment has been processed successfully.

💳 Amount: R{{amount}}
📋 Service: {{service}}
📅 Date: {{date}}
🔢 Transaction ID: {{paymentId}}
{{receiptUrl ? '📄 Receipt: ' + receiptUrl + '\\n' : ''}}
Thank you for choosing {{clinicName}}.`,
    variables: ['patientName', 'amount', 'service', 'date', 'paymentId', 'receiptUrl', 'clinicName'],
    example: 'Payment of R500 for consultation confirmed',
    enabled: true,
  },
  {
    id: 'emergency-notification',
    name: 'Emergency Notification',
    category: 'EMERGENCY',
    template: `🚨 EMERGENCY NOTIFICATION

{{patientName}},

{{instructions}}

Emergency Contact: {{contactNumber}}

If this is a medical emergency, call {{emergencyNumber}} immediately or go to our emergency department.

{{clinicName}}`,
    variables: ['patientName', 'instructions', 'contactNumber', 'emergencyNumber', 'clinicName'],
    example: 'Emergency blood test results notification',
    enabled: true,
  },
  {
    id: 'health-tip',
    name: 'Health Tip',
    category: 'EDUCATION',
    template: `💡 Health Tip: {{category}}

Hi {{patientName}},

{{tip}}

{{source ? 'Source: ' + source + '\\n' : ''}}
For more health information, visit our website.

Stay healthy,
{{clinicName}}`,
    variables: ['category', 'patientName', 'tip', 'source', 'clinicName'],
    example: 'Health tip about diabetes prevention',
    enabled: true,
  },
];

// ========== SMS SERVICE CLASS ==========

export class SMSService {
  private static instance: SMSService;
  private config: SMSConfig;
  private twilioClient?: twilio.Twilio;
  private isInitialized = false;
  private rateLimitCache = new Map<string, { count: number; timestamp: number }>();

  private constructor() {
    this.config = {
      provider: (process.env.SMS_PROVIDER as SMSConfig['provider']) || 'mock',
      credentials: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        phoneNumber: process.env.TWILIO_PHONE_NUMBER,
        apiKey: process.env.AFRICAS_TALKING_API_KEY,
        username: process.env.AFRICAS_TALKING_USERNAME,
        from: process.env.SMS_FROM_NUMBER || 'HealthHub',
      },
    };
  }

  public static getInstance(): SMSService {
    if (!SMSService.instance) {
      SMSService.instance = new SMSService();
    }
    return SMSService.instance;
  }

  /**
   * Initialize the SMS service
   */
  public async initialize(): Promise<void> {
    try {
      switch (this.config.provider) {
        case 'twilio':
          await this.initializeTwilio();
          break;
        case 'africas-talking':
          await this.initializeAfricasTalking();
          break;
        case 'vonage':
          await this.initializeVonage();
          break;
        case 'mock':
          this.isInitialized = true;
          console.log('📱 SMS Service: Using mock provider for development');
          break;
      }

      if (this.isInitialized) {
        console.log(`📱 SMS Service: ${this.config.provider} initialized successfully`);
      }
    } catch (error) {
      console.error('📱 SMS Service: Initialization failed:', error);
      throw new HealthcareError('SMS service initialization failed', {
        severity: ErrorSeverity.CRITICAL,
        category: ErrorCategory.CONFIGURATION,
        metadata: { provider: this.config.provider },
      });
    }
  }

  private async initializeTwilio(): Promise<void> {
    if (!this.config.credentials.accountSid || !this.config.credentials.authToken) {
      throw new HealthcareError('Twilio credentials missing', {
        severity: ErrorSeverity.CRITICAL,
        category: ErrorCategory.CONFIGURATION,
      });
    }

    this.twilioClient = twilio(
      this.config.credentials.accountSid,
      this.config.credentials.authToken
    );

    // Test credentials by fetching account info
    try {
      await this.twilioClient.api.accounts(this.config.credentials.accountSid).fetch();
      this.isInitialized = true;
    } catch (error) {
      throw new HealthcareError('Twilio authentication failed', {
        severity: ErrorSeverity.CRITICAL,
        category: ErrorCategory.CONFIGURATION,
        metadata: { error: error.message },
      });
    }
  }

  private async initializeAfricasTalking(): Promise<void> {
    if (!this.config.credentials.apiKey || !this.config.credentials.username) {
      throw new HealthcareError('Africa\'s Talking credentials missing', {
        severity: ErrorSeverity.CRITICAL,
        category: ErrorCategory.CONFIGURATION,
      });
    }
    this.isInitialized = true;
  }

  private async initializeVonage(): Promise<void> {
    if (!this.config.credentials.apiKey) {
      throw new HealthcareError('Vonage credentials missing', {
        severity: ErrorSeverity.CRITICAL,
        category: ErrorCategory.CONFIGURATION,
      });
    }
    this.isInitialized = true;
  }

  /**
   * Send an SMS message
   */
  public async sendSMS(message: SMSMessage): Promise<SMSResponse> {
    if (!this.isInitialized) {
      throw new HealthcareError('SMS service not initialized', {
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.CONFIGURATION,
      });
    }

    // Validate rate limit
    if (!this.checkRateLimit(message.to)) {
      throw new HealthcareError('Rate limit exceeded for phone number', {
        severity: ErrorSeverity.MEDIUM,
        category: ErrorCategory.RATE_LIMIT,
        metadata: { to: message.to },
      });
    }

    // Validate phone number
    if (!this.validatePhoneNumber(message.to)) {
      throw new HealthcareError('Invalid phone number format', {
        severity: ErrorSeverity.LOW,
        category: ErrorCategory.VALIDATION,
        metadata: { to: message.to },
      });
    }

    const formattedNumber = this.formatPhoneNumber(message.to);

    try {
      let response: SMSResponse;

      switch (this.config.provider) {
        case 'twilio':
          response = await this.sendViaTwilio({
            ...message,
            to: formattedNumber,
          });
          break;
        case 'africas-talking':
          response = await this.sendViaAfricasTalking({
            ...message,
            to: formattedNumber,
          });
          break;
        case 'vonage':
          response = await this.sendViaVonage({
            ...message,
            to: formattedNumber,
          });
          break;
        case 'mock':
          response = await this.sendViaMock({
            ...message,
            to: formattedNumber,
          });
          break;
        default:
          throw new HealthcareError('Unsupported SMS provider', {
            severity: ErrorSeverity.CRITICAL,
            category: ErrorCategory.CONFIGURATION,
          });
      }

      // Log the SMS
      await this.logSMS({
        message,
        response,
        provider: this.config.provider,
      });

      return response;
    } catch (error) {
      // Convert to HealthcareError if not already
      const healthcareError = error instanceof HealthcareError 
        ? error 
        : new HealthcareError('Failed to send SMS', {
            severity: ErrorSeverity.HIGH,
            category: ErrorCategory.SMS,
            metadata: {
              to: message.to,
              originalError: error.message,
            },
            originalError: error instanceof Error ? error : undefined,
          });

      // Log failed SMS
      await this.logFailedSMS(message, healthcareError);
      
      throw healthcareError;
    }
  }

  /**
   * Send SMS using a template
   */
  public async sendTemplateSMS(
    templateId: string,
    variables: Record<string, string>,
    to: string,
    metadata?: SMSMessage['metadata']
  ): Promise<SMSResponse> {
    const template = SMS_TEMPLATES.find(t => t.id === templateId && t.enabled);
    
    if (!template) {
      throw new HealthcareError('SMS template not found or disabled', {
        severity: ErrorSeverity.LOW,
        category: ErrorCategory.VALIDATION,
        metadata: { templateId },
      });
    }

    // Validate required variables
    const missingVariables = template.variables.filter(
      variable => !variables[variable] && variable !== 'telehealthLink'
    );

    if (missingVariables.length > 0) {
      throw new HealthcareError('Missing required template variables', {
        severity: ErrorSeverity.LOW,
        category: ErrorCategory.VALIDATION,
        metadata: { missingVariables },
      });
    }

    // Replace variables in template
    let body = template.template;
    for (const [key, value] of Object.entries(variables)) {
      body = body.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    // Add default clinic info if not provided
    if (!variables.clinicName) {
      body = body.replace(/{{clinicName}}/g, 'TZANEEN Healthcare Hub');
    }
    if (!variables.phoneNumber) {
      body = body.replace(/{{phoneNumber}}/g, '+27 15 307 3000');
    }
    if (!variables.emergencyNumber) {
      body = body.replace(/{{emergencyNumber}}/g, '+27 15 307 3111');
    }

    return this.sendSMS({
      to,
      body,
      metadata: {
        ...metadata,
        templateId,
        templateCategory: template.category,
      },
    });
  }

  /**
   * Send bulk SMS messages
   */
  public async sendBulkSMS(messages: BulkSMSMessage): Promise<BulkSMSResponse> {
    if (!this.isInitialized) {
      throw new HealthcareError('SMS service not initialized', {
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.CONFIGURATION,
      });
    }

    const results = await Promise.all(
      messages.recipients.map(async (recipient) => {
        try {
          const response = await this.sendSMS({
            to: recipient,
            body: messages.body,
            from: messages.from,
            scheduledAt: messages.scheduledAt,
          });

          return {
            to: recipient,
            success: response.success,
            messageId: response.messageId,
            error: response.error,
            cost: response.cost,
          };
        } catch (error) {
          return {
            to: recipient,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      })
    );

    const sent = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const totalCost = results.reduce((sum, r) => sum + (r.cost || 0), 0);

    return {
      success: sent > 0,
      total: results.length,
      sent,
      failed,
      results,
      totalCost,
    };
  }

  /**
   * Get SMS delivery status
   */
  public async getDeliveryStatus(messageId: string): Promise<DeliveryStatus> {
    if (!this.isInitialized) {
      throw new HealthcareError('SMS service not initialized', {
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.CONFIGURATION,
      });
    }

    try {
      switch (this.config.provider) {
        case 'twilio':
          return await this.getTwilioDeliveryStatus(messageId);
        default:
          throw new HealthcareError('Delivery status not supported for this provider', {
            severity: ErrorSeverity.MEDIUM,
            category: ErrorCategory.EXTERNAL_SERVICE,
          });
      }
    } catch (error) {
      throw new HealthcareError('Failed to get delivery status', {
        severity: ErrorSeverity.MEDIUM,
        category: ErrorCategory.SMS,
        metadata: { messageId },
        originalError: error instanceof Error ? error : undefined,
      });
    }
  }

  /**
   * Get SMS balance
   */
  public async getBalance(): Promise<SMSBalance> {
    if (!this.isInitialized) {
      throw new HealthcareError('SMS service not initialized', {
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.CONFIGURATION,
      });
    }

    try {
      switch (this.config.provider) {
        case 'twilio':
          return await this.getTwilioBalance();
        case 'africas-talking':
          return await this.getAfricasTalkingBalance();
        default:
          throw new HealthcareError('Balance check not supported for this provider', {
            severity: ErrorSeverity.MEDIUM,
            category: ErrorCategory.EXTERNAL_SERVICE,
          });
      }
    } catch (error) {
      throw new HealthcareError('Failed to get SMS balance', {
        severity: ErrorSeverity.MEDIUM,
        category: ErrorCategory.SMS,
        originalError: error instanceof Error ? error : undefined,
      });
    }
  }

  /**
   * Validate SMS service health
   */
  public async validate(): Promise<{
    operational: boolean;
    provider: string;
    balance?: SMSBalance;
    error?: string;
  }> {
    try {
      if (!this.isInitialized) {
        return {
          operational: false,
          provider: this.config.provider,
          error: 'Service not initialized',
        };
      }

      // Check balance for supported providers
      let balance: SMSBalance | undefined;
      try {
        balance = await this.getBalance();
        if (balance.balance < 1) {
          return {
            operational: false,
            provider: this.config.provider,
            balance,
            error: 'Insufficient balance',
          };
        }
      } catch (balanceError) {
        // Balance check might not be supported for all providers
        console.warn('Balance check failed:', balanceError);
      }

      // Send test SMS in production
      if (process.env.NODE_ENV === 'production' && this.config.provider !== 'mock') {
        const testNumber = process.env.SMS_TEST_NUMBER;
        if (testNumber) {
          const testResponse = await this.sendSMS({
            to: testNumber,
            body: '📱 TZANEEN Healthcare Hub SMS Service Test - Please ignore',
            metadata: { type: 'SERVICE_TEST' },
          });

          if (!testResponse.success) {
            return {
              operational: false,
              provider: this.config.provider,
              error: testResponse.error,
            };
          }
        }
      }

      return {
        operational: true,
        provider: this.config.provider,
        balance,
      };
    } catch (error) {
      return {
        operational: false,
        provider: this.config.provider,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get all available SMS templates
   */
  public getTemplates(): SMSTemplate[] {
    return SMS_TEMPLATES.filter(template => template.enabled);
  }

  /**
   * Get templates by category
   */
  public getTemplatesByCategory(category: string): SMSTemplate[] {
    return SMS_TEMPLATES.filter(
      template => template.category === category && template.enabled
    );
  }

  // ========== PRIVATE PROVIDER METHODS ==========

  private async sendViaTwilio(message: SMSMessage): Promise<SMSResponse> {
    if (!this.twilioClient) {
      throw new HealthcareError('Twilio client not initialized', {
        severity: ErrorSeverity.CRITICAL,
        category: ErrorCategory.CONFIGURATION,
      });
    }

    const twilioMessage = await this.twilioClient.messages.create({
      body: message.body,
      to: message.to,
      from: message.from || this.config.credentials.phoneNumber!,
      statusCallback: message.statusCallback || 
        `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/sms/twilio`,
      ...(message.scheduledAt && {
        scheduleType: 'fixed',
        sendAt: message.scheduledAt.toISOString(),
      }),
    });

    const status = twilioMessage.status as DeliveryStatus['status'];
    const cost = parseFloat(twilioMessage.price || '0');

    return {
      success: ['queued', 'sent', 'delivered'].includes(status),
      messageId: twilioMessage.sid,
      provider: 'twilio',
      timestamp: new Date(),
      cost: cost > 0 ? cost : undefined,
      status,
    };
  }

  private async sendViaAfricasTalking(message: SMSMessage): Promise<SMSResponse> {
    const url = 'https://api.africastalking.com/version1/messaging';
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'ApiKey': this.config.credentials.apiKey!,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        username: this.config.credentials.username!,
        to: message.to,
        message: message.body,
        from: message.from || this.config.credentials.from!,
      }),
    });

    const data = await response.json();

    if (data.SMSMessageData.Recipients[0].statusCode === 101) {
      const cost = parseFloat(data.SMSMessageData.Recipients[0].cost || '0');
      
      return {
        success: true,
        messageId: data.SMSMessageData.Recipients[0].messageId,
        provider: 'africas-talking',
        timestamp: new Date(),
        cost: cost > 0 ? cost : undefined,
        status: 'sent',
      };
    } else {
      throw new HealthcareError(data.SMSMessageData.Recipients[0].status, {
        severity: ErrorSeverity.MEDIUM,
        category: ErrorCategory.SMS,
        metadata: {
          to: message.to,
          statusCode: data.SMSMessageData.Recipients[0].statusCode,
        },
      });
    }
  }

  private async sendViaVonage(message: SMSMessage): Promise<SMSResponse> {
    const url = 'https://rest.nexmo.com/sms/json';
    
    const params = new URLSearchParams({
      api_key: this.config.credentials.apiKey!,
      api_secret: process.env.VONAGE_API_SECRET!,
      to: message.to.replace('+', ''),
      from: message.from || this.config.credentials.from!,
      text: message.body,
      type: 'text',
    });

    const response = await fetch(`${url}?${params}`);
    const data = await response.json();

    if (data.messages[0].status === '0') {
      const cost = parseFloat(data.messages[0]['message-price'] || '0');
      
      return {
        success: true,
        messageId: data.messages[0]['message-id'],
        provider: 'vonage',
        timestamp: new Date(),
        cost: cost > 0 ? cost : undefined,
        status: 'sent',
      };
    } else {
      throw new HealthcareError(data.messages[0]['error-text'], {
        severity: ErrorSeverity.MEDIUM,
        category: ErrorCategory.SMS,
        metadata: {
          to: message.to,
          errorCode: data.messages[0].status,
        },
      });
    }
  }

  private async sendViaMock(message: SMSMessage): Promise<SMSResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Simulate occasional failures for testing
    const shouldFail = Math.random() < 0.1; // 10% failure rate in development
    
    if (shouldFail) {
      throw new HealthcareError('Mock SMS failure for testing', {
        severity: ErrorSeverity.MEDIUM,
        category: ErrorCategory.SMS,
        metadata: { to: message.to },
      });
    }

    console.log('📱 Mock SMS Sent:', {
      to: message.to,
      body: message.body.substring(0, 100) + '...',
      from: message.from,
      metadata: message.metadata,
    });

    return {
      success: true,
      messageId: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      provider: 'mock',
      timestamp: new Date(),
      status: 'sent',
    };
  }

  private async getTwilioDeliveryStatus(messageId: string): Promise<DeliveryStatus> {
    if (!this.twilioClient) {
      throw new HealthcareError('Twilio client not initialized', {
        severity: ErrorSeverity.CRITICAL,
        category: ErrorCategory.CONFIGURATION,
      });
    }

    const message = await this.twilioClient.messages(messageId).fetch();
    
    return {
      messageId: message.sid,
      status: message.status as DeliveryStatus['status'],
      deliveredAt: message.dateSent,
      errorCode: message.errorCode?.toString(),
      errorMessage: message.errorMessage,
      provider: 'twilio',
    };
  }

  private async getTwilioBalance(): Promise<SMSBalance> {
    if (!this.twilioClient) {
      throw new HealthcareError('Twilio client not initialized', {
        severity: ErrorSeverity.CRITICAL,
        category: ErrorCategory.CONFIGURATION,
      });
    }

    const balance = await this.twilioClient.balance.fetch();
    
    return {
      provider: 'twilio',
      balance: parseFloat(balance.balance),
      currency: balance.currency,
      updatedAt: new Date(),
    };
  }

  private async getAfricasTalkingBalance(): Promise<SMSBalance> {
    const url = 'https://api.africastalking.com/version1/user';
    
    const response = await fetch(url, {
      headers: {
        'ApiKey': this.config.credentials.apiKey!,
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    
    return {
      provider: 'africas-talking',
      balance: parseFloat(data.UserData.balance),
      currency: 'KES',
      updatedAt: new Date(),
    };
  }

  // ========== HELPER METHODS ==========

  private validatePhoneNumber(phone: string): boolean {
    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // South Africa phone number validation
    const saRegex = /^(\+27|0)[6-8][0-9]{8}$/;
    
    // International validation
    const intlRegex = /^\+[1-9][0-9]{7,14}$/;
    
    return saRegex.test(cleaned) || intlRegex.test(cleaned);
  }

  private formatPhoneNumber(phone: string): string {
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    // Convert South Africa numbers to international format
    if (cleaned.startsWith('0')) {
      cleaned = '+27' + cleaned.substring(1);
    }
    
    // Ensure it starts with +
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    
    return cleaned;
  }

  private checkRateLimit(phoneNumber: string): boolean {
    const key = `rate_limit_${phoneNumber}`;
    const now = Date.now();
    const limit = 5; // 5 messages per hour per number
    const windowMs = 60 * 60 * 1000; // 1 hour

    const entry = this.rateLimitCache.get(key);
    
    if (entry) {
      if (now - entry.timestamp > windowMs) {
        // Reset counter if window has passed
        this.rateLimitCache.set(key, { count: 1, timestamp: now });
        return true;
      } else if (entry.count >= limit) {
        return false;
      } else {
        entry.count++;
        return true;
      }
    } else {
      this.rateLimitCache.set(key, { count: 1, timestamp: now });
      return true;
    }
  }

  private async logSMS(event: {
    message: SMSMessage;
    response: SMSResponse;
    provider: string;
  }): Promise<void> {
    try {
      await prisma.sMSLog.create({
        data: {
          messageId: event.response.messageId || `unknown_${Date.now()}`,
          recipient: event.message.to,
          body: event.message.body,
          provider: event.provider,
          status: event.response.status || 'unknown',
          cost: event.response.cost,
          metadata: event.message.metadata,
          sentAt: new Date(),
        },
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('📱 SMS Logged:', {
          to: event.message.to,
          success: event.response.success,
          provider: event.provider,
          messageId: event.response.messageId,
        });
      }
    } catch (error) {
      console.error('Failed to log SMS:', error);
    }
  }

  private async logFailedSMS(message: SMSMessage, error: HealthcareError): Promise<void> {
    try {
      await prisma.sMSLog.create({
        data: {
          messageId: `failed_${Date.now()}`,
          recipient: message.to,
          body: message.body,
          provider: this.config.provider,
          status: 'failed',
          errorCode: error.metadata?.errorCode,
          errorMessage: error.message,
          metadata: message.metadata,
          sentAt: new Date(),
        },
      });
    } catch (dbError) {
      console.error('Failed to log failed SMS:', dbError);
    }
  }
}

// ========== EXPORT SINGLETON INSTANCE ==========

const smsService = SMSService.getInstance();
export default smsService;

// Initialize on module load (optional)
if (typeof window === 'undefined') {
  // Server-side initialization
  smsService.initialize().catch(console.error);
}