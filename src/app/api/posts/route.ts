import { currentUser } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();

    const body = await req.json();

    const { text, images } = body;

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
        userId: user.id,
      },
    });
    
    let newImages: { imageId: string, url: string, userId: string, postId: string }[] = [];
    if (Array.isArray(images)) {
      newImages = images.map((image: { imageId: string, url: string }) => ({
        imageId: image.imageId,
        url: image.url,
        userId: user.id,
        postId: newPost.id,
      }));
    }

    if (newImages.length > 0) {
      await prismadb.image.createMany({
        data: newImages,
      });
    }

    return NextResponse.json(newPost);
  } catch (error) {
    console.log("[POSTS_POST]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // get page and lastCursor from query
    const url = new URL(req.url);

    const userId = url.searchParams.get("userId");
    const take = url.searchParams.get("take");
    const lastCursor = url.searchParams.get("lastCursor");

    let posts;
    if (userId) {
      posts = await prismadb.post.findMany({
        where: {
          userId: userId,
        },
        take: take ? parseInt(take as string) : 10,
        ...(lastCursor && {
          skip: 1,
          cursor: {
            id: lastCursor as string,
          },
        }),
        include: {
          user: true,
          comments: {
            include: {
              author: true,
            },
          },
          images: true,
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
            id: lastCursor as string,
          },
        }),
        include: {
          user: true,
          comments: {
            include: {
              author: true,
            },
          },
          images:true
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

    const lastPostInResults: any = posts[posts.length - 1];
    const cursor: any = lastPostInResults.id;

    const nextPage = await prismadb.post.findMany({
      take: take ? parseInt(take as string) : 7,
      skip: 1,
      cursor: {
        id: cursor,
      },
    });

    const data = {
      data: posts,
      metaData: {
        lastCursor: cursor,
        hasNextPage: nextPage.length > 0,
      },
    };

    return new NextResponse(JSON.stringify(data), { status: 200 });
  } catch (error: any) {
    console.log(error);
    return new NextResponse(
      JSON.stringify(JSON.stringify({ error: error.message })),
      { status: 403 }
    );
  }
}
