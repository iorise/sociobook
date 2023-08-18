"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { CommentWithUser } from "@/types";
import { useComments } from "@/hooks/use-comments";
import { Scrollbox } from "@/components/ui/scrollbox";
import { CommentItem } from "@/components/comment-item";
import { CommentsLoader } from "@/components/ui/comments-loader";
import { Icons } from "@/components/icons";

interface PostCommentProps {
  postId: string;
}

export function CommentList({ postId }: PostCommentProps) {
  const { data: comments, isLoading, error } = useComments(postId);

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
    <div className={cn(comments.length !== 0 ? "mt-1 mb-3" : "mt-0 mb-0")}>
      <Scrollbox>
        <div className="flex flex-col gap-1">
          {comments.map((comment: CommentWithUser) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      </Scrollbox>
    </div>
  );
}
