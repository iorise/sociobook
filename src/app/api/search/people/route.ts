import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const query = url.searchParams.get("q");

  if (!query) {
    return new NextResponse("Invalid query", { status: 400 });
  }

    const users = await prismadb.user.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: query,
              mode: "insensitive",
            },
          }
        ]
      },
      take: 8,
    });

    return new NextResponse(JSON.stringify(users), {
      status: 200,
    });
}
