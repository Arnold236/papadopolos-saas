import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface AppointmentData {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
}

interface PatientData {
  name: string;
  email: string;
}

interface DoctorData {
  user: {
    name: string;
  };
  specialty: string;
}

export async function sendAppointmentConfirmation({
  appointment,
  patient,
  doctor,
}: {
  appointment: AppointmentData;
  patient: PatientData;
  doctor: DoctorData;
}) {
  try {
    await resend.emails.send({
      from: "Healthcare Hub <appointments@yourdomain.com>",
      to: patient.email,
      subject: "Appointment Confirmation - Healthcare Hub",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00BFFF;">Appointment Confirmed!</h2>
          <p>Dear ${patient.name},</p>
          <p>Your appointment has been successfully booked.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Appointment Details:</h3>
            <p><strong>Doctor:</strong> ${doctor.user.name}</p>
            <p><strong>Specialty:</strong> ${doctor.specialty}</p>
            <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${appointment.startTime} - ${appointment.endTime}</p>
            <p><strong>Appointment ID:</strong> ${appointment.id}</p>
          </div>
          
          <p>Please arrive 15 minutes before your scheduled time.</p>
          <p>To reschedule or cancel, please visit our website or contact us at +27 15 307 3000.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p>Best regards,<br>TZANEEN Healthcare Hub</p>
            <p style="color: #666; font-size: 12px;">
              123 Healthcare Street, Tzaneen, Limpopo, South Africa<br>
              Phone: +27 15 307 3000 | Email: info@tzaneenhub.co.za
            </p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
}

export async function sendAppointmentCancellation({
  appointment,
  patient,
  doctor,
  reason,
}: {
  appointment: AppointmentData;
  patient: PatientData;
  doctor: DoctorData;
  reason?: string;
}) {
  try {
    await resend.emails.send({
      from: "Healthcare Hub <appointments@yourdomain.com>",
      to: patient.email,
      subject: "Appointment Cancelled - Healthcare Hub",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff4444;">Appointment Cancelled</h2>
          <p>Dear ${patient.name},</p>
          <p>Your appointment has been cancelled.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Cancelled Appointment Details:</h3>
            <p><strong>Doctor:</strong> ${doctor.user.name}</p>
            <p><strong>Specialty:</strong> ${doctor.specialty}</p>
            <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${appointment.startTime} - ${appointment.endTime}</p>
            ${reason ? `<p><strong>Cancellation Reason:</strong> ${reason}</p>` : ''}
          </div>
          
          <p>To book a new appointment, please visit our website or contact us at +27 15 307 3000.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p>Best regards,<br>TZANEEN Healthcare Hub</p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending cancellation email:", error);
  }
}

export async function sendAppointmentReminder({
  appointment,
  patient,
  doctor,
  hoursBefore,
}: {
  appointment: AppointmentData;
  patient: PatientData;
  doctor: DoctorData;
  hoursBefore: number;
}) {
  try {
    await resend.emails.send({
      from: "Healthcare Hub <reminders@yourdomain.com>",
      to: patient.email,
      subject: `Appointment Reminder - ${hoursBefore} hour${hoursBefore > 1 ? 's' : ''} to go`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00BFFF;">Appointment Reminder</h2>
          <p>Dear ${patient.name},</p>
          <p>This is a reminder for your upcoming appointment.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Appointment Details:</h3>
            <p><strong>Doctor:</strong> ${doctor.user.name}</p>
            <p><strong>Specialty:</strong> ${doctor.specialty}</p>
            <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${appointment.startTime} - ${appointment.endTime}</p>
            <p><strong>Location:</strong> 123 Healthcare Street, Tzaneen</p>
          </div>
          
          <p>Please bring your ID and medical aid card if applicable.</p>
          <p>To reschedule or cancel, please contact us at +27 15 307 3000.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p>Best regards,<br>TZANEEN Healthcare Hub</p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending reminder email:", error);
  }
}