"use client";

import * as React from "react";
import { User } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import axios from "axios";
import { toast } from "react-hot-toast";

import { commentSchema } from "@/lib/validations/comment";
import { CommentInput } from "@/components/inputs/comment-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import useComment from "@/hooks/use-comment";

interface CommentFormProps {
  currentUser: User | null;
  postId: string | null;
}

type Inputs = z.infer<typeof commentSchema>;

export function CommentForm({ currentUser, postId }: CommentFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const { mutate: mutateComment } = useComment(postId ?? "");

  // react hook form
  const form = useForm<Inputs>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      text: "",
    },
  });

  const onSubmit = React.useCallback(
    async (data: Inputs) => {
      try {
        setIsLoading(true);
        await axios.post(`/api/comment?postId=${postId}`, data);
        toast.success("Your Comment has been published.", {
          position: "bottom-left",
        });
        mutateComment();
        form.reset();
      } catch (error) {
        toast.error("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
    [form]
  );
  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}>
          <div className="flex item w-full items-center">
            <Avatar className="w-8 h-8 mr-2">
              <AvatarImage
                src={
                  currentUser?.externalImage ?? currentUser?.profileImage ?? ""
                }
              />
              <AvatarFallback>
                <img src="/images/placeholder.png" alt="placeholder" />
              </AvatarFallback>
            </Avatar>
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CommentInput placeholder="Write a comment..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isLoading || !form.formState.isValid}
              size="sm"
              variant="none"
              className=" text-white justify-end disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Icons.spinner
                  className="h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Icons.send className="h-4 w-4" aria-hidden="true" />
              )}
              <span className="sr-only">Send comment</span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
