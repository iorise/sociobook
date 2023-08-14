"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Input, InputProps } from "@/components/ui/input";

const CommentInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <Input
          className={cn(
            "pr-10 border-0 focus-visible:ring-0 rounded-full",
            className
          )}
          ref={ref}
          {...props}
        />
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
CommentInput.displayName = "CommentInput";

export { CommentInput };
