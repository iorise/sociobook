"use client";

import { format } from "date-fns";
import * as React from "react";
import { formatDates } from "@/lib/utils";
import { CommentWithUser } from "@/types";
import { UserName } from "@/components/ui/user-name";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserAvatar } from "./user-avatar";
import Link from "next/link";

interface CommentItemProps {
  comment: CommentWithUser;
}

export function CommentItem({ comment }: CommentItemProps) {
  const userCreatedAt = format(
    new Date(comment.author.createdAt),
    "MMMM  d  yyyy"
  );
  const createdAt = React.useMemo(() => {
    return formatDates(comment.createdAt);
  }, [comment.createdAt]);

  const src = comment.author.externalImage ?? comment.author.profileImage ?? "";
  const linkProfile = `/profile/${comment.author.externalId}`;
  const firstName = comment.author.firstName;
  const lastName = comment.author.lastName || "";
  const verified = comment.author.verified;

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <div className="flex gap-2">
          <div>
            <TooltipTrigger asChild>
              <Link
                href={linkProfile}
                className="flex hover:brightness-105 transition-all duration-150 active:scale-95"
              >
                <UserAvatar src={src} size="xs" />
              </Link>
            </TooltipTrigger>
          </div>
          <TooltipContent className="bg-card shadow-glow-sm border">
            <div className="flex items-center justify-center gap-3">
              <UserAvatar src={src} size="md" />
              <div className="flex flex-col gap-2">
                <UserName
                  firstName={firstName}
                  lastName={lastName}
                  verified={verified}
                  className="text-sm font-medium text-foreground"
                  iconClassName="h-3 w-3"
                />
                <p className="text-muted-foreground">Joined: {userCreatedAt}</p>
              </div>
            </div>
          </TooltipContent>

          <div className="flex flex-col gap-1">
            <div className="flex flex-col bg-accent rounded-xl p-2">
              <div className="flex">
                <Link href={linkProfile}>
                  <UserName
                    firstName={firstName}
                    lastName={lastName}
                    verified={verified}
                    className="text-sm font-medium text-foreground hover:underline"
                    iconClassName="h-3 w-3"
                  />
                </Link>
              </div>
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
      </Tooltip>
    </TooltipProvider>
  );
}
