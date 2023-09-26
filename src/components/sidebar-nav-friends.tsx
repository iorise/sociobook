"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { ScrollArea } from "@/components/ui/scroll-area";
import { siteFriends } from "@/config/friends";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

export function SidebarNavFriends() {
  const pathname = usePathname();
  return (
    <div className="flex flex-col gap-1.5 w-full h-full bg-card font-semibold px-1 py-2.5 ">
      <h1 className="mb-2.5">Friends</h1>
      <ScrollArea className="w-full h-full">
        <ul className="flex flex-col gap-1.5 w-full">
          {siteFriends.map((item) => {
            const Icon = Icons[item.icon ?? "logo"];
            return (
              <li key={item.title}>
                <Button
                  variant="ghost"
                  className={cn(
                    pathname === item.href && "bg-accent",
                    "justify-start flex gap-3 py-6 w-full"
                  )}
                  asChild
                >
                  <Link
                    href={item.href}
                    className={cn(
                      pathname === item.href ? "font-semibold" : ""
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </Link>
                </Button>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </div>
  );
}
