"use client";

import React from "react";
import Link from "next/link";

import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarNav } from "@/types";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface SidebarNavProps {
  items: SidebarNav[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  return (
    <ScrollArea className="w-full h-full">
      <ul className="w-full">
        {items.map((item, index) => {
          const Icon = Icons[item.icon ?? "logo"];
          return (
            <li key={index}>
              <Button
                variant="ghost"
                className={cn(
                  item.disabled && "cursor-not-allowed",
                  "justify-start flex gap-3 py-6 w-full"
                )}
                disabled={item.disabled}
                asChild
              >
                <Link href={item.href}>
                  <Icon className="w-7 h-7 text-facebook-primary" />
                  <span className="ml-4">{item.title}</span>
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
