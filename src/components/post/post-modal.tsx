import React from "react"
import { Image as ImageType } from "@prisma/client";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { CommentList } from "../comment/comment-list";
import Link from "next/link";
import { UserAvatar } from "../user/user-avatar";
import { PostWithUser } from "@/types";
import { UserName } from "../user/user-name";
import { LikeButton } from "./like-button";
import { LikeButtonProps } from "./like-button";
import { CommentForm } from "../forms/comment-form";

interface PostModalProps extends LikeButtonProps {
  author: string;
  open: boolean;
  onClose: () => void;
  images: ImageType[];
  postId: string;
  post: PostWithUser;
  userLink: string;
  firstName: string | null;
  lastName: string | null;
  verified: boolean;
  createdAt: string;
  currentUserId: string;
  src: string;
}

export function PostModal({
  author,
  open,
  onClose,
  images,
  postId,
  post,
  userLink,
  firstName,
  lastName,
  verified,
  createdAt,
  hasLiked,
  toggleLike,
  toggleComment,
  currentUserId,
  src,
  ...props
}: PostModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose} {...props}>
      <DialogContent className="max-h-[100vh-200px]">
        <DialogHeader>
          <DialogTitle className="text-center">{author + " post"}</DialogTitle>
        </DialogHeader>
        <Separator />
        <ScrollArea className="w-full">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Link href={userLink}>
                <UserAvatar
                  src={src}
                  alt={post.user.firstName + " " + post.user.lastName}
                  size="md"
                />
              </Link>
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
            <div>
              {images?.length
                ? images.map((image) => (
                    <Link key={image.id} href={`/post/${postId}`}>
                      <Image
                        key={image.id}
                        src={
                          images[0]?.url ?? "/images/product-placeholder.webp"
                        }
                        alt={images[0]?.url ?? images[0].imageId}
                        className="object-cover"
                        sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                        fill
                        loading="lazy"
                      />
                    </Link>
                  ))
                : null}
            </div>
            <LikeButton hasLiked={hasLiked} toggleLike={toggleLike} />
          </div>
          <div className="py-1">
            <CommentList postId={postId} currentUserId={currentUserId} />
            <CommentForm
              currentUserId={currentUserId}
              currentUserImage={src}
              postId={postId}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
