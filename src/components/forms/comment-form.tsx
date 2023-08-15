"use client";

import * as React from "react";
import { User } from "@prisma/client";
import { useInputState } from "@mantine/hooks";
import type { z } from "zod";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";

import { commentSchema } from "@/lib/validations/comment";
import { CommentInput } from "@/components/inputs/comment-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";

interface CommentFormProps {
  currentUser: User | null;
  postId: string | null;
}

type Inputs = z.infer<typeof commentSchema>;

export function CommentForm({ currentUser, postId }: CommentFormProps) {
  const [commentValue, setCommentValue] = useInputState("");

  const queryClient = useQueryClient();

  const { mutateAsync: mutateComment, isLoading } = useMutation({
    mutationFn: async (data: Inputs) =>
      await axios.post(`/api/comment?postId=${postId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["comment", postId]);
      queryClient.invalidateQueries(["posts"]);
      toast.success("Your Comment has been published.", {
        position: "bottom-left",
      });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const onSubmit = React.useCallback(async () => {
    try {
      await mutateComment({ text: commentValue });
      setCommentValue("");
    } catch (error) {
      console.error(error);
    }
  }, [mutateComment, commentValue]);
  return (
    <div className="flex item w-full items-center">
      <Avatar className="w-8 h-8 mr-2">
        <AvatarImage
          src={currentUser?.externalImage ?? currentUser?.profileImage ?? ""}
        />
        <AvatarFallback>
          <img src="/images/placeholder.png" alt="placeholder" />
        </AvatarFallback>
      </Avatar>
      <Input
        className="rounded-full text-foreground focus-visible:ring-0"
        type="text"
        placeholder="Write a comment..."
        value={commentValue}
        onChange={setCommentValue}
      />
      <Button
        disabled={isLoading || commentValue.trim() === ""}
        size="sm"
        variant="none"
        className=" text-white justify-end disabled:cursor-not-allowed"
        onClick={() => onSubmit()}
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
