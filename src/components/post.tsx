"use client";

import * as React from "react";
import Image from "next/image";
import { User } from "@prisma/client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Icons } from "@/components/icons";
import { extendedPost } from "@/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn, formatDates } from "@/lib/utils";
import { CommentForm } from "@/components/forms/comment-form";
import { CommentList } from "@/components/comment-list";
import { useLike } from "@/hooks/use-like";
import { UserName } from "@/components/ui/user-name";

interface PostProps {
  data: extendedPost;
  currentUser: User | null ;
}

export function Post({ data, currentUser }: PostProps) {
  const [showComment, setShowComment] = React.useState(false);
  const [showMoreText, setShowMoreText] = React.useState(false);

  const postId = data.id;

  const { hasLiked, toggleLike } = useLike(postId);

  const createdAt = React.useMemo(() => {
    return formatDates(data.createdAt);
  }, [data.createdAt]);

  const toggleComment = React.useCallback(() => {
    setShowComment((prev) => !prev);
  }, []);

  const toggleShowMoreText = React.useCallback(() => {
    setShowMoreText((prev) => !prev);
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader className="space-y-1 p-4">
          <div className="flex gap-2 items-center">
            <Avatar>
              <AvatarImage
                src={data.user?.externalImage ?? data.user.profileImage ?? ""}
                alt={data.user?.firstName ?? ""}
              />
              <AvatarFallback>
                <img src="/images/placeholder.png" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col px-[-1rem]">
              <UserName
                firstName={currentUser?.firstName}
                lastName={currentUser?.lastName}
                verified={currentUser?.verified}
                className="text-lg font-medium"
              />
              <span className="font-normal text-muted-foreground text-xs">
                {createdAt}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <p
              onClick={toggleShowMoreText}
              className={cn(
                "mb-2",
                showMoreText ? "line-clamp-none" : "line-clamp-3"
              )}
            >
              {data.text}
            </p>
            {data?.images?.length > 1 ? (
              <div className="w-full grid grid-cols-2 gap-1 relative rounded-md">
                {data.images.map((image, i) => (
                  <Image
                    key={i}
                    src={image.url || ""}
                    alt="image"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    width={300}
                    height={300}
                    className={cn(
                      "object-cover object-center w-full h-full",
                      data.images.length === 3 && i === 2
                        ? "col-span-2 aspect-[2/1]"
                        : "col-span-1"
                    )}
                    loading="lazy"
                  />
                ))}
              </div>
            ) : (
              data.images.map((image, i) => (
                <Image
                  key={i}
                  src={image.url || ""}
                  alt="image"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  width={300}
                  height={300}
                  className="object-cover object-center w-full h-full rounded-md"
                  loading="lazy"
                />
              ))
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col text-muted-foreground">
          <div className="flex w-full justify-between text-muted-foreground text-sm mb-1">
            {data.likeIds.length !== 0 && (
              <div className="flex items-center gap-1">
                <Icons.thumbFill className="text-facebook-primary w-4 h-4" />
                <span>{data.likeIds.length}</span>
              </div>
            )}

            {data.comments.length !== 0 ? (
              <div className="flex w-full justify-end">
                <div>
                  <span className="flex items-center gap-1">
                    <p>{data.comments.length}</p>
                    <Icons.comment className="w-4 h-4 md:hidden" />
                    <p className="hidden md:block">Comments</p>
                  </span>
                </div>
              </div>
            ) : null}
          </div>
          <Separator className="mb-2" />
          <div className="flex w-full text-base font-medium">
            <Button
              variant="ghost"
              className="flex-1 active:scale-95"
              onClick={() => toggleLike()}
            >
              <span
                className={cn(
                  "flex items-center",
                  hasLiked ? "text-facebook-primary" : "text-muted-foreground"
                )}
              >
                <Icons.thumb className={cn("w-6 h-6 mr-2")} />
                <span>Like</span>
              </span>
            </Button>
            <Button
              variant="ghost"
              className="flex-1 active:scale-95"
              onClick={toggleComment}
            >
              <Icons.comment className="w-6 h-6 mr-2" />
              <span>Comment</span>
            </Button>
            <Button
              variant="ghost"
              className="flex-1 sm:flex cursor-not-allowed"
              disabled
            >
              <Icons.share className="w-6 h-6 mr-2" />
              <span>Share</span>
            </Button>
          </div>
          {showComment && (
            <>
              <Separator className="mt-2" />
              <div className="w-full flex flex-col pt-2">
                <CommentList postId={postId} />
                <CommentForm currentUser={currentUser} postId={postId} />
              </div>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
