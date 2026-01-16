import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const messageSid = formData.get("MessageSid") as string;
    const messageStatus = formData.get("MessageStatus") as string;
    const to = formData.get("To") as string;
    const from = formData.get("From") as string;
    const errorCode = formData.get("ErrorCode") as string;
    const errorMessage = formData.get("ErrorMessage") as string;

    console.log("📱 Twilio Webhook:", {
      messageSid,
      messageStatus,
      to,
      from,
      errorCode,
      errorMessage,
    });

    // Update SMS log in database
    await prisma.sMSLog.updateMany({
      where: { messageId: messageSid },
      data: {
        status: messageStatus,
        deliveredAt: messageStatus === "delivered" ? new Date() : undefined,
        errorCode: errorCode || null,
        errorMessage: errorMessage || null,
        updatedAt: new Date(),
      },
    });

    // If it's an appointment reminder that was delivered, update next reminder
    if (messageStatus === "delivered") {
      const log = await prisma.sMSLog.findFirst({
        where: { messageId: messageSid },
      });

      if (log?.metadata?.type === "APPOINTMENT_REMINDER") {
        await prisma.appointment.update({
          where: { id: log.metadata.appointmentId },
          data: {
            lastReminderSent: new Date(),
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing Twilio webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}