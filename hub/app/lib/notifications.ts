import { PrismaClient } from "@prisma/client";
import { sendAppointmentReminder } from "./email";
import { sendReminderSMS } from "./sms";
import { addHours, isBefore } from "date-fns";

const prisma = new PrismaClient();

export async function createReminderJob(appointment: any) {
  // Create reminder for 24 hours before appointment
  const reminderTime = new Date(appointment.date);
  reminderTime.setHours(reminderTime.getHours() - 24);

  // In a production environment, you would use a job queue like Bull or Agenda
  // For simplicity, we'll check for pending reminders on each request
  // Consider implementing a cron job for production
  
  // Store reminder in database for processing
  await prisma.notification.create({
    data: {
      userId: appointment.patientId,
      appointmentId: appointment.id,
      type: "EMAIL",
      title: "Appointment Reminder",
      content: `Reminder for your appointment in 24 hours`,
      metadata: {
        scheduledTime: reminderTime.toISOString(),
        sent: false,
      },
    },
  });
}

export async function checkAndSendReminders() {
  const now = new Date();
  
  // Get pending reminders that are due
  const pendingReminders = await prisma.notification.findMany({
    where: {
      read: false,
      metadata: {
        path: ["sent"],
        equals: false,
      },
    },
    include: {
      appointment: {
        include: {
          patient: true,
          doctor: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  for (const reminder of pendingReminders) {
    const metadata = reminder.metadata as any;
    const scheduledTime = new Date(metadata.scheduledTime);
    
    if (isBefore(scheduledTime, now)) {
      // Send reminder
      if (reminder.appointment) {
        const { appointment } = reminder;
        
        // Send email reminder
        if (appointment.patient.email) {
          await sendAppointmentReminder({
            appointment,
            patient: appointment.patient,
            doctor: appointment.doctor,
            hoursBefore: 24,
          });
        }

        // Send SMS reminder
        if (appointment.patient.phone) {
          await sendReminderSMS({
            phone: appointment.patient.phone,
            appointment,
          });
        }

        // Mark as sent
        await prisma.notification.update({
          where: { id: reminder.id },
          data: {
            metadata: {
              ...metadata,
              sent: true,
              sentAt: new Date().toISOString(),
            },
          },
        });
      }
    }
  }
}

export async function sendBulkNotifications({
  userIds,
  title,
  content,
  type = "EMAIL",
}: {
  userIds: string[];
  title: string;
  content: string;
  type: "EMAIL" | "SMS";
}) {
  // Create notifications for each user
  const notifications = userIds.map(userId => ({
    userId,
    type,
    title,
    content,
    metadata: {
      bulk: true,
      sentAt: new Date().toISOString(),
    },
  }));

  await prisma.notification.createMany({
    data: notifications,
  });

  // In production, you would trigger actual email/SMS sending here
  console.log(`Sent ${notifications.length} ${type.toLowerCase()} notifications`);
}