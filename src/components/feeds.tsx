"use client";

import * as React from "react";
import { User } from "@clerk/nextjs/server";
import { User as userDb } from "@prisma/client";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Icons } from "@/components/icons";
import { PostForm } from "@/components/modal-forms/post-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePostModal } from "@/hooks/use-post-modal";

interface FeedsProps {
  user: User | null;
  initialData: userDb | null;
}

export function Feeds({ user, initialData }: FeedsProps) {
  const postModal = usePostModal();

  const initials = `${user?.firstName?.charAt(0) ?? ""} ${
    user?.lastName?.charAt(0) ?? ""
  }`;
  return (
    <div className="py-4 flex flex-col gap-5">
      <Card>
        <CardHeader className="flex flex-row items-center gap-2 py-2 px-3">
          <Link className="flex gap-2" href={`/profile/${user?.id}`}>
            <Button variant="ghost" className="rounded-full h-10 w-10">
              <Avatar className="active:scale-95 transition-all active:opacity-80 duration-0">
                <AvatarImage
                  src={
                    initialData?.externalImage ??
                    user?.profileImageUrl ??
                    user?.imageUrl
                  }
                  alt={user?.firstName ?? ""}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </Link>
          <Button
            className="w-full bg-accent rounded-full hover:brightness-110 text-left justify-start text-muted-foreground text-sm py-2"
            variant="ghost"
            onClick={() => postModal.onOpen()}
          >
            {`What's happening today, ${user?.firstName}`}
          </Button>
        </CardHeader>
        <Separator />
        <CardContent className="w-full flex p-2">
          <Button variant="ghost" className="flex-1">
            <Icons.video className="w-6 h-6 mr-2 text-[#f23e5c]" />
            <span>Live Video</span>
          </Button>
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => postModal.onOpen()}
          >
            <Icons.fileImage className="w-6 h-6 mr-2 text-[#58c472]" />
            <span>Photo/Video</span>
          </Button>
          <Button variant="ghost" className="flex-1 hidden sm:flex">
            <Icons.emoji className="w-6 h-6 mr-2 text-[#f8c03e]" />
            <span>Feels/activity</span>
          </Button>
        </CardContent>
      </Card>
      <PostForm user={user} />
      <Card>
        <CardHeader className="space-y-1 p-4">
          <div className="flex gap-2 items-center">
            <Avatar>
              <AvatarImage
                src={
                  initialData?.externalImage ??
                  user?.profileImageUrl ??
                  user?.imageUrl
                }
                alt={user?.firstName ?? ""}
              />
            </Avatar>
            <div className="flex flex-col">
              <span className="flex text-lg font-medium items-center gap-1">
                {user?.firstName} {user?.lastName}
                <span>
                  <Icons.check className="w-4 h-4 text-facebook-primary" />
                </span>
              </span>
              <span className="font-normal text-muted-foreground text-xs">
                7 hours
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
}
