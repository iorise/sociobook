import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    if (!params.postId) {
      return new NextResponse("No post found", { status: 400 });
    }
    const post = await prismadb.post.findUnique({
      where: {
        id: params.postId,
      },
      include: {
        user: true,
        comments: {
          include: {
            author: true
          }
        },
        images: true
      },
    });
    return NextResponse.json(post);
  } catch (error) {
    console.log("[POST_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
