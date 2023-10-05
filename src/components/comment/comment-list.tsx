"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { CommentWithUser } from "@/types";
import { Scrollbox } from "@/components/ui/scrollbox";
import { CommentItem } from "@/components/comment/comment-item";
import { CommentsLoader } from "@/components/ui/comments-loader";
import { Icons } from "@/components/icons";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { BatchType } from "@/lib/limit-batch";
import { setTransition } from "@/lib/transition";

interface PostCommentProps {
  postId: string;
}

export function CommentList({ postId }: PostCommentProps) {
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
    apiUrl: `/api/comments`,
    queryKey: `comments, ${postId}`,
    postId,
    batchType: BatchType.COMMENTS,
  });

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <div className="w-full h-56">
        <CommentsLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center h-56 py-3 text-muted-foreground">
        <Icons.comment className="w-16 h-16" />
        <p className="text-xl">Something went wrong.</p>
      </div>
    );
  }

  return (
    <div className={cn(data?.pages.length !== 0 ? "mt-1 mb-3" : "mt-0 mb-0")}>
      <Scrollbox>
        <AnimatePresence mode="popLayout">
          <ul className="flex flex-col gap-1">
            {isSuccess &&
              data?.pages.map((page) =>
                page.data.map((comment: CommentWithUser, index: number) => {
                  return page.data.length === index + 1 ? (
                    <motion.li
                      layout
                      {...setTransition()}
                      ref={ref}
                      key={index}
                    >
                      <CommentItem comment={comment} key={comment.id} />
                    </motion.li>
                  ) : (
                    <motion.li layout {...setTransition()} key={comment.id}>
                      <CommentItem comment={comment} key={comment.id} />
                    </motion.li>
                  );
                })
              )}
          </ul>
        </AnimatePresence>
        {isFetchingNextPage && hasNextPage && !isLoading && (
          <div className="w-full">
            <Icons.spinner className="my-2 mx-auto w-6 h-6 animate-spin" />
          </div>
        )}
      </Scrollbox>
    </div>
  );
}
