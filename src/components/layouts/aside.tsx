"use client";

import { User } from "@prisma/client";
import Link from "next/link";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface AsideProps {
  users: User[];
}

export function Aside({ users }: AsideProps) {
  return (
      <ScrollArea className="w-full h-full">
        <ul className="w-full">
          {users.map((user) => (
            <li key={user.externalId}>
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
                  <span className="line-clamp-1">
                    {user.firstName} {user.lastName}
                  </span>
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </ScrollArea>
  );
}
