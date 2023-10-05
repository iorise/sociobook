"use client";

import { format } from "date-fns";
import * as React from "react";
import Link from "next/link";
import { formatDates } from "@/lib/utils";
import { CommentWithUser } from "@/types";
import { UserName } from "@/components/user/user-name";
import { UserAvatar } from "@/components/user/user-avatar";
import { UserTooltip } from "@/components/user-tooltip";

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
    <div className="flex gap-2">
      <div>
        <UserTooltip
          imageUrl={src}
          firstName={firstName}
          lastName={lastName}
          verified={verified}
          userCreatedAt={userCreatedAt}
          href={linkProfile}
          size="md"
        >
          <Link
            href={linkProfile}
            className="flex hover:brightness-105 transition-all duration-150 active:scale-95"
          >
            <UserAvatar src={src} size="xs" />
          </Link>
        </UserTooltip>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex flex-col bg-accent rounded-xl p-2">
          <div className="flex">
            <Link href={linkProfile}>
              <UserName
                firstName={firstName}
                lastName={lastName}
                verified={verified}
                className="text-xs md:text-sm font-medium text-foreground"
                iconClassName="h-3 w-3"
              />
            </Link>
          </div>
          <p className="text-xs md:text-sm font-normal text-foreground">
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
  );
}
