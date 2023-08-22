import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const postId = url.searchParams.get("postId");

    if (!postId) {
      return new NextResponse("No post found", { status: 400 });
    }

    const images = await prismadb.image.findMany({
      where: {
        postId,
      },
      include: {
        user:true,
        post: true
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return new Response(JSON.stringify(images), {status:200})
  } catch (error) {
    console.log("[IMAGE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
