"use client";

import * as React from "react";
import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Icons } from "@/components/icons";
import { PostWithUser } from "@/components/post-feeds";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface FeedProps {
  data: PostWithUser;
}

export function Feed({ data }: FeedProps) {
  const createdAt = React.useMemo(() => {
    if (!data?.createdAt) {
      return null;
    }

    return formatDistanceToNowStrict(new Date(data.createdAt));
  }, [data.createdAt]);
  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader className="space-y-1 p-4">
          <div className="flex gap-2 items-center">
            <Avatar>
              <AvatarImage
                src={data.user?.externalImage ?? data.user.profileImage ?? ""}
                alt={""}
              />
              <AvatarFallback>
                <Icons.people />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col px-[-1rem]">
              <span className="flex text-lg font-medium items-center gap-1">
                {data.user?.firstName} {data.user?.lastName}
                <span>
                  {data.user.verified && (
                    <Icons.verified className="w-[0.87rem] h-[0.87rem] ml-1" />
                  )}
                </span>
              </span>
              <span className="font-normal text-muted-foreground text-xs">
                {createdAt}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            {data.text}
            {data.image ? (
              <Image
                src={data.image}
                alt="image"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                width={300}
                height={300}
                className="object-cover w-full aspect-square object-center"
                loading="lazy"
              />
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col text-muted-foreground">
          <Separator className="mb-2" />
          <div className="flex w-full">
            <Button variant="ghost" className="flex-1">
              <Icons.thumb className="w-6 h-6 mr-2" />
              <span>Like</span>
            </Button>
            <Button variant="ghost" className="flex-1">
              <Icons.comment className="w-6 h-6 mr-2" />
              <span>Comment</span>
            </Button>
            <Button variant="ghost" className="flex-1 sm:flex">
              <Icons.share className="w-6 h-6 mr-2" />
              <span>Share</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
