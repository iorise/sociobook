"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MainNav } from "@/types";
import { Icons } from "@/components/icons";

interface MainNavProps {
  items: MainNav[];
}

export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!items?.length) return null;

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {items.map((item) => {
          const Icon = Icons[item.icon ?? "group"];
          const IconFill = Icons[item.iconFill ?? "group"];
          return item.href ? (
            <NavigationMenuItem
              className={cn(
                pathname === item.href
                  ? "border-b-4 border-facebook-primary hover:bg-secondaryBackground"
                  : "hover:bg-accent rounded-lg",
                item.hidden ? "hidden lg:flex" : "hidden md:flex",
                item.show ? "flex lg:hidden" : ""
              )}
              key={item.title}
            >
              {isMounted && (
                <TooltipProvider delayDuration={500}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Link href={item.href} passHref>
                        <NavigationMenuLink
                          className={cn(
                            navigationMenuTriggerStyle(),
                            "px-4 sm:px-6 lg:px-10",
                            item.allowed ? "" : "cursor-not-allowed"
                          )}
                        >
                          <span className="pointer-events-none">
                            {pathname === item.href ? (
                              <IconFill className="w-7 h-7 text-facebook-primary" />
                            ) : (
                              <Icon className="w-7 h-7 text-muted-foreground" />
                            )}
                          </span>
                        </NavigationMenuLink>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>{item.title}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </NavigationMenuItem>
          ) : (
            <span
              key={item.title}
              className="flex w-full cursor-not-allowed items-center rounded-md p-2 text-muted-foreground hover:underline"
            >
              <Icon className="w-6 h-6" />
            </span>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
