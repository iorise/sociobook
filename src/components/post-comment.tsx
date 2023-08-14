"use client";

import * as React from "react";
import { CommentWithUser, extendedComment } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNowStrict } from "date-fns";

interface PostCommentProps {
  data: CommentWithUser;
}

export function PostComment({ data }: PostCommentProps) {
  const createdAt = React.useMemo(() => {
    if (!data?.createdAt) {
      return null;
    }
    return formatDistanceToNowStrict(new Date(data.createdAt));
  }, [data.createdAt]);
  return (
    <div className="flex gap-2">
      <Avatar className="h-6 w-6">
        <AvatarImage
          src={data.author.externalImage ?? data.author.profileImage ?? ""}
        />
        <AvatarFallback>
          <img src="/images/placeholder.png" alt="Placeholder" />
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="flex flex-col bg-accent rounded-xl p-1">
          <p className="text-sm font-medium text-foreground">
            {data.author.firstName} {data.author.lastName}
          </p>
          <p className="text-xs">{data.text}</p>
        </div>
        <div className="flex ml-2 gap-3 text-xs font-medium text-muted-foreground">
          <p>Like</p>
          <p>Reply</p>
          <p>{createdAt}</p>
        </div>
      </div>
    </div>
  );
}
