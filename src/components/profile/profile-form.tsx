"use client";

import React from "react";
import Image from "next/image";
import { User } from "@prisma/client";

import { Shell } from "@/components/shell";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "../icons";
import { User as authUser } from "@clerk/nextjs/server";
import { useModal } from "@/hooks/use-modal";
import EditPhotoProfile from "../modal-forms/edit-photo-profile";

interface ProfileFormProps {
  initialData: User | null;
  user: authUser | null;
}

export function ProfileForm({ initialData, user }: ProfileFormProps) {
  const editPhotoModal = useModal();

  const initials = `${initialData?.firstName?.charAt(0) ?? ""} ${
    initialData?.lastName?.charAt(0) ?? ""
  }`;
  return (
    <Shell>
      <div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer active:scale-95 transition-all active:opacity-80 duration-0 w-40 h-40 border-4 border-secondaryBackground">
                <AvatarImage
                  src={initialData?.profileImage ?? user?.profileImageUrl ?? ""}
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
          <EditPhotoProfile user={user} />
          <div>
            <h1 className="text-xl font-bold text-white">
              {user?.firstName} {user?.lastName}
            </h1>
          </div>
        </div>
      </div>
    </Shell>
  );
}
