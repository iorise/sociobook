import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const user = await currentUser();
    const body = await req.json();

    const { bio, externalImage, coverImage } = body;

    if (!user) {
      throw new Error("No user");
    }

    const updatedUser = await prismadb.user.update({
      where: {
        externalId: user.id,
      },
      data: {
        bio,
        externalImage,
        coverImage,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
