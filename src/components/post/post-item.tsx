"use client";

import * as React from "react";
import Link from "next/link";
import { User } from "@prisma/client";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { extendedPost } from "@/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn, formatDates } from "@/lib/utils";
import { CommentForm } from "@/components/forms/comment-form";
import { CommentList } from "@/components/comment/comment-list";
import { useLike } from "@/hooks/use-like";
import { UserName } from "@/components/user/user-name";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePost } from "@/hooks/use-post";
import { ImagePreview } from "@/components/image/image-preview";
import { UserAvatar } from "@/components/user/user-avatar";
import useMeasure from "react-use-measure";
import { setTransition } from "@/lib/transition";

interface PostProps {
  data: extendedPost;
  currentUser?: User | null;
  queryKey: string;
}

export function Post({ data, currentUser, queryKey }: PostProps) {
  const postId = data.id;
  const [showComment, setShowComment] = React.useState(false);
  const [showMoreText, setShowMoreText] = React.useState(false);

  const { deletePost, isDeletingPost } = usePost(postId, queryKey);
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

  const src = data.user?.externalImage ?? data.user.profileImage ?? "";
  const alt = data.user?.firstName ?? "";

  const [ref, { height }] = useMeasure();

  return (
    <MotionConfig transition={{ duration: 0.6 }}>
      <Card className="rounded-sm">
        <CardHeader className="space-y-1 md:space-y-1.5 p-4">
          <div className="flex justify-between">
            <Link href={`/profile/${data.user?.externalId}`}>
              <div className="flex gap-1.5 md:gap-2 items-center">
                <UserAvatar src={src} alt={alt} size="md" />
                <div className="flex flex-col">
                  <UserName
                    firstName={data.user?.firstName}
                    lastName={data.user?.lastName}
                    verified={data.user?.verified}
                    className="md:text-lg font-medium"
                  />
                  <span className="font-light text-muted-foreground text-[0.6rem] md:text-xs leading-3">
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
                "break-words text-sm md:text-base",
                showMoreText
                  ? "line-clamp-none"
                  : data.images.length
                  ? `line-clamp-3`
                  : "line-clamp-6",
                "whitespace-pre-line"
              )}
            >
              {data.text}
            </p>
            <div
              className={cn(
                "w-full grid",
                data.images.length > 1
                  ? "grid-cols-2 gap-1 relative rounded-md"
                  : "grid-cols-1"
              )}
            >
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
                <Icons.thumb className={cn("w-5 h-5 md:w-6 md:h-6 mr-2")} />
                <span>Like</span>
              </span>
            </Button>
            <Button
              variant="ghost"
              className="flex-1 active:scale-95"
              onClick={toggleComment}
            >
              <Icons.comment className="w-5 h-5 md:w-6 md:h-6 mr-2" />
              <span>Comment</span>
            </Button>
            <Button
              variant="ghost"
              className="flex-1 sm:flex cursor-not-allowed"
            >
              <Icons.share className="w-5 h-5 md:w-6 md:h-6 mr-2" />
              <span>Share</span>
            </Button>
          </div>
          <div className="w-full">
            <motion.div animate={{ height }} className="overflow-hidden w-full">
              {showComment && (
                <>
                  <AnimatePresence>
                    <div ref={ref} className="w-full py-1">
                      <Separator className="mt-2" />
                      <motion.div
                        layout
                        {...setTransition({
                          duration: 0.5,
                        })}
                        className="w-full flex flex-col pt-2"
                      >
                        <CommentList postId={postId} />
                        <CommentForm
                          currentUser={currentUser}
                          postId={postId}
                        />
                      </motion.div>
                    </div>
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          </div>
        </CardFooter>
      </Card>
    </MotionConfig>
  );
}
