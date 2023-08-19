import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const user = await prismadb.user.findMany({
      where: {
        externalId: {
          not: userId
        }
      }
    })

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_GET]", error);
    return new NextResponse("Internal error", {status: 500});
  }
}
