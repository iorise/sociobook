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
import { NotificationItems } from "@/components/notifications-item";

interface NotificationsDropdownProps {
  externalId: string | null | undefined;
  hasNotifications: boolean | null | undefined;
}

export function NotificationsDropdown({
  externalId,
  hasNotifications,
}: NotificationsDropdownProps) {
  const queryKey = ["notifications", externalId];

  const {
    data: notifications,
    refetch,
    isLoading,
    error,
  } = useQuery<NotificationWithUser[]>({
    queryKey,
    queryFn: async () => {
      const { data } = await axios.get(`/api/notifications/${externalId}`);
      return data;
    },
    enabled: false,
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full active:scale-95 transition-all active:opacity-80 duration-0 relative"
          onClick={() => refetch()}
        >
          <Icons.notification className="w-5 h-5" />
          {hasNotifications && (
            <div className="w-3 h-3 rounded-full border border-border absolute bg-red-600 -top-1 -right-1" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end" forceMount>
        <ScrollArea className="h-[40rem] w-full rounded-md">
          <div className="text-xl font-bold">Notifications</div>
          {isLoading ? (
            <NotificationLoader />
          ) : error ? (
            <div className="w-full text-center pt-5">Something went wrong</div>
          ) : (
            notifications?.map((notification) => (
              <div key={notification.id} className="py-3 mx-1">
                <NotificationItems notification={notification} />
              </div>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
