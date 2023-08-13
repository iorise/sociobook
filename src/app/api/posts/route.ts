import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const user = await currentUser();

    const body = await req.json();

    const { text, image } = body;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!user.id) {
      return new NextResponse("No user id", { status: 401 });
    }

    if (!text) {
      return new NextResponse("Text is required", { status: 400 });
    }

    const newPost = await prismadb.post.create({
      data: {
        text,
        image,
        userId: user.id,
      },
    });

    return NextResponse.json(newPost);
  } catch (error) {
    console.log("[POSTS_POST]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function GET(req: Request) {

  try {
    // get page and lastCursor from query
    const url = new URL(req.url);

    const userId = url.searchParams.get("userId")
    const take = url.searchParams.get("take");
    const lastCursor = url.searchParams.get("lastCursor");

    let posts
    if (userId) {
      posts = await prismadb.post.findMany({
        where: {
          userId: userId
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
    } else {
      posts = await prismadb.post.findMany({
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
    }

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
