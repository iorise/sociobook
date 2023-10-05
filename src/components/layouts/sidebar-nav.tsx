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
import { UserName } from "@/components/user/user-name";

import { UserAvatar } from "@/components/user/user-avatar";

interface SidebarNavProps {
  items: SidebarNav[];
  currentUser: User | null;
  owner: User | null;
}

export function SidebarNav({ items, currentUser, owner }: SidebarNavProps) {
  const src = currentUser?.externalImage ?? currentUser?.profileImage ?? "";
  const alt = currentUser?.firstName ?? "";
  return (
    <ScrollArea className="w-full h-full">
      <ul className="w-full">
        <li>
          <Button
            className="flex justify-start py-6"
            size="md"
            variant="ghost"
            asChild
          >
            <Link
              href={`/profile/${currentUser?.externalId}`}
              className="flex gap-3 items-center"
            >
              <UserAvatar src={src} size="md" className="w-9 h-9" alt={alt} />
              <UserName
                firstName={currentUser?.firstName}
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
                className={cn("justify-start gap-3 py-6 w-full")}
                asChild
              >
                <Link
                  href={item.href}
                  className={cn(item.disabled && "cursor-not-allowed")}
                >
                  <Icon className="w-9 h-9 text-facebook-primary" />
                  <span>{item.title}</span>
                </Link>
              </Button>
            </li>
          );
        })}
        <Separator className="my-5" />
        <li className="flex flex-col">
          <h1 className="text-lg font-semibold text-muted-foreground pb-3 ml-3">
            Owner
          </h1>
          <Button
            className="flex justify-start py-6"
            size="md"
            variant="ghost"
            asChild
          >
            <Link
              href={`/profile/${owner?.externalId}`}
              className="flex gap-3 items-center"
            >
              <UserAvatar
                src={owner?.externalImage ?? owner?.profileImage ?? ""}
                size="md"
                className="w-9 h-9"
                alt="owner"
              />
              <UserName
                firstName={owner?.firstName}
                lastName={owner?.lastName}
                verified={owner?.verified}
                iconClassName="h-4 w-4"
              />
            </Link>
          </Button>
        </li>
      </ul>
    </ScrollArea>
  );
}
