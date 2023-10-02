"use client";

import * as React from "react";
import { User as userDb } from "@prisma/client";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePostModal } from "@/hooks/use-post-modal";
import { UserAvatar } from "@/components/user/user-avatar";

interface FeedsProps {
  currentUser: userDb | null;
  initialData?: userDb | null;
  isCurrentUser?: boolean;
  externalId?: string | null;
}

export function PostButton({
  currentUser,
  initialData,
  isCurrentUser,
}: FeedsProps) {
  const postModal = usePostModal();

  const { externalImage, profileImage, firstName, lastName } =
    currentUser || {};
  const src = externalImage ?? profileImage ?? "";
  const alt = `${firstName} ${lastName || ""}`;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 py-2 px-3">
        <Link
          className="flex gap-2"
          href={`/profile/${currentUser?.externalId}`}
        >
          <Button
            variant="ghost"
            className="rounded-full w-9 h-9 md:h-10 md:w-10 active:scale-95"
          >
            <UserAvatar size="md" src={src} alt={alt} className="w-9 h-9" />
          </Button>
        </Link>
        <Button
          className="w-full bg-accent rounded-full  dark:hover:brightness-110 justify-start text-muted-foreground text-sm py-2 line-clamp-2 h-9 md:h-10"
          variant="ghost"
          onClick={() => postModal.onOpen()}
          disabled={!isCurrentUser}
        >
          {isCurrentUser
            ? `What's happening today, ${firstName} ${lastName || ""} ?`
            : `Send message to ${initialData?.firstName} ${
                initialData?.lastName || ""
              }`}
        </Button>
      </CardHeader>
      <Separator />
      <CardContent className="w-full flex p-2">
        <Button
          variant="ghost"
          className="flex-1 cursor-not-allowed text-xs md:text-sm h-9 md:h-10"
        >
          <Icons.video className="h-5 w-5 md:w-6 md:h-6 mr-2 text-[#f23e5c]" />
          <span>Live Video</span>
        </Button>
        <Button
          variant="ghost"
          className="flex-1 text-xs md:text-sm h-9 md:h-10"
          onClick={() => postModal.onOpen()}
          disabled={!isCurrentUser}
        >
          <Icons.fileImage className="h-5 w-5 md:w-6 md:h-6 mr-2 text-[#58c472]" />
          <span>Photo/Video</span>
        </Button>
        <Button
          variant="ghost"
          className="flex-1 hidden xl:flex cursor-not-allowed text-xs md:text-sm h-9 md:h-10"
        >
          <Icons.emoji className="h-5 w-5 md:w-6 md:h-6 mr-2 text-[#f8c03e]" />
          <span>Feels/activity</span>
        </Button>
      </CardContent>
    </Card>
  );
}
