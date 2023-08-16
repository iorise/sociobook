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
import {
  CommentWithUser,
  extendedPost,
} from "@/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn, formatDates } from "@/lib/utils";
import Link from "next/link";
import { CommentForm } from "@/components/forms/comment-form";
import { PostComment } from "@/components/post-comment";
import { ScrollArea } from "@/components/ui/scroll-area";
import {useComment} from "@/hooks/use-comment";
import { useLike } from "@/hooks/use-like";

interface FeedProps {
  data: extendedPost;
  currentUser: User | null;
}

export function Feed({ data, currentUser }: FeedProps) {
  const [isComment, setIsComment] = React.useState(false);
  
  const postId = data.id;

  const { data: commentsData, isLoading: commentsLoading } = useComment(postId);

  const { hasLiked, toggleLike } = useLike({
    postId,
    userId: currentUser?.externalId ?? "",
  });

  const createdAt = React.useMemo(() => {
      return formatDates(data.createdAt)
  }, [data.createdAt])

  const toggleComment = React.useCallback(() => {
    setIsComment((prev) => !prev);
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
              <span className="flex text-lg font-medium items-center gap-1">
                {data.user?.firstName} {data.user?.lastName}
                <span>
                  {data.user.verified && (
                    <Icons.verified className="w-[0.87rem] h-[0.87rem] ml-1" />
                  )}
                </span>
              </span>
              <span className="font-normal text-muted-foreground text-xs">
                {createdAt}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <Link href={`/post/${data.id}`}>{data.text}</Link>
            {data.image ? (
              <Image
                src={data.image}
                alt="image"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                width={300}
                height={300}
                className="object-cover w-full aspect-square object-center"
                loading="lazy"
              />
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col text-muted-foreground">
          <div className="flex w-full justify-between text-muted-foreground text-xs mb-1">
            {hasLiked ?? data.likeIds.length != 0 ? (
              <div className="flex items-center gap-1">
                <Icons.thumbFill className="w-4 h-4 text-facebook-primary" />
                <span>{data.likeIds.length}</span>
              </div>
            ) : null}
            <p className="w-full flex justify-end hover:underline cursor-pointer">
              {data.comments.length} comments
            </p>
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
            <Button variant="ghost" className="flex-1" onClick={toggleComment}>
              <Icons.comment className="w-6 h-6 mr-2" />
              <span>Comment</span>
            </Button>
            <Button variant="ghost" className="flex-1 sm:flex">
              <Icons.share className="w-6 h-6 mr-2" />
              <span>Share</span>
            </Button>
          </div>
          {isComment ? (
            <div className="flex flex-col w-full pt-2 gap-2">
              {commentsData && commentsData.length > 0 ? (
                <ScrollArea className="w-full h-44 rounded-lg">
                  <div className="p-2">
                    {commentsData
                      ? commentsData.map((comment: CommentWithUser) => (
                          <PostComment data={comment} />
                        ))
                      : commentsLoading
                      ? "Loading comments..."
                      : "Error loading comments."}
                  </div>
                </ScrollArea>
              ) : null}
              <CommentForm currentUser={currentUser} postId={data.id} />
            </div>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
}
