import React from "react";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

export interface LikeButtonProps {
  hasLiked: boolean;
  toggleLike: () => void;
  toggleComment?: () => void;
}

export function LikeButton({
  hasLiked,
  toggleLike,
  toggleComment,
}: LikeButtonProps) {
  return (
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
  );
}
