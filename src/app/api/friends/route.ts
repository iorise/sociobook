import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const take = url.searchParams.get("take");
  const lastCursor = url.searchParams.get("lastCursor");
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  try {
    const user = await prismadb.user.findUnique({
      where: {
        externalId: userId,
      },
    });

    const friendList = user?.friendIds;

    const friendsByUser = await prismadb.user.findMany({
      where: {
        externalId: {
          in: friendList || [],
        },
      },
      take: take ? parseInt(take as string) : 10,
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor as string,
        },
      }),
      orderBy: {
        createdAt: "desc",
      },
    });

    if (friendsByUser.length === 0) {
      return new NextResponse(
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

    const lastPostInResults: any = friendsByUser[friendsByUser.length - 1];
    const cursor: any = lastPostInResults.id;

    const nextPage = await prismadb.user.findMany({
      take: take ? parseInt(take as string) : 7,
      skip: 1,
      cursor: {
        id: cursor,
      },
    });

    const data = {
      data: friendsByUser,
      metaData: {
        lastCursor: cursor,
        hasNextPage: nextPage.length > 0,
      },
    };

    return new NextResponse(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
