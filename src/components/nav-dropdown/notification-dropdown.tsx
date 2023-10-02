"use client";

import * as React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { NotificationList } from "@/components/notifications/notifications-list";

export function NotificationsDropdown() {
  const [onOpen, setOnOpen] = React.useState(false);
  const { data: currentUser } = useCurrentUser();

  return (
    <Popover open={onOpen} onOpenChange={setOnOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full active:scale-95 transition-all active:opacity-80 duration-0 relative"
        >
          <Icons.notification
            className={cn(
              "w-4 h-4 md:w-5 md:h-5",
              onOpen ? "text-facebook-primary" : ""
            )}
          />
          {currentUser?.hasNotifications && (
            <div className="w-3 h-3 rounded-full border border-border absolute bg-red-600 -top-0 -right-0" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end" forceMount>
        <NotificationList />
      </PopoverContent>
    </Popover>
  );
}
