import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { sendAppointmentConfirmation } from "@/lib/email";
import { createReminderJob } from "@/lib/notifications";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const data = await request.json();

    // Validate required fields
    if (!data.patientName || !data.patientEmail || !data.patientPhone || !data.doctorId || !data.date || !data.time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let patientId: string;

    if (userId) {
      // User is signed in - find or create patient from user
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
      });

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      patientId = user.id;

      // Update user info if different from input
      await prisma.user.update({
        where: { id: patientId },
        data: {
          name: data.patientName,
          email: data.patientEmail,
          phone: data.patientPhone,
        },
      });
    } else {
      // Guest booking - create or find patient by email
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
          },
        });
      }

      patientId = patient.id;
    }

    // Check doctor availability and create appointment (same as before)
    const appointment = await createAppointment(patientId, data);

    // Send notifications
    await sendAppointmentConfirmation({
      appointment,
      patient: {
        name: data.patientName,
        email: data.patientEmail,
        phone: data.patientPhone,
      },
      doctor: appointment.doctor,
    });

    await createReminderJob(appointment);

    // For guests, include a signup suggestion
    const responseData: any = { appointment };
    if (!userId) {
      responseData.suggestSignup = true;
      responseData.message = "Create an account to manage appointments and access medical records";
    }

    return NextResponse.json(responseData, { status: 201 });
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
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: any = {
      OR: [
        { patientId: user.id },
        { doctorId: user.id },
      ],
    };

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
        date: "desc",
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

// Helper function to create appointment
async function createAppointment(patientId: string, data: any) {
  // Check availability
  const availability = await prisma.doctorAvailability.findFirst({
    where: {
      doctorId: data.doctorId,
      date: new Date(data.date),
      isAvailable: true,
    },
  });

  if (!availability) {
    throw new Error("Doctor is not available on this date");
  }

  // Parse slots and check availability
  const slots = availability.slots as { time: string; available: boolean }[];
  const requestedSlot = slots.find(slot => slot.time === data.time);

  if (!requestedSlot || !requestedSlot.available) {
    throw new Error("Time slot is not available");
  }

  // Create appointment
  const appointment = await prisma.appointment.create({
    data: {
      patientId,
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

  // Update slot availability
  await updateSlotAvailability(availability.id, data.time, false);

  return appointment;
}