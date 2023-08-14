"use client";

import * as React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { User } from "@prisma/client";

import { extendedPost } from "@/types";
import { Feed } from "@/components/feed";
import { allPosts } from "@/hooks/use-posts";
import { PostLoader } from "@/components/ui/post-loader";

interface FeedsProps {
  externalId?: string | null;
  currentUser: User | null
}

export function Feeds({ externalId, currentUser }: FeedsProps) {
  const { ref, inView } = useInView();

  // useInfiniteQuery is a hook that accepts a queryFn and queryKey and returns the result of the queryFn
  const {
    data,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isSuccess,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryFn: ({ pageParam = "" }) =>
      allPosts({ externalId, take: 6, lastCursor: pageParam }),
    queryKey: ["posts"],
    getNextPageParam: (lastPage) => {
      return lastPage?.metaData.lastCursor;
    },
  });

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  if (error as any) {
    return <div>{`An error has occured: ` + (error as any).message}</div>;
  }

  return (
    <div className="flex flex-col gap-5">
      {isSuccess &&
        data.pages.map((page) =>
          page.data.map((post: extendedPost, index: number) => {
            // if the last element in the page is in view, add a ref to it
            if (page.data.length === index + 1) {
              return (
                <div ref={ref} key={index}>
                  <Feed data={post} currentUser={currentUser} comments={post.comments}/>
                </div>
              );
            } else {
              return <Feed data={post} currentUser={currentUser} comments={post.comments}/>;
            }
          })
        )}
      {(isLoading || isFetchingNextPage) && (
        <div className="flex flex-col gap-5">
          <PostLoader/>
          <PostLoader/>
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
