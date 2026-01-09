import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendAppointmentCancellation } from "@/lib/email";
import { sendCancellationSMS } from "@/lib/sms";

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();
    const userId = request.headers.get("x-user-id");

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Handle cancellation
    if (data.status === "CANCELLED") {
      // Free up the time slot
      const availability = await prisma.doctorAvailability.findFirst({
        where: {
          doctorId: appointment.doctorId,
          date: appointment.date,
        },
      });

      if (availability) {
        const slots = availability.slots as { time: string; available: boolean }[];
        const updatedSlots = slots.map(slot => 
          slot.time === appointment.startTime ? { ...slot, available: true } : slot
        );

        await prisma.doctorAvailability.update({
          where: { id: availability.id },
          data: { slots: updatedSlots },
        });
      }

      // Send cancellation notifications
      if (appointment.patient.email) {
        await sendAppointmentCancellation({
          appointment,
          patient: appointment.patient,
          doctor: appointment.doctor,
          reason: data.cancellationReason,
        });
      }

      if (appointment.patient.phone) {
        await sendCancellationSMS({
          phone: appointment.patient.phone,
          appointment,
        });
      }

      data.cancelledAt = new Date();
      data.cancelledBy = userId;
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data,
      include: {
        patient: true,
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });

    // Log the update
    await prisma.auditLog.create({
      data: {
        userId,
        action: "APPOINTMENT_UPDATED",
        entity: "Appointment",
        entityId: id,
        details: data,
      },
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const userId = request.headers.get("x-user-id");

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Soft delete - update status to cancelled
    await prisma.appointment.update({
      where: { id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        cancelledBy: userId,
      },
    });

    // Free up the time slot
    const availability = await prisma.doctorAvailability.findFirst({
      where: {
        doctorId: appointment.doctorId,
        date: appointment.date,
      },
    });

    if (availability) {
      const slots = availability.slots as { time: string; available: boolean }[];
      const updatedSlots = slots.map(slot => 
        slot.time === appointment.startTime ? { ...slot, available: true } : slot
      );

      await prisma.doctorAvailability.update({
        where: { id: availability.id },
        data: { slots: updatedSlots },
      });
    }

    // Log the deletion
    await prisma.auditLog.create({
      data: {
        userId,
        action: "APPOINTMENT_CANCELLED",
        entity: "Appointment",
        entityId: id,
      },
    });

    return NextResponse.json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}