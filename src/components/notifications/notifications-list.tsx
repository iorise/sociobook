"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

import { Icons } from "@/components/icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationLoader } from "@/components/ui/notification-loader";
import { NotificationItem } from "@/components/notifications/notifications-item";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { BatchType } from "@/lib/limit-batch";
import { NotificationWithUser } from "@/types";
import { setTransition } from "@/lib/transition";

export function NotificationList() {
  const queryClient = useQueryClient();
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
    apiUrl: "/api/notifications",
    queryKey: "notifications",
    batchType: BatchType.NOTIFICATIONS,
  });

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage, isFetchingNextPage]);

  React.useEffect(() => {
    queryClient.invalidateQueries(["currentUser"]);
  }, [isSuccess]);

  return (
    <ScrollArea className="h-[calc(100vh_-_7rem)] w-full rounded-md">
      {isSuccess && (
        <AnimatePresence mode="popLayout">
          <ul className="w-full">
            {data?.pages.map((page) =>
              page.data.map((notification: NotificationWithUser, i: number) => {
                return page.data.length === i + 1 ? (
                  <motion.li
                    layout
                    {...setTransition()}
                    ref={ref}
                    key={i}
                    className="py-3 mx-1"
                  >
                    <NotificationItem notification={notification} />
                  </motion.li>
                ) : (
                  <motion.li
                    layout
                    {...setTransition()}
                    key={notification.id}
                    className="py-3 mx-1"
                  >
                    <NotificationItem notification={notification} />
                  </motion.li>
                );
              })
            )}
          </ul>
        </AnimatePresence>
      )}
      {isLoading ? (
        <NotificationLoader />
      ) : error ? (
        <div className="w-full text-center pt-5">Something went wrong</div>
      ) : data?.pages.length === 0 || data?.pages[0].data.length === 0 ? (
        <div className="grid gap-5">
          <h1 className="text-xl font-semibold">Notifications</h1>
          <div className="w-full flex flex-col gap-3 items-center justify-center py-6">
            <Icons.notification className="w-16 h-16" />
            <p className="text-muted-foreground">
              Quiet on the Notification Front
            </p>
          </div>
        </div>
      ) : null}
      {isFetchingNextPage && hasNextPage && !isLoading && (
        <div className="w-full">
          <Icons.spinner className="my-2 mx-auto w-6 h-6 animate-spin" />
        </div>
      )}
    </ScrollArea>
  );
}
