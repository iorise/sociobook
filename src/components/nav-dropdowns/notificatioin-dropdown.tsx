"use client";

import * as React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationLoader } from "@/components/ui/notification-loader";
import { NotificationItems } from "@/components/notifications-item";
import { useCurrentUser } from "@/hooks/use-currentUser";
import { AlertModal } from "@/components/ui/alert-modal";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/use-notifications";

interface NotificationsDropdownProps {
  externalId: string | null | undefined;
  hasNotifications: boolean | null | undefined;
}

export function NotificationsDropdown({
  externalId,
  hasNotifications,
}: NotificationsDropdownProps) {
  const [onOpen, setOnOpen] = React.useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const { data: currentUser } = useCurrentUser();

  React.useEffect(() => {
    if (onOpen) {
      refetch();
    }
  }, [onOpen]);

  const { notifications, isLoading, refetch, fetchError } =
    useNotifications();

  return (
    <Popover open={onOpen} onOpenChange={setOnOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full active:scale-95 transition-all active:opacity-80 duration-0 relative"
        >
          <Icons.notification
            className={cn("w-5 h-5", onOpen ? "text-facebook-primary" : "")}
          />
          {currentUser?.hasNotifications && (
            <div className="w-3 h-3 rounded-full border border-border absolute bg-red-600 -top-0 -right-0" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end" forceMount>
        <ScrollArea className="h-[40rem] w-full rounded-md">
          {isLoading ? (
            <NotificationLoader />
          ) : fetchError ? (
            <div className="w-full text-center pt-5">Something went wrong</div>
          ) : (
            <div className="grid gap-5">
              <div className="text-xl font-bold">Notifications</div>
              {notifications?.length === 0 ? (
                <div className="w-full flex flex-col gap-3 items-center justify-center">
                  <Icons.notification className="w-16 h-16" />
                  <p className="text-muted-foreground">
                    Quiet on the Notification Front
                  </p>
                </div>
              ) : (
                <ul className="w-full">
                  {notifications?.map((notification) => (
                    <li key={notification.id} className="py-3 mx-1">
                      <NotificationItems
                        notification={notification}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
