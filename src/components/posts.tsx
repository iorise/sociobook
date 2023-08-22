"use client";

import * as React from "react";
import { useInView } from "react-intersection-observer";
import { User } from "@prisma/client";

import { extendedPost } from "@/types";
import { Post } from "@/components/post";
import { PostLoader } from "@/components/ui/post-loader";
import { useInfinitePosts } from "@/hooks/use-posts";
import { Icons } from "@/components/icons";

interface PostsProps {
  externalId?: string | null | undefined;
  currentUser: User | null;
}

export function Posts({ externalId, currentUser }: PostsProps) {
  const { ref, inView } = useInView();

  const {
    data,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isSuccess,
    isFetchingNextPage,
  } = useInfinitePosts(externalId ?? "");

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  if (error) {
    return (
      <div className="py-4 w-full flex flex-col justify-center items-center mx-auto gap-3 text-muted-foreground">
        <Icons.activity className="w-16 h-16 md:w-24 md:h-24" />
        <p className="text-xl md:text-2xl">Something went wrong.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {isSuccess &&
        data?.pages.map((page) =>
          page.data.map((post: extendedPost, index: number) => {
            // if the last element in the page is in view, add a ref to it
            if (page.data.length === index + 1) {
              return (
                <div ref={ref} key={index}>
                  <Post data={post} currentUser={currentUser} key={post.id}/>
                </div>
              );
            } else {
              return <Post data={post} currentUser={currentUser} key={post.id}/>;
            }
          })
        )}
      {(isLoading || isFetchingNextPage) && (
        <div className="flex flex-col gap-5">
          <PostLoader />
          <PostLoader />
        </div>
      )}
      {!isLoading &&
        !isFetchingNextPage &&
        !hasNextPage &&
        data?.pages[data.pages.length - 1]?.data.length === 0 && (
          <div className="flex justify-center text-muted-foreground">
            No more post to load.
          </div>
        )}
    </div>
  );
}
