import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { notificationId: string } }
) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("No user found", { status: 400 });
  }

  try {
    if (!params.notificationId) {
      return new NextResponse("No id found", { status: 400 });
    }

    const notification = await prismadb.notification.delete({
      where: {
        userId,
        id: params.notificationId,
      },
    });

    return new NextResponse (JSON.stringify(notification), { status: 200 });
  } catch (error) {
    console.log("[NOTIFICATION_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
