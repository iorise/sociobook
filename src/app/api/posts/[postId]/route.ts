import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

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
            author: true,
          },
        },
        images: true,
      },
    });
    return NextResponse.json(post);
  } catch (error) {
    console.log("[POST_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("No user found", { status: 400 });
    }

    if (!params.postId) {
      return new NextResponse("No post found", { status: 400 });
    }

    const postByUserId = await prismadb.post.findUnique({
      where: {
        id: params.postId,
        userId,
      },
    });

    if (!postByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const post = await prismadb.post.delete({
      where: {
        id: params.postId,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.log("[POST_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
