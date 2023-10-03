"use client";

import * as React from "react";
import { User } from "@prisma/client";

import { extendedPost } from "@/types";
import { Post } from "@/components/post/post-item";
import { PostLoader } from "@/components/ui/post-loader";
import { Icons } from "@/components/icons";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { BatchType } from "@/lib/limit-batch";

interface PostsProps {
  currentUser: User | null;
  apiUrl: string;
  queryKey: string;
}

export function Posts({ currentUser, apiUrl, queryKey }: PostsProps) {
  const {
    data,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isSuccess,
    isFetchingNextPage,
    ref,
    inView,
  } = useInfiniteScroll({
    queryKey: queryKey,
    apiUrl,
    batchType: BatchType.POSTS,
  });

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage, isFetchingNextPage]);

  if (error) {
    return (
      <div className="py-4 w-full flex flex-col justify-center items-center mx-auto gap-3 text-muted-foreground">
        <Icons.activity className="w-16 h-16 md:w-24 md:h-24" />
        <p className="text-xl md:text-2xl">Something went wrong.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {isSuccess &&
        data?.pages.map((page) =>
          page.data.map((post: extendedPost, index: number) => {
            return page.data.length === index + 1 ? (
              <li ref={ref} key={index}>
                <Post
                  data={post}
                  currentUser={currentUser}
                  key={post.id}
                  queryKey={queryKey}
                />
              </li>
            ) : (
              <Post
                data={post}
                currentUser={currentUser}
                key={post.id}
                queryKey={queryKey}
              />
            );
          })
        )}
      {(isLoading || isFetchingNextPage) && (
        <div className="flex flex-col gap-2.5">
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
    </ul>
  );
}
