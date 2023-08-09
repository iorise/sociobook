"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { User } from "@clerk/nextjs/server";
import { User as userDb } from "@prisma/client";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

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
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/image-upload";
import useUser from "@/hooks/use-user";
import { Textarea } from "../ui/textarea";

type Inputs = z.infer<typeof profileSchema>;

interface EditPhotoProfileProps {
  user: User | null;
  initialData: userDb | null;
}

export function EditProfile({ user, initialData }: EditPhotoProfileProps) {
  const externalId = user?.id;
  const { mutate: MutateFetchedUser } = useUser(externalId);
  const [isLoading, setIsLoading] = React.useState(false);
  const editProfileModal = useModal();
  const router = useRouter();

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      externalImage: initialData?.externalImage || "",
      coverImage: initialData?.coverImage || "",
      bio: initialData?.bio || "",
    },
  });

  const onSubmit = React.useCallback(async (data: Inputs) => {
    try {
      setIsLoading(true);
      await axios.patch("/api/edit", data);
      MutateFetchedUser();
      toast.success("Profile Updated");
      editProfileModal.onClose();
      form.reset();
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [form, MutateFetchedUser, editProfileModal]);
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
            type="submit"
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
