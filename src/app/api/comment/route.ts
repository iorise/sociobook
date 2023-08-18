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

    if (!postId) {
      return new NextResponse("No post found", { status: 400 });
    }

    const comments = await prismadb.comment.findMany({
      where: {
        postId,
      },
      include: {
        author: true,
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.log("[COMMENT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
