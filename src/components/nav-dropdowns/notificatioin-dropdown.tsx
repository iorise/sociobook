"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationWithUser } from "@/types";
import { NotificationLoader } from "@/components/ui/notification-loader";
import { useCurrentUser } from "@/hooks/use-currentUser";

interface NotificationsDropdownProps {
  externalId: string | null | undefined;
}

export function NotificationsDropdown({
  externalId,
}: NotificationsDropdownProps) {
  const { data: currentUser } = useCurrentUser();
  const {
    data: notifications,
    isLoading,
    error,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(`/api/notifications/${externalId}`);
      return data;
    },
    queryKey: ["notifications", externalId],
  });
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full active:scale-95 transition-all active:opacity-80 duration-0 relative"
        >
          <Icons.notification className="w-5 h-5" />
          {currentUser?.hasNotifications && (
            <div className="w-3 h-3 rounded-full border border-border absolute bg-red-600 -top-1 -right-1" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end" forceMount>
        <ScrollArea className="h-[40rem] w-full rounded-md">
          <div className="text-xl font-bold">Notifications</div>
          {isLoading && <NotificationLoader />}
          {error && <div>Something went wrong</div>}
          {notifications?.map((notification: NotificationWithUser) => (
            <div key={notification.id} className="py-3 mx-1">
              <div className="flex items-center gap-2">
                <Icons.thumbFill className="w-6 h-6" />
                <p className="text-lg line-clamp-3 break-words text-foreground/80">
                  {notification.text.toLowerCase()}
                </p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
