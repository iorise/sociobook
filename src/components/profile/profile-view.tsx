"use client";

import React from "react";
import Image from "next/image";
import { User as userDb } from "@prisma/client";
import { User } from "@clerk/nextjs/server";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import { useModal } from "@/hooks/use-modal";
import { EditProfile } from "@/components/modal-forms/edit-photo-profile";
import { Button } from "@/components/ui/button";

interface ProfileFormProps {
  initialData: userDb | null;
  user: User | null;
}

export function ProfileView({ initialData, user }: ProfileFormProps) {
  const editPhotoModal = useModal();

  const currentUser = user?.id === initialData?.externalId;

  const initials = `${initialData?.firstName?.charAt(0) ?? ""} ${
    initialData?.lastName?.charAt(0) ?? ""
  }`;
  return (
    <div className=" relative w-full flex flex-col">
      <div className="w-full flex justify-center">
        {initialData?.coverImage ? (
          <Image
            src={initialData?.coverImage}
            alt="Cover image"
            width={1200}
            height={200}
            className="relative aspect-[3/1.3] md:aspect-[4/1.3] overflow-hidden bg-center rounded-md"
          />
        ) : (
          <div className="w-[100%] relative aspect-[3/1.3] md:aspect-[4/1.3] overflow-hidden bg-center rounded-md bg-accent mx-0 xl:mx-20 brightness-150" />
        )}
      </div>
      <div className="flex-col md:flex justify-center px-0 xl:px-28">
        <div
          className="
        w-full
        gap-4
        flex
        flex-col
        md:flex
        md:flex-row
        justify-center
        items-center
        md:justify-start
        -top-10
        relative"
        >
          <div className="pl-10">
            {!currentUser ? (
              <Avatar className="cursor-pointer active:scale-95 transition-all active:opacity-80 duration-0 w-44 h-44 border-4 border-secondaryBackground">
                <AvatarImage
                  src={initialData?.externalImage || "/images/placeholder.png"}
                  alt={initialData?.firstName ?? ""}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer active:scale-95 transition-all active:opacity-80 duration-0 w-40 h-40 border-4 border-secondaryBackground">
                    <AvatarImage
                      src={
                        initialData?.externalImage ??
                        user?.profileImageUrl ??
                        ""
                      }
                      alt={initialData?.firstName ?? ""}
                    />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60">
                  <DropdownMenuItem>
                    <Icons.user className="mr-2 w-5 h-5" />
                    <span>See profile photo</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => editPhotoModal.onOpen()}>
                    <Icons.fileImage className="mr-2 w-5 h-5" />
                    <span>Update photo</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icons.avatar className="mr-2 w-5 h-5" />
                    <span>Create avatar profile</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold text-white">
              {initialData?.firstName} {initialData?.lastName}
            </h1>
            <p className="text-muted-foreground">0 friends</p>
          </div>
        </div>
        <div className="w-full flex justify-center md:justify-end items-center gap-2 px-10">
          {currentUser ? (
            <>
              <Button className="bg-facebook-primary text-white flex-1 md:flex-none">
                <Icons.plus className="w-4 h-4 mr-2" />
                <span>Add to story</span>
              </Button>
              <Button
                className="flex-1 md:flex-none"
                onClick={() => editPhotoModal.onOpen()}
              >
                <Icons.pencil className="w-4 h-4 mr-2" />
                <span>Edit profile</span>
              </Button>
            </>
          ) : (
            <>
              <Button className="bg-facebook-primary text-white flex-1 md:flex-none">
                <Icons.people className="w-4 h-4 mr-2" />
                <span>Add friend</span>
              </Button>
              <Button className="flex-1 md:flex-none">
                <Icons.message className="w-4 h-4 mr-2" />
                <span>Send message</span>
              </Button>
            </>
          )}
        </div>
      </div>
      <EditProfile user={user} initialData={initialData} />
    </div>
  );
}
