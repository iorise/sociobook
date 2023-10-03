"use client";

import * as React from "react";
import type { z } from "zod";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { User as userDb } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateReactHelpers } from "@uploadthing/react/hooks";

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
import { PostInput } from "@/components/input/post-input";
import { usePostModal } from "@/hooks/use-post-modal";
import { FileDialog } from "@/components/image/file-dialog";
import { UserName } from "@/components/user/user-name";
import { FileWithPreview } from "@/types";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { cn, isArrayOfFile } from "@/lib/utils";
import { Scrollbox } from "@/components/ui/scrollbox";
import { UserAvatar } from "../user/user-avatar";

interface PostForm {
  currentUser: userDb | null | undefined;
  initialData?: userDb | null;
  isCurrentUser?: boolean;
  queryKey: string;
}

type Inputs = z.infer<typeof postSchema>;

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

export function PostForm({
  currentUser,
  initialData,
  isCurrentUser,
  queryKey,
}: PostForm) {
  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null);
  const { isUploading, startUpload } = useUploadThing("imageUploader");
  const postModal = usePostModal();

  const queryClient = useQueryClient();

  const { mutateAsync: addPostMutation, isLoading } = useMutation({
    mutationFn: async (data: Inputs) => {
      const images = isArrayOfFile(data.images)
        ? await startUpload(data.images).then((res) => {
            const formattedImages = res?.map((image) => ({
              imageId: image.fileKey,
              url: image.fileUrl,
            }));
            return formattedImages ?? null;
          })
        : null;

      const postData = {
        text: data.text,
        images:
          images?.map((image) => ({
            imageId: image.imageId,
            url: image.url,
          })) || [],
      };
      await axios.post("/api/posts", postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([queryKey]);
      toast.success("Your post has been published.", {
        position: "bottom-left",
      });
      postModal.onClose();
      form.reset();
      setFiles(null);
    },
    onError: (error: any) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  });

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      text: "",
      images: [],
    },
  });

  const onSubmit = React.useCallback(
    async (data: Inputs) => {
      await addPostMutation(data);
    },
    [form, addPostMutation]
  );

  const currentUserProfile =
    currentUser?.externalImage ?? currentUser?.profileImage ?? "";
  const firstName = currentUser?.firstName || "";
  const lastName = currentUser?.lastName || "";
  const textValue = form.getValues("text");
  const isImagesEmpty = !files || files.length === 0;
  const isFormEmpty = !textValue && isImagesEmpty;
  const isButtonDisabled = isLoading || isFormEmpty;
  return (
    <Modal
      title="Create Post"
      isOpen={postModal.isOpen}
      onClose={postModal.onClose}
    >
      <Scrollbox className="max-h-[25rem] md:max-h-[30rem]">
        <div className="px-3 flex items-center gap-2">
          <UserAvatar size="sm" src={currentUserProfile} alt={firstName} />
          <span className="flex flex-col -space-y-1">
            <UserName
              firstName={firstName}
              lastName={lastName}
              verified={currentUser?.verified}
            />
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
                      className={cn(
                        "resize-none border-0 focus-visible:ring-0",
                        files?.length ? "h-16" : "h-36"
                      )}
                      placeholder={
                        isCurrentUser
                          ? `What's happening today, ${firstName} ${lastName} ?`
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
            <FormItem>
              <FormControl>
                <FileDialog
                  name="images"
                  setValue={form.setValue}
                  files={files}
                  setFiles={setFiles}
                  isUploading={isUploading}
                  disabled={isLoading}
                  maxFiles={4}
                  maxSize={1024 * 1024 * 4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            <Button
              disabled={isButtonDisabled}
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
      </Scrollbox>
    </Modal>
  );
}
