"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarNav } from "@/types";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  items: SidebarNav[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <aside className="fixed top-14 z-30 -ml-6 hidden h-[calc(100vh-3.6rem)] w-full shrink-0 lg:sticky lg:block">
        <ScrollArea className="h-full pl-2 pr-6">
          <div className="py-4">
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
        </ScrollArea>
      </aside>
    </div>
  );
}
