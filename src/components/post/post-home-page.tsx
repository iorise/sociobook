"use client";

import * as React from "react";
import { User } from "@clerk/nextjs/server";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/icons";
import { PostForm } from "@/components/modal-forms/post-form";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";

interface PostHomePageProps {
  user: User | null;
}

export function PostHomePage({ user }: PostHomePageProps) {
  const postModal = useModal();
  return (
    <div className="py-4 w-[35rem]">
      <Button
        className="w-full bg-accent rounded-full hover:brightness-110 text-left justify-start text-muted-foreground text-sm py-2"
        variant="ghost"
        onClick={() => postModal.onOpen()}
      >
        {`What's happening today, ${user?.firstName}`}
      </Button>
      <PostForm user={user} />
      <Card>
        <CardHeader className="space-y-1 p-4">
          <div className="flex gap-2 items-center">
            <Avatar>
              <AvatarImage
                src={user?.profileImageUrl ?? user?.imageUrl}
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
