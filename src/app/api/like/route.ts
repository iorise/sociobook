import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
) {
  const { userId } = auth();
  const body = await req.text()
  const postId = body

  if (!userId) {
    throw new Error("No user found");
  }

  try {
    const post = await prismadb.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new Error("Invalid ID");
    }

    let updatedLikeIds = [...(post.likeIds || [])];


      updatedLikeIds.push(userId);

      await prismadb.post.update({
        where: {
          id: postId,
        },
        data: {
          likeIds: updatedLikeIds,
        },
      });

      return new Response(JSON.stringify(updatedLikeIds), {status:200})

  } catch (error) {
    console.log("[LIKE_POST]", error);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 });
  }
}

export async function DELETE(
  req: Request,
) {
  const { userId } = auth();
  const body = await req.text()
  const postId = body

  if (!userId) {
    throw new Error("No user found");
  }

  try {
    const post = await prismadb.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new Error("Invalid ID");
    }

    const updatedLikeIds = [...(post.likeIds || [])].filter(
      (likedId) => likedId !== userId
    );

    await prismadb.post.update({
      where: {
        id: postId,
      },
      data: {
        likeIds: updatedLikeIds,
      },
    });

    return new NextResponse("Unliked successfully", { status: 200 });
  } catch (error) {
    console.log("[UNLIKE_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
