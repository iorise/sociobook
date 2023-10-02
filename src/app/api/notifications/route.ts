import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const url = new URL(req.url);
    const take = url.searchParams.get("take");
    const lastCursor = url.searchParams.get("lastCursor");

    const notifications = await prismadb.notification.findMany({
      where: {
        userId,
      },
      take: take ? parseInt(take as string) : 10,
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor as string,
        },
      }),
      include: {
        user: true,
      },
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

    if (notifications.length === 0) {
      return new Response(
        JSON.stringify({
          data: [],
          metaData: {
            lastCursor: null,
            hasNextPage: false,
          },
        }),
        { status: 200 }
      );
    }

    const lastPostInResults: any = notifications[notifications.length - 1];
    const cursor: any = lastPostInResults.id;

    const nextPage = await prismadb.comment.findMany({
      take: take ? parseInt(take as string) : 7,
      skip: 1,
      cursor: {
        id: cursor,
      },
    });

    const data = {
      data: notifications,
      metaData: {
        lastCursor: cursor,
        hasNextPage: nextPage.length > 0,
      },
    };

    return new NextResponse(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.log("[COMMENT_GET]", error);
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
