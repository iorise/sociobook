import prismadb from "@/lib/prismadb";
import { User } from "@clerk/nextjs/api";
import { headers } from "next/headers";
import { Webhook } from "svix";

type UnwantedKeys =
  | "emailAddresses"
  | "firstName"
  | "lastName"
  | "primaryEmailAddressId"
  | "primaryPhoneNumberId"
  | "phoneNumbers";

interface UserInterface extends Omit<User, UnwantedKeys> {
  id: string;
  image_url: string;
  profile_image_url: string
  email_addresses: {
    email_address: string;
    id: string;
  }[];
  primary_email_address_id: string;
  first_name: string;
  last_name: string;
  primary_phone_number_id: string;
  phone_numbers: {
    phone_number: string;
    id: string;
  }[];
}
type EventType = "user.created" | "user.updated" | "*";

type Event = {
  object: "event";
  type: EventType;
  data: UserInterface;
};

const webHookSecret: string = process.env.WEBHOOK_SECRET || "";

async function handler(req: Request) {
  const payload = await req.json();
  const payloadString = JSON.stringify(payload);
  const headerPayload = headers();
  const svixId = headerPayload.get("svix-id");
  const svixIdTimeStamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");
  if (!svixId || !svixIdTimeStamp || !svixSignature) {
    console.log("svixId", svixId);
    console.log("svixIdTimeStamp", svixIdTimeStamp);
    console.log("svixSignature", svixSignature);
    return new Response("Error occured", {
      status: 400,
    });
  }

  if (!webHookSecret) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const svixHeaders = {
    "svix-id": svixId,
    "svix-timestamp": svixIdTimeStamp,
    "svix-signature": svixSignature,
  };

  const wh = new Webhook(webHookSecret);
  let evt: Event | null = null;

  try {
    evt = wh.verify(payloadString, svixHeaders) as Event;
  } catch (err) {
    console.log(err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // handle the webhook
  const eventType: EventType = evt.type;
  if (eventType === "user.created" || eventType === "user.updated") {
    const {
      id,
      first_name,
      last_name,
      profile_image_url,
      email_addresses,
    } = evt.data;

    const email = email_addresses[0].email_address

    await prismadb.user.upsert({
      where: { externalId: id },
      update: {
        firstName: first_name,
        lastName: last_name,
        profileImage: profile_image_url,
        email: email,
      },
      create: {
        externalId: id,
        firstName: first_name,
        lastName: last_name,
        profileImage: profile_image_url,
        email: email,
      },
    });
    return new Response("", {
      status: 201,
    });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
