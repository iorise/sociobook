"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Textarea, TextareaProps } from "@/components/ui/textarea";

const PostInput = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        <Textarea className={cn("pr-10", className)} ref={ref} {...props} />
        <Button
          disabled
          variant="ghost"
          className="absolute right-0 bottom-0 px-3 py-2 text-muted-foreground disabled:cursor-not-allowed disabled:pointer-events-auto hover:bg-inherit"
        >
          <Icons.emoji className="w-5 h-5" />
        </Button>
      </div>
    );
  }
);
PostInput.displayName = "PostInput";

export { PostInput };
