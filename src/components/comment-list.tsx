"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { CommentWithUser } from "@/types";
import { useComments } from "@/hooks/use-comments";
import { Scrollbox } from "@/components/ui/scrollbox";
import { CommentItem } from "@/components/comment-item";
import { CommentsLoader } from "@/components/ui/comments-loader";

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
      <div className="w-full text-center h-24 py-3">Cannot fetch comment</div>
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
