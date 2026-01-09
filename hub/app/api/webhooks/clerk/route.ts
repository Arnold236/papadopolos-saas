import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env");
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const eventType = evt.type;

  try {
    switch (eventType) {
      case "user.created":
        await handleUserCreated(evt.data);
        break;
      case "user.updated":
        await handleUserUpdated(evt.data);
        break;
      case "user.deleted":
        await handleUserDeleted(evt.data);
        break;
    }

    return new Response("Webhook processed", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Error processing webhook", { status: 500 });
  }
}

async function handleUserCreated(data: any) {
  const { id, email_addresses, first_name, last_name, phone_numbers, image_url } = data;

  const email = email_addresses[0]?.email_address;
  const phone = phone_numbers[0]?.phone_number;
  const name = `${first_name || ""} ${last_name || ""}`.trim();

  await prisma.user.create({
    data: {
      clerkId: id,
      email: email,
      name: name || email?.split("@")[0] || "User",
      phone: phone,
      avatar: image_url,
      emailVerified: true,
    },
  });
}

async function handleUserUpdated(data: any) {
  const { id, email_addresses, first_name, last_name, phone_numbers, image_url } = data;

  const email = email_addresses[0]?.email_address;
  const phone = phone_numbers[0]?.phone_number;
  const name = `${first_name || ""} ${last_name || ""}`.trim();

  await prisma.user.update({
    where: { clerkId: id },
    data: {
      email: email,
      name: name,
      phone: phone,
      avatar: image_url,
    },
  });
}

async function handleUserDeleted(data: any) {
  const { id } = data;

  await prisma.user.update({
    where: { clerkId: id },
    data: {
      clerkId: null, // Soft delete by removing clerkId
    },
  });
}