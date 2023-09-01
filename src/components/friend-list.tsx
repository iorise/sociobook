"use client";

import { User } from "@prisma/client";
import React from "react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserName } from "@/components/ui/user-name";

interface FriendListProps {
  user: User;
}

export default function FriendList({ user }: FriendListProps) {
  return (
    <Button
      variant="ghost"
      className="justify-start flex gap-3 py-6 w-full"
      asChild
    >
      <Link href={`/profile/${user?.externalId}`}>
        <Avatar className="w-9 h-9">
          <AvatarImage
            src={user?.externalImage ?? ""}
            alt={user?.firstName ?? ""}
          />
          <AvatarFallback>
            <img src="/images/placeholder.png" />
          </AvatarFallback>
        </Avatar>
        <UserName
          firstName={user?.firstName || ""}
          lastName={user.lastName || ""}
          verified={user.verified}
          iconClassName="h-4 w-4"
        />
      </Link>
    </Button>
  );
}
