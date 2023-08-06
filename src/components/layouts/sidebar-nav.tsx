"use client";

import React from "react";
import Link from "next/link";

import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarNav } from "@/types";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface SidebarNavProps {
  items: SidebarNav[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  return (
    <ScrollArea className="h-full">
      <div>
        {items.map((item, index) => {
          const Icon = Icons[item.icon ?? "logo"];
          return (
            <Link key={index} href={item.href}>
              <span
                className={cn(
                  "group flex w-full items-center rounded-md border border-transparent px-2 py-3 hover:bg-accent hover:text-foreground",
                  item.disabled && "cursor-not-allowed"
                )}
              >
                <Icon className="w-7 h-7 text-blue-300" />
                <span className="ml-4">{item.title}</span>
              </span>
            </Link>
          );
        })}
      </div>
      <Separator />
    </ScrollArea>
  );
}
