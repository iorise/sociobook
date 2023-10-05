"use client";

import * as React from "react";
import { User } from "@prisma/client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { FriendListItem } from "@/components/list/friend-list-item";
import { Icons } from "@/components/icons";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { BatchType } from "@/lib/limit-batch";
import { AnimatePresence, motion } from "framer-motion";
import { setTransition } from "@/lib/transition";

export function Aside() {
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isSuccess,
    isFetchingNextPage,
    isFetching,
    ref,
    inView,
  } = useInfiniteScroll({
    apiUrl: "/api/friends",
    queryKey: "friendList",
    batchType: BatchType.FRIENDS,
  });
  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage, isFetchingNextPage]);

  return (
    <ScrollArea className="w-full h-[calc(100vh_-_3.5rem)]">
      <h1 className="text-lg font-semibold text-muted-foreground mb-5 ml-3">
        Friend List
      </h1>
      <AnimatePresence mode="popLayout">
        <ul className="w-full">
          {(isSuccess && data?.pages.length === 0) ||
          data?.pages[0].data.length === 0 ? (
            <div className="w-full text-center text-muted-foreground">
              No friends.
            </div>
          ) : (
            data?.pages.map((page) =>
              page.data.map((user: User, index: number) => {
                return page.data.length === index + 1 ? (
                  <motion.li layout {...setTransition()} ref={ref} key={index}>
                    <FriendListItem user={user} />
                  </motion.li>
                ) : (
                  <motion.li
                    layout
                    {...setTransition()}
                    ref={ref}
                    key={user.id}
                  >
                    <FriendListItem user={user} key={user.id} />
                  </motion.li>
                );
              })
            )
          )}
        </ul>
      </AnimatePresence>
      {isLoading || isFetchingNextPage ? (
        <div className="w-full">
          <Icons.spinner className="my-2 mx-auto w-6 h-6 animate-spin" />
        </div>
      ) : null}
    </ScrollArea>
  );
}
