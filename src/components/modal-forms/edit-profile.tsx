"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { User as userDb } from "@prisma/client";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Modal } from "@/components/ui/modal";
import { profileSchema } from "@/lib/validations/profile";
import { useModal } from "@/hooks/use-modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { ImageUpload } from "@/components/image/image-upload";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

type Inputs = z.infer<typeof profileSchema>;

interface EditPhotoProfileProps {
  currentUser: userDb | null ;
}

export function EditProfile({
  currentUser,
}: EditPhotoProfileProps) {
  const editProfileModal = useModal();
  const queryClient = useQueryClient();
  const router = useRouter()

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      externalImage:
        currentUser?.externalImage || currentUser?.profileImage || "",
      coverImage: currentUser?.coverImage || "",
      bio: currentUser?.bio || "",
    },
  });

  React.useEffect(() => {
    form.reset({
      externalImage:
        currentUser?.externalImage || currentUser?.profileImage || "",
      coverImage: currentUser?.coverImage || "",
      bio: currentUser?.bio || "",
    });
  }, [currentUser, form]);

  const { isLoading, mutateAsync: editProfileMutate } = useMutation({
    mutationFn: async (data: Inputs) => await axios.patch(`/api/edit`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      router.refresh()
      toast.success("Profile updated !");
      editProfileModal.onClose();
    },
    onError: () => {
      toast.error("Can't update profile, Something went wrong !");
    },
  });

  const onSubmit = async (data: Inputs) => {
    await editProfileMutate(data);
  };
  return (
    <Modal
      title="Edit profile"
      isOpen={editProfileModal.isOpen}
      onClose={editProfileModal.onClose}
    >
      <Form {...form}>
        <form
          className="grid gap-4"
          onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        >
          <FormField
            control={form.control}
            name="externalImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile photo</FormLabel>
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
          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover image</FormLabel>
                <FormControl>
                  <ImageUpload
                    disabled={isLoading}
                    value={field.value}
                    onChange={field.onChange}
                    isCover
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl className="w-full mx-auto">
                  <Textarea
                    {...field}
                    placeholder="Tell everyone about yourself..."
                    className=" w-1/2 text-sm text-center resize-none border-2 h-32 bg-secondaryBackground focus-visible:ring-bg-accent focus-visible:ring-facebook-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isLoading}
            size="sm"
            className="bg-facebook-primary text-white"
          >
            {isLoading && (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Save
            <span className="sr-only">Save</span>
          </Button>
        </form>
      </Form>
    </Modal>
  );
}
