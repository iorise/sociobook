"use client";

import * as React from "react";
import Link from "next/link";
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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { usePost } from "@/hooks/use-post";
import {ImagePreview} from "@/components/image-preview";

interface PostProps {
  data: extendedPost;
  currentUser: User | null;
}

export function Post({ data, currentUser }: PostProps) {
  const postId = data.id;
  const [showComment, setShowComment] = React.useState(false);
  const [showMoreText, setShowMoreText] = React.useState(false);
  const { deletePost, isDeletingPost } = usePost(postId);
  const { hasLiked, toggleLike, likeCount } = useLike(postId);

  const postByCurrentUser = React.useMemo(() => {
    return data.userId === currentUser?.externalId;
  }, [data.userId, currentUser?.externalId]);

  const createdAt = React.useMemo(() => {
    return formatDates(data.createdAt);
  }, [data.createdAt]);

  const toggleComment = React.useCallback(() => {
    setShowComment((prev) => !prev);
  }, []);

  const toggleShowMoreText = React.useCallback(() => {
    setShowMoreText((prev) => !prev);
  }, []);

  const onDelete = React.useCallback(async () => {
    await deletePost();
  }, [deletePost]);

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader className="space-y-1 p-4">
          <div className="flex justify-between">
            <Link href={`/profile/${data.user?.externalId}`}>
              <div className="flex gap-2 items-center">
                <Avatar>
                  <AvatarImage
                    src={
                      data.user?.externalImage ?? data.user.profileImage ?? ""
                    }
                    alt={data.user?.firstName ?? ""}
                  />
                  <AvatarFallback>
                    <img src="/images/placeholder.png" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col px-[-1rem]">
                  <UserName
                    firstName={data.user?.firstName}
                    lastName={data.user?.lastName}
                    verified={data.user?.verified}
                    className="text-lg font-medium"
                  />
                  <span className="font-normal text-muted-foreground text-xs">
                    {createdAt}
                  </span>
                </div>
              </div>
            </Link>
            {postByCurrentUser && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="rounded-full">
                    <Icons.moreHorizontal className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-40 bg-background p-2"
                  align="end"
                  sideOffset={2}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onDelete}
                    disabled={isDeletingPost}
                    className="rounded-md w-full"
                  >
                    {isDeletingPost ? (
                      <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Icons.trash className="w-4 h-4 mr-2" />
                    )}
                    <span className="font-medium text-sm">Delete</span>
                  </Button>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full flex flex-col">
            <p
              onClick={toggleShowMoreText}
              className={cn(
                "break-words",
                showMoreText
                  ? "line-clamp-none"
                  : data.images.length
                  ? `line-clamp-3`
                  : "line-clamp-6"
              )}
            >
              {data.text}
            </p>
              <div className={cn(data.images.length > 1 ? "w-full grid grid-cols-2 gap-1 relative rounded-md" : "w-full grid grid-cols-1")}>
                {data.images.map((image, i) => (
                  <ImagePreview
                    key={i}
                    imageData={image}
                    i={i}
                    imagesLength={data.images.length}
                    imagesPreview={data.images}
                  />
                ))}
              </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col text-muted-foreground">
          <div className="flex w-full justify-between text-muted-foreground text-sm mb-1">
            {likeCount > 0 && (
              <div className="flex items-center gap-1">
                <Icons.thumbFill className="text-facebook-primary w-4 h-4" />
                <span>{likeCount}</span>
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
