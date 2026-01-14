import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { generateMeetingId } from "@/lib/telehealth";

const prisma = new PrismaClient();

// GET all consultations for user
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
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

    const consultations = await prisma.telehealthConsultation.findMany({
      where: {
        OR: [
          { patientId: user.id },
          { doctorId: user.id },
        ],
      },
      include: {
        patient: true,
        doctor: {
          include: { user: true },
        },
      },
      orderBy: {
        scheduledAt: "desc",
      },
    });

    return NextResponse.json(consultations);
  } catch (error) {
    console.error("Error fetching consultations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST book new consultation
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
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

    const data = await request.json();
    
    // Validate required fields
    if (!data.doctorId || !data.scheduledAt || !data.type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate meeting ID and URL
    const meetingId = generateMeetingId();
    const meetingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/telehealth/${meetingId}`;

    // Create consultation
    const consultation = await prisma.telehealthConsultation.create({
      data: {
        patientId: user.id,
        doctorId: data.doctorId,
        type: data.type,
        scheduledAt: new Date(data.scheduledAt),
        duration: data.duration || 30,
        symptoms: data.symptoms,
        medicalHistory: data.medicalHistory,
        consultationFee: data.consultationFee,
        meetingId,
        meetingUrl,
        platform: "daily-co", // or your preferred platform
        status: "SCHEDULED",
        paymentStatus: "PENDING",
      },
      include: {
        patient: true,
        doctor: {
          include: { user: true },
        },
      },
    });

    // Send confirmation email
    await sendConfirmationEmail(consultation);

    // Create calendar event
    await createCalendarEvent(consultation);

    return NextResponse.json(consultation, { status: 201 });
  } catch (error) {
    console.error("Error creating consultation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper functions
async function sendConfirmationEmail(consultation: any) {
  // Implement email sending logic
  // Use Resend or your email service
}

async function createCalendarEvent(consultation: any) {
  // Integrate with Google Calendar or other calendar services
}