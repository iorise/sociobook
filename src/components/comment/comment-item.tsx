"use client";

import { format } from "date-fns";
import * as React from "react";
import Link from "next/link";
import { cn, formatDates } from "@/lib/utils";
import { CommentWithUser } from "@/types";
import { UserName } from "@/components/user/user-name";
import { UserAvatar } from "@/components/user/user-avatar";
import { UserTooltip } from "@/components/user-tooltip";
import { Icons } from "../icons";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

interface CommentItemProps {
  comment: CommentWithUser;
  queryKey: string;
  currentUserId: string;
}

export function CommentItem({
  comment,
  queryKey,
  currentUserId,
}: CommentItemProps) {
  const [likePending, startLikeTransition] = React.useTransition();
  const queryClient = useQueryClient();
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
  const hasLiked = comment.likeIds.includes(currentUserId || "");

  const commentId = comment.id;

  const toggleLike = () => {
    startLikeTransition(async () => {
      try {
        hasLiked
          ? await axios.delete("/api/comment/like", { data: commentId })
          : await axios.post("/api/comment/like", commentId);
      } catch (error) {
        console.log(error);
      } finally {
        queryClient.invalidateQueries([queryKey]);
      }
    });
  };

  return (
    <>
      <div className="flex gap-2 ">
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
        <div className="flex flex-col gap-1 relative">
          <div className="flex gap-2 items-center">
            <div className="flex flex-col bg-accent rounded-xl p-2">
              <Link href={linkProfile}>
                <UserName
                  firstName={firstName}
                  lastName={lastName}
                  verified={verified}
                  className="text-xs md:text-sm font-medium text-foreground"
                  iconClassName="h-3 w-3"
                />
              </Link>
              <p className="text-xs md:text-sm font-normal text-foreground">
                {comment.text}
              </p>
            </div>
          </div>
          <div className="flex ml-2 gap-3 text-xs font-medium text-muted-foreground">
            <p
              onClick={toggleLike}
              className={cn(
                hasLiked && "text-facebook-primary",
                "cursor-pointer hover:underline"
              )}
            >
              Like
            </p>
            <p>Reply</p>
            <p>{createdAt}</p>
          </div>
          {hasLiked && (
            <Icons.thumbFill className="w-3 h-3 absolute bottom-4 right-0" />
          )}
        </div>
      </div>
    </>
  );
}
