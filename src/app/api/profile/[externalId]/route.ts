import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { externalId: string } }
) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("No user found", { status: 400 });
  }
  try {
    if (!params.externalId) {
      return new NextResponse("No user found", { status: 400 });
    }

    const user = await prismadb.user.findUnique({
      where: {
        externalId: params.externalId,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { externalId: string } }
) {
  try {
    const body = await request.json();

    const { firstName, lastName, externalImage, coverImage } = body;

    if (!params.externalId) {
      return new NextResponse("No user found", { status: 400 });
    }

    const user = await prismadb.user.update({
      where: {
        externalId: params.externalId,
      },
      data: {
        firstName,
        lastName,
        externalImage,
        coverImage,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
