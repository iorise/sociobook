"use client";

import * as React from "react";
import Link from "next/link";
import { User } from "@prisma/client";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { format } from "date-fns";

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
// import { useLike } from "@/hooks/use-like";
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
import { UserTooltip } from "@/components/user-tooltip";
import { PostModal } from "./post-modal";
import { LikeButton } from "./like-button";
import { AlertModal } from "../ui/alert-modal";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

interface PostProps {
  data: extendedPost;
  currentUser?: User | null;
  queryKey: string;
  hiddenImage?: boolean;
}

export function Post({ data, currentUser, queryKey, hiddenImage }: PostProps) {
  const postId = data.id;
  const [showComment, setShowComment] = React.useState(false);
  const [showMoreText, setShowMoreText] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [alertModal, setAlertModal] = React.useState(false);
  const [deletePending, startDeleteTransition] = React.useTransition();
  const [likePending, startLikeTransition] = React.useTransition();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { deletePost, isDeletingPost } = usePost(postId, queryKey);
  // const { hasLiked, toggleLike, likeCount } = useLike(postId);

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

  const src = data.user?.externalImage ?? data.user.profileImage ?? "";
  const currentUserSrc =
    currentUser?.externalImage ?? currentUser?.profileImage ?? "";
  const alt = data.user?.firstName ?? "";
  const href = `/profile/${data.user?.externalId}`;
  const firstName = data.user?.firstName;
  const lastName = data.user?.lastName || "";
  const username = firstName + (lastName ? ` ${lastName}` : "");
  const verified = data.user?.verified;
  const userCreatedAt = format(new Date(data.user.createdAt), "MMMM  d  yyyy");
  const userLink = `/profile/${data.user?.externalId}`;

  const [ref, { height }] = useMeasure();
  const hasLiked = data.likeIds.includes(currentUser?.externalId ?? "");
  const likeCount = data.likeIds.length;
  const toggleLike = () => {
    startLikeTransition(async () => {
      try {
        hasLiked
          ? await axios.delete("/api/like", { data: postId })
          : await axios.post("/api/like", postId);
      } catch (error) {
        console.log(error);
      } finally {
        // router.refresh();
        queryClient.invalidateQueries([queryKey]);
      }
    });
  };

  return (
    <>
      <PostModal
        author={username}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        images={data.images}
        postId={data.id}
        post={data}
        userLink={userLink}
        createdAt={createdAt}
        firstName={firstName}
        lastName={lastName}
        verified={verified}
        hasLiked={hasLiked}
        toggleComment={toggleComment}
        toggleLike={toggleLike}
        currentUserId={currentUser?.externalId ?? ""}
        src={currentUserSrc}
        commentLength={data.comments.length}
        likeCount={likeCount}
        queryKey={queryKey }
      />
      <AlertModal
        isOpen={alertModal}
        onClose={() => setAlertModal(false)}
        loading={deletePending}
        onConfirm={() =>
          startDeleteTransition(async () => {
            try {
              await deletePost();
              setAlertModal(false);
            } catch (error) {
              console.log(error);
            }
          })
        }
      />
      <MotionConfig transition={{ duration: 0.3 }}>
        <Card className="rounded-sm">
          <CardHeader className="space-y-1 md:space-y-1.5 p-4">
            <div className="flex justify-between">
              <div className="flex gap-1.5 md:gap-2 items-center">
                <UserTooltip
                  firstName={firstName}
                  lastName={lastName}
                  verified={verified}
                  userCreatedAt={userCreatedAt}
                  imageUrl={src}
                  href={href}
                  size="lg"
                  larger
                >
                  <Link href={href}>
                    <UserAvatar src={src} alt={alt} size="md" />
                  </Link>
                </UserTooltip>
                <div className="flex flex-col">
                  <Link href={userLink}>
                    <UserName
                      firstName={firstName}
                      lastName={lastName}
                      verified={verified}
                      className="md:text-lg font-medium"
                    />
                  </Link>
                  <span className="font-light text-muted-foreground text-[0.6rem] md:text-xs leading-3">
                    {createdAt}
                  </span>
                </div>
              </div>

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
                  {postByCurrentUser && (
                    <Button
                      variant="ghost"
                      onClick={() => setAlertModal(true)}
                      disabled={isDeletingPost}
                      className="rounded-md w-full"
                    >
                      <Icons.trash className="w-4 h-4 mr-2" />

                      <span className="font-medium text-sm">Delete</span>
                    </Button>
                  )}
                  <Button variant="ghost" className="rounded-md w-full" asChild>
                    <Link href={`/posts/${data.id}`}>See post</Link>
                  </Button>
                </PopoverContent>
              </Popover>
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
              {!hiddenImage && 
              (

              <div
                className={cn(
                  "w-full grid",
                  data.images.length > 1
                    ? "grid-cols-2 relative gap-1"
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
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col text-muted-foreground">
            <LikeButton
              hasLiked={hasLiked}
              toggleLike={toggleLike}
              toggleComment={toggleComment}
              commentLength={data.comments.length}
              likeCount={likeCount}
              setModalOpen={setModalOpen}
            />
            <div className="w-full">
              <motion.div
                animate={{ height }}
                className="overflow-hidden w-full"
              >
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
                          <CommentList
                            postId={postId}
                            currentUserId={currentUser?.externalId as string}
                          />
                          <CommentForm
                            currentUserId={currentUser?.externalId as string}
                            currentUserImage={currentUserSrc}
                            postId={postId}
                            queryKey={queryKey}
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
    </>
  );
}
