"use client";

import React from "react";
import Image from "next/image";
import { User as userDb } from "@prisma/client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/icons";
import { useModal } from "@/hooks/use-modal";
import { EditProfile } from "@/components/modal-forms/edit-profile";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserName } from "@/components/ui/user-name";

interface ProfileFormProps {
  currentUser: userDb | null;
  initialData: userDb | null;
  userId: string;
  isCurrentUser: boolean;
}

export function ProfileView({
  userId,
  currentUser,
  initialData,
  isCurrentUser,
}: ProfileFormProps) {
  const editPhotoModal = useModal();

  return (
    <div className="relative w-full container px-10 xl:px-36 grid grid-cols-1 ">
      <div className="flex flex-col relative justify-center">
        <div className="w-full flex ">
          {initialData?.coverImage ? (
            <Image
              src={initialData.coverImage}
              alt="Cover image"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              width={1200}
              height={300}
              className="px-0 relative aspect-[3/1.3] md:aspect-[4/1.3] overflow-hidden bg-center rounded-md object-cover"
            />
          ) : (
            <div className="w-full relative aspect-[3/1.3] md:aspect-[4/1.3] overflow-hidden bg-center rounded-md bg-accent brightness-150" />
          )}
        </div>
        <div className="flex-col md:flex">
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
        -top-16
        relative"
          >
            <div className="pl-0 md:pl-10">
              {!isCurrentUser ? (
                <Button
                  variant="none"
                  className="active:scale-95 active:brightness-90 hover:brightness-110 w-44 h-44 rounded-full"
                >
                  <Avatar className="w-44 h-44 border-4 border-secondaryBackground">
                    <AvatarImage
                      src={
                        initialData?.externalImage ??
                        initialData?.profileImage ??
                        ""
                      }
                      alt="Profile image"
                      className="object-cover"
                    />
                    <AvatarFallback>
                      <img src="/images/placeholder.png" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="none"
                      className="active:scale-95 active:brightness-90 hover:brightness-110 w-44 h-44 rounded-full"
                    >
                      <Avatar className="w-44 h-44 border-4 border-secondaryBackground">
                        <AvatarImage
                          src={
                            initialData?.externalImage ??
                            initialData?.profileImage ??
                            ""
                          }
                          alt={initialData?.firstName ?? ""}
                        />
                        <AvatarFallback>
                          <img src="/images/placeholder.png" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-60">
                    <div className="grid gap-5">
                      <div className="flex">
                        <Icons.user className="mr-2 w-5 h-5" />
                        <span>See profile photo</span>
                      </div>
                      <div
                        className="flex"
                        onClick={() => editPhotoModal.onOpen()}
                      >
                        <Icons.fileImage className="mr-2 w-5 h-5" />
                        <span>Update photo</span>
                      </div>
                      <div className="flex">
                        <Icons.avatar className="mr-2 w-5 h-5" />
                        <span>Create avatar profile</span>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            <div className="flex flex-col pt-0 md:pt-10">
              <UserName
                firstName={initialData?.firstName}
                lastName={initialData?.lastName}
                verified={initialData?.verified}
                className="text-3xl font-bold text-white line-clamp-1"
                iconClassName="w-16"
              />
              <p className="text-muted-foreground">
                {initialData?.friendIds.length} Friends
              </p>
            </div>
          </div>
          <div className="w-full flex gap-2 justify-end">
            {isCurrentUser ? (
              <>
                <Button
                  disabled
                  className="bg-facebook-primary text-white flex-1 md:flex-none"
                >
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
      </div>
      <EditProfile currentUser={currentUser} externalId={userId} />
    </div>
  );
}
