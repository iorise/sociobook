import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = auth();
  const body = await req.text();
  const commentId = body;

  if (!userId) {
    throw new Error("No user found");
  }

  try {
    const comment = await prismadb.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      throw new Error("Invalid ID");
    }

    await prismadb.comment.update({
      where: {
        id: commentId,
      },
      data: {
        likeIds: {
          push: userId,
        },
      },
    });

    // Nofitications

    const currentUser = await prismadb.user.findUnique({
      where: {
        externalId: userId,
      },
    });

    if (comment.userId && comment.userId !== userId) {
      await prismadb.notification.create({
        data: {
          content: `liked your comment!`,
          senderFirstname: currentUser?.firstName,
          senderLastname: currentUser?.lastName,
          userId: comment.userId,
          senderProfileImage:
            currentUser?.externalImage || currentUser?.profileImage || "",
          type: "LIKE",
        },
      });

      await prismadb.user.update({
        where: {
          externalId: comment.userId,
        },
        data: {
          hasNotifications: true,
        },
      });
    }

    return new NextResponse(JSON.stringify({ message: "Liked successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.log("[LIKE_POST]", error);
    return new NextResponse(JSON.stringify({ error: "Internal error" }), {
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest) {
  const { userId } = auth();
  const body = await req.text();
  const commentId = body;

  if (!userId) {
    throw new Error("No user found");
  }

  try {
    const comment = await prismadb.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      throw new Error("Invalid ID");
    }

    const updatedLikeIds = [...(comment.likeIds || [])].filter(
      (likedId) => likedId !== userId
    );

    await prismadb.comment.update({
      where: {
        id: comment.id,
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
