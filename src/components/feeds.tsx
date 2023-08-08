"use client";

import * as React from "react";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { Card, CardContent } from "@/components/ui/card";
import { PostWithUser } from "@/components/post-feeds";
import { Feed } from "@/components/feed";
import { Skeleton } from "@/components/ui/skeleton";
import { allPosts } from "@/hooks/use-posts";

export function Feeds() {
  // to know when the last element is in view
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
      allPosts({ take: 3, lastCursor: pageParam }),
    queryKey: ["posts"],
    // getNextPageParam is used to get the cursor of the last element in the current page
    // which is then used as the pageParam in the queryFn
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
          page.data.map((post: PostWithUser, index: number) => {
            // if the last element in the page is in view, add a ref to it
            if (page.data.length === index + 1) {
              return (
                <div ref={ref} key={index}>
                  <Feed data={post} />
                </div>
              );
            } else {
              return <Feed data={post} />;
            }
          })
        )}
      {(isLoading || isFetchingNextPage) && (
        <div className="flex flex-col gap-5">
          <Card>
            <CardContent>
              <div className="flex flex-col gap-48">
                <div className="flex items-center mt-5">
                  <Skeleton className="h-10 w-10 rounded-full mr-4" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-4 w-[190px]" />
                  </div>
                </div>
                <div className="flex justify-center gap-36">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex flex-col gap-48">
                <div className="flex items-center mt-5">
                  <Skeleton className="h-10 w-10 rounded-full mr-4" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-4 w-[140px]" />
                  </div>
                </div>
                <div className="flex justify-center gap-36 ">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
