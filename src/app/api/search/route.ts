import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const query = url.searchParams.get("q");

  if (!query) {
    return new NextResponse("Invalid query", { status: 400 });
  }

  try {
    const posts = await prismadb.post.findMany({
      where: {
        OR: [
          {
            text: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            user: {
              firstName: {
                contains: query,
                mode: "insensitive",
              },
              lastName: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      include: {
        user: true,
      },
    });

    return new NextResponse(JSON.stringify(posts), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
