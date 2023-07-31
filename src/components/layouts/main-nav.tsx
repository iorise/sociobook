"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

interface MainNavProps {
  items: MainNav[];
}

export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname();
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {items.map((e) => (
          <NavigationMenuItem
            className={cn(
              pathname === e.href
                ? "border-b-4 border-facebook-primary hover:bg-secondaryBackground"
                : "hover:bg-accent rounded-lg"
            )}
            key={e.title}
          >
            <TooltipProvider delayDuration={500}>
              <Tooltip>
                <TooltipTrigger>
                  <Link href={e.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        e.allowed ? "" : "cursor-not-allowed"
                      )}
                    >
                      {pathname === e.href ? e.iconFill : e.icon}
                      <TooltipContent>{e.title}</TooltipContent>
                    </NavigationMenuLink>
                  </Link>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
