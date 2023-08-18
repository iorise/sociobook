"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { CommentWithUser } from "@/types";
import { useComments } from "@/hooks/use-comments";
import { Scrollbox } from "@/components/ui/scrollbox";
import { CommentItem } from "@/components/comment-item";
import { CommentsLoader } from "@/components/ui/comments-loader";
import { Icons } from "@/components/icons";
import { useInView } from "react-intersection-observer";

interface PostCommentProps {
  postId: string;
}

export function CommentList({ postId }: PostCommentProps) {
  const { ref, inView } = useInView();
  const {
    data,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isSuccess,
    isFetchingNextPage,
  } = useComments(postId);

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

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
        <div className="flex flex-col gap-1">
          {isSuccess &&
            data?.pages.map((page) =>
              page.data.map((comment: CommentWithUser, index: number) => {
                if (page.data.length === index + 1) {
                  return (
                    <div ref={ref} key={index}>
                      <CommentItem comment={comment} key={comment.id} />
                    </div>
                  );
                } else {
                  return <CommentItem comment={comment} key={comment.id} />;
                }
              })
            )}
          {isFetchingNextPage && hasNextPage && !isLoading && (
            <div className="w-full">
              <Icons.spinner className="my-2 mx-auto w-6 h-6 animate-spin" />
            </div>
          )}
        </div>
      </Scrollbox>
    </div>
  );
}
