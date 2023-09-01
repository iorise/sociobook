"use client";

import * as React from "react";
import { formatDates } from "@/lib/utils";
import { CommentWithUser } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserName } from "@/components/ui/user-name";

interface CommentItemProps {
  comment: CommentWithUser;
}

export function CommentItem({ comment }: CommentItemProps) {
  const createdAt = React.useMemo(() => {
    return formatDates(comment.createdAt);
  }, [comment.createdAt]);
  return (
    <div>
      <div className="flex gap-2">
        <Avatar className="h-6 w-6">
          <AvatarImage
            src={
              comment.author.externalImage ?? comment.author.profileImage ?? ""
            }
          />
          <AvatarFallback>
            <img src="/images/placeholder.png" alt="Placeholder" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <div className="flex flex-col bg-accent rounded-xl p-2">
            <UserName
              firstName={comment.author.firstName}
              lastName={comment.author.lastName || ""}
              verified={comment.author.verified}
              className="text-sm font-medium text-foreground"
              iconClassName="h-3 w-3"
            />
            <p className="text-sm font-normal text-foreground">
              {comment.text}
            </p>
          </div>
          <div className="flex ml-2 gap-3 text-xs font-medium text-muted-foreground">
            <p>Like</p>
            <p>Reply</p>
            <p>{createdAt}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
