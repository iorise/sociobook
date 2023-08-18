"use client";

import * as React from "react";
import type { z } from "zod";
import { User } from "@clerk/nextjs/server";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { User as userDb } from "@prisma/client";

import { postSchema } from "@/lib/validations/post";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { PostInput } from "@/components/inputs/post-input";
import { usePostModal } from "@/hooks/use-post-modal";
import { ImageUpload } from "@/components/image-upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface PostForm {
  user: User | null;
  currentUser: userDb | null;
  initialData?: userDb | null;
  currentUsers?: boolean;
}

type Inputs = z.infer<typeof postSchema>;

export function PostForm({
  user,
  currentUser,
  initialData,
  currentUsers,
}: PostForm) {
  const postModal = usePostModal();

  const queryClient = useQueryClient();

  const { mutateAsync: addPostMutation, isLoading } = useMutation({
    mutationFn: async (data: Inputs) => await axios.post("/api/posts", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      toast.success("Your post has been published.", {
        position: "bottom-left",
      });
      postModal.onClose();
      form.reset();
    },
  });

  const initials = `${user?.firstName?.charAt(0) ?? ""} ${
    user?.lastName?.charAt(0) ?? ""
  }`;

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      text: "",
      image: "",
    },
  });

  const onSubmit = React.useCallback(
    async (data: Inputs) => {
      await addPostMutation(data)
    },
    [form, addPostMutation]
  );
  return (
    <Modal
      title="Create Post"
      isOpen={postModal.isOpen}
      onClose={postModal.onClose}
    >
      <div className="px-3 flex items-center gap-2">
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={currentUser?.externalImage ?? user?.profileImageUrl}
            alt={user?.firstName ?? ""}
          />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="flex flex-col -space-y-1">
          <span className="line">
            {user?.firstName} {user?.lastName}
          </span>
          <span>
            <Button
              disabled
              variant="ghost"
              className="w-[3.5rem] h-[1.2rem] rounded-sm text-[0.6rem] bg-accent gap-[0.1rem] disabled:cursor-not-allowed disabled:pointer-events-auto"
            >
              <span>
                <Icons.world className="w-2.5 h-2.5" />
              </span>
              Public
              <span>
                <Icons.arrowDown className="w-2.5 h-2.5" />
              </span>
            </Button>
          </span>
        </span>
      </div>
      <Form {...form}>
        <form
          className="grid gap-4"
          onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        >
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PostInput
                    className="h-40 resize-none border-0 focus-visible:ring-0"
                    placeholder={
                      currentUsers
                        ? `What's happening today, ${currentUser?.firstName} ${
                            currentUser?.lastName || ""
                          } ?`
                        : `Send message to ${initialData?.firstName} ${
                            initialData?.lastName || ""
                          }`
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUpload
                    disabled={isLoading}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isLoading || !form.formState.isValid}
            size="sm"
            className="bg-facebook-primary text-white"
          >
            {isLoading && (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Send
            <span className="sr-only">Send post</span>
          </Button>
        </form>
      </Form>
    </Modal>
  );
}
