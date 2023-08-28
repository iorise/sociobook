import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: {
    externalId: string;
  };
}

export async function POST(req: NextRequest, { params }: Props) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("No user found", { status: 400 });
  }

  try {
    const { action, friendId } = await req.json();
    const requestedId = params.externalId;
    const currentUser = await prismadb.user.findUnique({
      where: {
        externalId: userId,
      },
    })

    const friend = await prismadb.user.findUnique({
      where: {
        externalId: friendId,
      },
    });

    if (!friend) {
      return new NextResponse("Friend not found", { status: 404 });
    }

    if (action === "request") {
      // Request Friend
      await prismadb.user.update({
        where: {
          externalId: requestedId,
        },
        data: {
          friendRequests: {
            push: userId,
          },
        },
      });

      await prismadb.notification.create({
        data: {
          userId: requestedId,
          senderFirstname: currentUser?.firstName,
          senderLastname: currentUser?.lastName,
          content: `You have a friend request from`,
          senderProfileImage: currentUser?.externalImage || currentUser?.profileImage || "",
          type: "FRIEND_REQUEST",
        }
      })

      return new NextResponse(
        JSON.stringify({ message: "Friend request sent" }),
        { status: 200 }
      );
    } else if (action === "remove") {
      // Remove Friend
      await prismadb.user.update({
        where: {
          externalId: userId,
        },
        data: {
          friendIds: {
            set: friend.friendIds.filter(
              (externalId) => externalId !== friendId
            ),
          },
        },
      });

      await prismadb.user.update({
        where: {
          externalId: friendId,
        },
        data: {
          friendIds: {
            set: friend.friendIds.filter((externalId) => externalId !== userId),
          },
        },
      });

      return new NextResponse(
        JSON.stringify({ message: "Friend removed successfully" }),
        {
          status: 200,
        }
      );
    } else {
      return new NextResponse("Invalid action", { status: 400 });
    }
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
    });
  }
}

export async function PATCH(req: NextRequest, { params }: Props) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("No user found", { status: 400 });
  }

  try {
    const { action, friendId } = await req.json();
    const requestedId = params.externalId;

    const friend = await prismadb.user.findUnique({
      where: {
        externalId: friendId,
      },
    });

    if (!friend) {
      return new NextResponse("Friend not found", { status: 404 });
    }

    if (action === "accept") {
      // Accept Friend
      await prismadb.user.update({
        where: {
          externalId: userId,
        },
        data: {
          friendIds: {
            push: requestedId,
          },
          friendRequests: {
            set: friend.friendRequests.filter(
              (externalId) => externalId !== requestedId
            ),
          },
        },
      });

      await prismadb.user.update({
        where: {
          externalId: requestedId,
        },
        data: {
          friendIds: {
            push: userId,
          },
        },
      });

      return new NextResponse(
        JSON.stringify({ message: "Friend request Accepted" }),
        {
          status: 200,
        }
      );
    } else if (action === "reject") {
      // Reject Friend Request
      await prismadb.user.update({
        where: {
          externalId: userId,
        },
        data: {
          friendRequests: {
            set: friend.friendRequests.filter(
              (externalId) => externalId !== requestedId
            ),
          },
        },
      });

      return new NextResponse(
        JSON.stringify({ message: "Friend request rejected" }),
        { status: 200 }
      );
    }

    return new NextResponse(JSON.stringify({ message: "Action completed" }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("No user found", { status: 400 });
  }

  try {
    const currentUser = await prismadb.user.findUnique({
      where: {
        externalId: userId,
      },
    });

    const friendId = currentUser?.friendIds.find(
      (externalId) => externalId === params.externalId
    );

    const friend = await prismadb.user.findUnique({
      where: {
        externalId: friendId,
      },
    });

    if (!friend) {
      return new NextResponse("Friend not found", { status: 404 });
    }

    if (!currentUser) {
      return new NextResponse("Current user not found", { status: 404 });
    }

    // Remove Friend
    await prismadb.user.update({
      where: {
        externalId: userId,
      },
      data: {
        friendIds: {
          set: currentUser.friendIds.filter(
            (externalId) => externalId !== friendId
          ),
        },
      },
    });

    await prismadb.user.update({
      where: {
        externalId: friendId,
      },
      data: {
        friendIds: {
          set: friend.friendIds.filter((externalId) => externalId !== userId),
        },
      },
    });

    return new NextResponse(
      JSON.stringify({ message: "Friend removed successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
    });
  }
}
