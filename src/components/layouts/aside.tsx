"use client";

import * as React from "react";
import { User } from "@prisma/client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getFriendList } from "@/app/_action/users";
import { useInView } from "react-intersection-observer";
import FriendList from "@/components/friend-list";
import { Icons } from "@/components/icons";

export function Aside() {
  const { ref, inView } = useInView();
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isSuccess,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["friendList"],
    queryFn: ({ pageParam = "" }) =>
      getFriendList({ take: 18, lastCursor: pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage?.metaData.lastCursor;
    },
    refetchOnWindowFocus: false,
  });
  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  const userCount = isSuccess
    ? data.pages.flatMap((page) => page.data).length
    : 0;

  return (
    <ScrollArea className="w-full h-[calc(100vh_-_3.5rem)]">
      <h1 className="text-lg font-semibold text-muted-foreground mb-5 ml-3">
        Friend List
      </h1>
      <ul className="w-full">
        {isSuccess &&
          data.pages.map((page) =>
            page.data.map((user: User, index: number) => {
              if (page.data.length === index + 1) {
                return (
                  <li ref={ref} key={user.id}>
                    <FriendList user={user} />
                  </li>
                );
              } else {
                return <FriendList user={user} key={user.id} />;
              }
            })
          )}
      </ul>
      {userCount === 0 && (
        <div className="w-full text-center text-muted-foreground">
          No friends.
        </div>
      )}
      {isLoading ||
        isFetching ||
        (isFetchingNextPage && (
          <div className="w-full">
            <Icons.spinner className="my-2 mx-auto w-6 h-6 animate-spin" />
          </div>
        ))}
    </ScrollArea>
  );
}
