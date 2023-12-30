"use client";

import * as React from "react";
import { User } from "@prisma/client";
import { useInputState } from "@mantine/hooks";
import type { z } from "zod";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import qs from "query-string";

import { commentSchema } from "@/lib/validations/comment";
import { CommentInput } from "@/components/input/comment-input";
import { UserAvatar } from "@/components/user/user-avatar";

interface CommentFormProps {
  currentUserId: string;
  postId: string | null;
  currentUserImage: string;
}

type Inputs = z.infer<typeof commentSchema>;

export function CommentForm({
  currentUserId,
  postId,
  currentUserImage,
}: CommentFormProps) {
  const [commentValue, setCommentValue] = useInputState("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const queryClient = useQueryClient();

  const { mutateAsync: mutateComment, isLoading } = useMutation({
    mutationFn: async (data: Inputs) => {
      const url = qs.stringifyUrl({
        url: "/api/comments",
        query: {
          postId: postId,
        },
      });
      await axios.post(url, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([`comments, ${postId}`]);
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

  const disabled = isLoading || commentValue.trim() === "";
  return (
    <form onSubmit={onSubmit}>
      <div className="flex item w-full items-center gap-2">
        <Link href={`/profile/${currentUserId}`}>
          <UserAvatar src={currentUserImage} size="sm" />
        </Link>
        <CommentInput
          className="rounded-full text-foreground focus-visible:ring-0"
          ref={inputRef}
          type="text"
          placeholder="Write a comment..."
          value={commentValue}
          onChange={setCommentValue}
          onSubmit={onSubmit}
          disabled={disabled}
          isLoading={isLoading}
        />
      </div>
    </form>
  );
}
