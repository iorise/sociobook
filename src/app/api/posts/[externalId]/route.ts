import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(req: Request, {params}: {params: {externalId: string}}) {

  try {
    // get page and lastCursor from query
    const url = new URL(req.url);

    const take = url.searchParams.get("take");
    const lastCursor = url.searchParams.get("lastCursor");
    let posts = await prismadb.post.findMany({
      where: {
        userId: params.externalId
      },
      take: take ? parseInt(take as string) : 10,
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor as string
        }
      }),
      include: {
        user: true,
        comments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (posts.length === 0) {
      return new Response(
        JSON.stringify({
          data: [],
          metaData: {
            lastCursor: null,
            hasNextPage: false,
          },
        }),
        { status: 200 }
      );
    }
    
    const lastPostInResults: any = posts[posts.length - 1]
    const cursor: any = lastPostInResults.id

    const nextPage = await prismadb.post.findMany({
      take: take ? parseInt(take as string) : 7,
      skip: 1,
      cursor: {
        id: cursor,
      }
    })

    const data = {
      data: posts, metaData: {
        lastCursor: cursor,
        hasNextPage: nextPage.length > 0
      }
    }

    return new Response(JSON.stringify(data), {status:200})
  } catch (error: any) {
    console.log(error);
    return new Response(JSON.stringify(JSON.stringify({ error: error.message })), { status: 403 });
  }
}
