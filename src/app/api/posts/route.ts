import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismaDb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { text, image } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!text) {
      return new NextResponse("Text is required", { status: 400 });
    }

    const newPost = await prismaDb.post.create({
      data: {
        text,
        image,
        userId,
      },
    });

    return NextResponse.json(newPost);
  } catch (error) {
    console.log("[POSTS_POST]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
