"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
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
import { Button } from "@/components/ui/button";

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
          return (
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
                      {item.disabled ? (
                         <Button
                          variant="ghost"
                          size="lg"
                          className="cursor-not-allowed"
                        >
                          {pathname === item.href ? (
                            <IconFill className="w-7 h-7 text-facebook-primary" />
                          ) : (
                            <Icon className="w-7 h-7 text-muted-foreground" />
                          )}
                        </Button>
                      ) : (
                        <Button variant="ghost" size="lg" asChild>
                          <Link href={item.href}>
                            {pathname === item.href ? (
                              <IconFill className="w-7 h-7 text-facebook-primary" />
                            ) : (
                              <Icon className="w-7 h-7 text-muted-foreground" />
                            )}
                          </Link>
                        </Button>
                      )}
                    </TooltipTrigger>
                    <TooltipContent>{item.title}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
