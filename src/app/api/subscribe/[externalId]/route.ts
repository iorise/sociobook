import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { externalId: string } }
) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  try {
    const { verified } = await req.json();
    const admin = await prismadb.user.findUnique({
      where: {
        externalId: userId,
        role: "ADMIN",
      },
    });

    if (!admin) {
      throw new Error("Unauthorized: Admin user not found.");
    }

    if (admin.role !== "ADMIN") {
      throw new Error("Unauthorized: Only admin can perform this action.");
    }

    await prismadb.user.update({
      where: {
        externalId: params.externalId,
      },
      data: {
        verified: verified,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: `verified status: ${verified}` }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("[USER_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
