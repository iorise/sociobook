"use client";

import React from "react";
import Link from "next/link";
import { User } from "@prisma/client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarNav } from "@/types";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { UserName } from "@/components/ui/user-name";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarNavProps {
  items: SidebarNav[];
  currentUser: User | null;
}

export function SidebarNav({ items, currentUser }: SidebarNavProps) {
  return (
    <ScrollArea className="w-full h-full">
      <ul className="w-full">
        <li>
          <Button
            variant="ghost"
            className="justify-start flex gap-3 py-6 w-full"
            asChild
          >
            <Link href={`/profile/${currentUser?.externalId}`}>
              <Avatar className="w-9 h-9">
                <AvatarImage
                  src={
                    currentUser?.externalImage ??
                    currentUser?.profileImage ??
                    ""
                  }
                  alt={currentUser?.firstName ?? ""}
                />
                <AvatarFallback>
                  <img src="/images/placeholder.png" alt="" />
                </AvatarFallback>
              </Avatar>
              <UserName
                firstName={currentUser?.firstName || ""}
                lastName={currentUser?.lastName || ""}
                verified={currentUser?.verified}
                iconClassName="h-4 w-4"
              />
            </Link>
          </Button>
        </li>
        {items.map((item, index) => {
          const Icon = Icons[item.icon ?? "logo"];
          return (
            <li key={index}>
              <Button
                variant="ghost"
                className={cn("justify-start flex gap-3 py-6 w-full")}
                asChild
              >
                <Link
                  href={item.href}
                  className={cn(
                    item.disabled ? "pointer-events-none opacity-60" : ""
                  )}
                >
                  <Icon className="w-9 h-9 text-facebook-primary" />
                  <span>{item.title}</span>
                </Link>
              </Button>
            </li>
          );
        })}
      </ul>
      <Separator />
    </ScrollArea>
  );
}
