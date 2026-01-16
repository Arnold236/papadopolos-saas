import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import smsService from "@/lib/sms";
import { PrismaClient } from "@prisma/client";
import { rateLimit } from "@/lib/rate-limit";

const prisma = new PrismaClient();

// Rate limiting: 10 SMS per minute per user
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Rate limiting
    try {
      await limiter.check(userId, 10);
    } catch {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    const data = await request.json();
    
    // Validate request
    if (!data.to || !data.body) {
      return NextResponse.json(
        { error: "Missing required fields: 'to' and 'body'" },
        { status: 400 }
      );
    }

    // Check if user has permission to send SMS
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { notificationPreferences: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check SMS preferences
    if (!user.notificationPreferences?.smsEnabled) {
      return NextResponse.json(
        { error: "SMS notifications are disabled for this user" },
        { status: 403 }
      );
    }

    // Send SMS
    const response = await smsService.sendSMS({
      to: data.to,
      body: data.body,
      from: data.from,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
      metadata: data.metadata,
    });

    if (response.success) {
      // Log successful SMS
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "SMS_SENT",
          entity: "SMS",
          entityId: response.messageId,
          details: {
            to: data.to,
            body: data.body.substring(0, 100) + "...",
            provider: response.provider,
          },
        },
      });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error sending SMS:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET method to check SMS service status
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
      include: { notificationPreferences: true },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const serviceStatus = await smsService.validateService();
    const balance = await smsService.checkBalance();

    return NextResponse.json({
      service: serviceStatus,
      balance,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error checking SMS service:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}