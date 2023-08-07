import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismaDb from "@/lib/prismadb";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const user = await currentUser();

    const body = await req.json();

    const { text, image } = body;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!user.id) {
      return new NextResponse("No user id", { status: 401 });
    }

    if (!text) {
      return new NextResponse("Text is required", { status: 400 });
    }

    const newPost = await prismaDb.post.create({
      data: {
        text,
        image,
        userId: user.id,
      },
    });

    return NextResponse.json(newPost);
  } catch (error) {
    console.log("[POSTS_POST]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!user.id) {
    return new NextResponse("No user id", { status: 401 });
  }

  let posts;

  try {
    if (user.id) {
      posts = await prismadb.post.findMany({
        where: {
          userId: user.id,
        },
        include: {
          user: true,
          comments: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      posts = await prismadb.post.findMany({
        include: {
          user: true,
          comments: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }
  } catch (error) {
    console.log(error)
    return new NextResponse("internal error", { status: 500 });
  }

  return NextResponse.json(posts);
}
