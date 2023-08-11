import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("No user");
  }

  try {
    const foundUser = await prismadb.user.findUnique({
      where: {
        externalId: userId,
      },
    });

    if (!foundUser) {
      throw new Error("Invalid user id");
    }

    let updatedFriendIds = [...(foundUser.friendIds || [])];

    updatedFriendIds.push(userId);

    const updatedUser = await prismadb.user.update({
      where: {
        externalId: userId,
      },
      data: {
        friendIds: updatedFriendIds,
      },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
