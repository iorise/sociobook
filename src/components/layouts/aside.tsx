"use client";

import { User } from "@prisma/client";
import React from "react";
import Link from "next/link";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AsideProps {
  users: User[];
}

export function Aside({ users }: AsideProps) {
  return (
    <div className="hidden md:flex py-4">
      <ScrollArea>
        {users.map((user) => (
          <Link href={`/profile/${user?.externalId}`}>
            <div className="flex gap-2 items-center" key={user.id}>
              <Avatar>
                <AvatarImage
                  src={user?.externalImage ?? ""}
                  alt={user?.firstName ?? ""}
                />
                <AvatarFallback>
                  <img src="/images/placeholder.png" />
                </AvatarFallback>
              </Avatar>
              <p>
                {user.firstName} {user.lastName}
              </p>
            </div>
          </Link>
        ))}
      </ScrollArea>
    </div>
  );
}
