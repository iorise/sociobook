import React from "react";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

export interface LikeButtonProps {
  hasLiked: boolean;
  toggleLike: () => void;
  toggleComment?: () => void;
  likeCount: number;
  commentLength: number;
  setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function LikeButton({
  hasLiked,
  toggleLike,
  toggleComment,
  likeCount,
  commentLength,
  setModalOpen,
}: LikeButtonProps) {
  return (
    <>
      <div className="flex w-full justify-between text-muted-foreground text-sm mb-1">
        {likeCount > 0 && (
          <div className="flex items-center gap-1">
            <Icons.thumbFill className="text-facebook-primary w-4 h-4" />
            <span>{likeCount}</span>
          </div>
        )}

        {commentLength !== 0 ? (
          <div className="flex w-full justify-end">
            <span
              className="flex items-center gap-1 cursor-pointer hover:underline"
              onClick={() => setModalOpen && setModalOpen(true)}
            >
              <p>{commentLength}</p>
              <Icons.comment className="w-4 h-4 md:hidden" />
              <p className="hidden md:block">Comments</p>
            </span>
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-3 w-full">
        <Separator />
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
          <Button variant="ghost" className="flex-1 sm:flex cursor-not-allowed">
            <Icons.share className="w-5 h-5 md:w-6 md:h-6 mr-2" />
            <span>Share</span>
          </Button>
        </div>
      </div>
    </>
  );
}
