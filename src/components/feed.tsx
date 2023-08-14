"use client";

import * as React from "react";
import Image from "next/image";
import { formatDistanceToNowStrict } from "date-fns";
import axios from "axios";
import { Comment, User } from "@prisma/client";

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
  PostWithUser,
  extendedComment,
  extendedPost,
} from "@/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import usePost from "@/hooks/use-post";
import { usePosts } from "@/hooks/use-posts";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CommentForm } from "@/components/forms/comment-form";
import { PostComment } from "@/components/post-comment";
import { ScrollArea } from "@/components/ui/scroll-area";
import { commentSchema } from "@/lib/validations/comment";
import useComment from "@/hooks/use-comment";

interface FeedProps {
  data: extendedPost;
  currentUser: User | null;
  comments: Comment[];
}

export function Feed({ data, currentUser, comments }: FeedProps) {
  const postId = data.id;
  const [isComment, setIsComment] = React.useState(false);
  const { mutate: mutateFetchedPost } = usePost(postId);
  const { mutate: mutateFetchedPosts } = usePosts();

  const {
    data: commentsData,
    isLoading: commentsLoading,
    error: commentsError,
  } = useComment(postId);

  const hasLiked = React.useMemo(() => {
    const list = data.likeIds || [];

    return list.includes(currentUser?.externalId ?? "");
  }, [data, currentUser]);

  const toggleLike = React.useCallback(async () => {
    try {
      let request;

      if (hasLiked) {
        request = () => axios.delete(`/api/like`, { data: postId });
      } else {
        request = () => axios.post(`/api/like`, postId);
      }

      await request();
      mutateFetchedPost();
      mutateFetchedPosts();
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  }, [currentUser, hasLiked, postId, mutateFetchedPost, mutateFetchedPosts]);

  const createdAt = React.useMemo(() => {
    if (!data?.createdAt) {
      return null;
    }
    return formatDistanceToNowStrict(new Date(data.createdAt));
  }, [data.createdAt]);

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
            {data.likeIds.length >= 1 ? (
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
            <Button variant="ghost" className="flex-1" onClick={toggleLike}>
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
