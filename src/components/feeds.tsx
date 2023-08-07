"use client";

import * as React from "react";
import { User } from "@clerk/nextjs/server";
import { Post, Prisma, User as userDb } from "@prisma/client";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Icons } from "@/components/icons";
import { PostForm } from "@/components/modal-forms/post-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePostModal } from "@/hooks/use-post-modal";
import { Feed } from "@/components/feed";
import usePosts from "@/hooks/use-posts";

interface FeedsProps {
  user: User | null;
  initialData: userDb | null;
}

export type PostWithUser = Prisma.PostGetPayload<{ include: {user: true} }>;

export function Feeds({ user, initialData }: FeedsProps) {
  const postModal = usePostModal();

  const { data: posts = [] } = usePosts();

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
      <PostForm user={user} initialData={initialData} />
      {posts.map((post: PostWithUser) => (
        <Feed data={post} user={user} key={post.id} />
      ))}
    </div>
  );
}
