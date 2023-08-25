import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
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

    const notifications = await prismadb.notification.findMany({
      where: {
        userId: params.externalId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    await prismadb.user.update({
      where: {
        externalId: params.externalId,
      },
      data: {
        hasNotifications: false,
      },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.log("[NOTIFICATION_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
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

    const notification = await prismadb.notification.deleteMany({
      where: {
        userId: params.externalId,
      },
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.log("[NOTIFICATION_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
