"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Input, InputProps } from "@/components/ui/input";

interface CommentInputProps extends InputProps {
  onSubmit: () => void;
  isLoading: boolean
  disabled: boolean;
}

const CommentInput = React.forwardRef<HTMLInputElement, CommentInputProps>(
  ({ className, onSubmit, disabled, isLoading, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <Input
          className={cn(
            "pr-10 border-0 focus-visible:ring-0 rounded-full",
            className
          )}
          ref={ref}
          disabled={isLoading}
          {...props}
        />
        <Button
          onClick={(e) => {
            e.preventDefault()
            onSubmit()}}
          disabled={disabled}
          variant="ghost"
          className="absolute right-0 bottom-0 px-3 py-2 text-muted-foreground disabled:cursor-not-allowed disabled:pointer-events-auto hover:bg-inherit"
        >
            {isLoading ? (
          <Icons.spinner className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Icons.send className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="sr-only">Send comment</span>
        </Button>
      </div>
    );
  }
);
CommentInput.displayName = "CommentInput";

export { CommentInput };
