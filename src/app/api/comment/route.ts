import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  const { userId } = auth();
  const url = new URL(req.url);
  const body = await req.json();
  const { text } = body;
  const postId = url.searchParams.get("postId");

  if (!userId) {
    return new NextResponse("No user found", { status: 400 });
  }

  if (!postId) {
    return new NextResponse("No post found", { status: 400 });
  }

  try {
    const comment = await prismadb.comment.create({
      data: {
        text,
        userId,
        postId,
      },
    });

    const post = await prismadb.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: true,
      },
    });

    const currentUser = await prismadb.user.findUnique({
      where: {
        externalId: userId,
      },
    });

    // Notification
    if (post?.userId !== currentUser?.id) {
      await prismadb.notification.create({
        data: {
          content: comment.text,
          userId: post?.userId!,
          senderFirstname: currentUser?.firstName,
          senderLastname: currentUser?.lastName,
          senderProfileImage:
            currentUser?.externalImage || currentUser?.profileImage || "",
          type: "COMMENT",
        },
      });
    }

    await prismadb.user.update({
      where: {
        externalId: comment.userId,
      },
      data: {
        hasNotifications: true,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.log("[COMMENT_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const postId = url.searchParams.get("postId");
    const take = url.searchParams.get("take");
    const lastCursor = url.searchParams.get("lastCursor");

    if (!postId) {
      return new NextResponse("No post found", { status: 400 });
    }

    const comments = await prismadb.comment.findMany({
      take: take ? parseInt(take as string) : 10,
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor as string,
        },
      }),
      where: {
        postId,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (comments.length === 0) {
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

    const lastPostInResults: any = comments[comments.length - 1];
    const cursor: any = lastPostInResults.id;

    const nextPage = await prismadb.comment.findMany({
      take: take ? parseInt(take as string) : 7,
      skip: 1,
      cursor: {
        id: cursor,
      },
    });

    const data = {
      data: comments,
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
