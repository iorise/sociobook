"use client";

import { User } from "@prisma/client";
import React from "react";
import Link from "next/link";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface AsideProps {
  users: User[];
}

export function Aside({ users }: AsideProps) {
  return (
    <>
      <ScrollArea className="w-full h-full">
        {users.map((user) => (
          <Link key={user.externalId} href={`/profile/${user?.externalId}`}>
            <span
              className={cn(
                "group flex w-full items-center rounded-md border border-transparent px-2 py-2.5 hover:bg-accent hover:text-foreground"
              )}
            >
              <Avatar className="w-9 h-9">
                <AvatarImage
                  src={user?.externalImage ?? ""}
                  alt={user?.firstName ?? ""}
                />
                <AvatarFallback>
                  <img src="/images/placeholder.png" />
                </AvatarFallback>
              </Avatar>
              <span className="ml-3 text-white text-lg">
                {user.firstName} {user.lastName}
              </span>
            </span>
          </Link>
        ))}
      </ScrollArea>
    </>
  );
}
