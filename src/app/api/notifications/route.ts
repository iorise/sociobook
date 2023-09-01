import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("No user found", { status: 400 });
  }

  try {
    const notifications = await prismadb.notification.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
      },
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
    });

    await prismadb.user.update({
      where: {
        externalId: userId,
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

export async function DELETE(req: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("No user found", { status: 400 });
  }

  try {
    if (userId) {
      return new NextResponse("No user found", { status: 400 });
    }

    const notifications = await prismadb.notification.deleteMany({
      where: {
        userId: userId,
      },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.log("[NOTIFICATIONS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
