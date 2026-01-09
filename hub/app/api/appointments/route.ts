import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendAppointmentConfirmation } from "@/lib/email";
import { sendSMS } from "@/lib/sms";
import { createReminderJob } from "@/lib/notifications";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.patientName || !data.patientEmail || !data.patientPhone || !data.doctorId || !data.date || !data.time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check doctor availability
    const availability = await prisma.doctorAvailability.findFirst({
      where: {
        doctorId: data.doctorId,
        date: new Date(data.date),
        isAvailable: true,
      },
    });

    if (!availability) {
      return NextResponse.json(
        { error: "Doctor is not available on this date" },
        { status: 400 }
      );
    }

    // Parse slots from JSON
    const slots = availability.slots as { time: string; available: boolean }[];
    const requestedSlot = slots.find(slot => slot.time === data.time);

    if (!requestedSlot || !requestedSlot.available) {
      return NextResponse.json(
        { error: "Time slot is not available" },
        { status: 400 }
      );
    }

    // Create or find patient
    let patient = await prisma.user.findUnique({
      where: { email: data.patientEmail },
    });

    if (!patient) {
      patient = await prisma.user.create({
        data: {
          email: data.patientEmail,
          name: data.patientName,
          phone: data.patientPhone,
          role: "PATIENT",
          password: "temporary", // Should be replaced with proper auth
        },
      });
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: data.doctorId,
        date: new Date(data.date),
        startTime: data.time,
        endTime: calculateEndTime(data.time),
        status: "PENDING",
        reason: data.reason,
        notes: data.notes,
      },
      include: {
        patient: true,
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });

    // Send confirmation emails
    await sendAppointmentConfirmation({
      appointment,
      patient: appointment.patient,
      doctor: appointment.doctor,
    });

    // Create reminder job
    await createReminderJob(appointment);

    // Update slot availability
    await updateSlotAvailability(availability.id, data.time, false);

    // Log the booking
    await prisma.auditLog.create({
      data: {
        userId: patient.id,
        action: "APPOINTMENT_BOOKED",
        entity: "Appointment",
        entityId: appointment.id,
        details: { ...data, appointmentId: appointment.id },
      },
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: any = {};

    if (userId) {
      where.OR = [
        { patientId: userId },
        { doctorId: userId },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: true,
        doctor: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function calculateEndTime(startTime: string): string {
  const [hours, minutes] = startTime.split(":").map(Number);
  const endHours = hours + 1;
  return `${endHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

async function updateSlotAvailability(availabilityId: string, time: string, available: boolean) {
  const availability = await prisma.doctorAvailability.findUnique({
    where: { id: availabilityId },
  });

  if (!availability) return;

  const slots = availability.slots as { time: string; available: boolean }[];
  const updatedSlots = slots.map(slot => 
    slot.time === time ? { ...slot, available } : slot
  );

  await prisma.doctorAvailability.update({
    where: { id: availabilityId },
    data: { slots: updatedSlots },
  });
}