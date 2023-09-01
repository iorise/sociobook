import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = auth();
  try {
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const currentUser = await prismadb.user.findUnique({
      where: {
        externalId: userId,
      },
      include: {
        comments: true,
        notifications: true,
        posts: true,
      },
    });
    return new NextResponse(JSON.stringify(currentUser), { status: 200 });
  } catch (error) {
    console.log("[CURRENTUSER_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
