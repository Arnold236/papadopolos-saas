// Import the service
import smsService from "@/lib/sms";

// 1. Send appointment confirmation
await smsService.sendAppointmentConfirmation({
  patientPhone: "+27123456789",
  patientName: "John Doe",
  doctorName: "Sarah Johnson",
  appointmentDate: new Date("2024-03-15"),
  appointmentTime: "10:00 AM",
  appointmentId: "APT-2024-001",
  location: "123 Healthcare Street, Tzaneen",
});

// 2. Send OTP
await smsService.sendOTP({
  phone: "+27123456789",
  otp: "123456",
  purpose: "verify",
  expiresIn: 10,
});

// 3. Send bulk notifications
await smsService.sendBulkSMS({
  recipients: ["+27123456789", "+27123456780"],
  body: "Health screening camp tomorrow at 9 AM. Free for all community members.",
  from: "HealthHub",
});

// 4. Check service status
const status = await smsService.validateService();
console.log("SMS Service Status:", status);

// 5. Get delivery status
const delivery = await smsService.getDeliveryStatus("SM123456789");
console.log("Delivery Status:", delivery);