import { formatDates } from "@/lib/utils";
import { CommentWithUser } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

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
        <div>
          <div className="flex flex-col bg-accent rounded-xl p-2">
            <p className="text-sm font-medium text-foreground">
              {comment.author.firstName} {comment.author.lastName}
            </p>
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
