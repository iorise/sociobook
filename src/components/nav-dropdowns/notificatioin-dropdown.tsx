"use client";

import * as React from "react";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";

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
import { useCurrentUser } from "@/hooks/use-currentUser";
import { AlertModal } from "@/components/ui/alert-modal";
import { toast } from "react-hot-toast";

interface NotificationsDropdownProps {
  externalId: string | null | undefined;
  hasNotifications: boolean | null | undefined;
}

export function NotificationsDropdown({
  externalId,
  hasNotifications,
}: NotificationsDropdownProps) {
  const queryKey = ["notifications", externalId];
  const [onOpen, setOnOpen] = React.useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const { data: currentUser } = useCurrentUser();

  React.useEffect(() => {
    if (onOpen) {
      refetch();
    }
  }, []);

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

  const { mutateAsync: deleteNotification, isLoading: isLoadingDelete } =
    useMutation({
      mutationFn: async () => {
        await axios.delete(`/api/notifications/${externalId}`);
      },
      mutationKey: queryKey,
      onSuccess: () => {
        refetch();
        toast.success("Notification deleted", {
          position: "bottom-left",
        });
      },
    });

  const onDelete = React.useCallback(async () => {
    await deleteNotification();
  }, [deleteNotification]);

  return (
    <Popover open={onOpen} onOpenChange={setOnOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full active:scale-95 transition-all active:opacity-80 duration-0 relative"
        >
          <Icons.notification className="w-5 h-5" />
          {currentUser?.hasNotifications && (
            <div className="w-3 h-3 rounded-full border border-border absolute bg-red-600 -top-0 -right-0" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end" forceMount>
        <ScrollArea className="h-[40rem] w-full rounded-md">
          {isLoading ? (
            <NotificationLoader />
          ) : error ? (
            <div className="w-full text-center pt-5">Something went wrong</div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold">Notifications</div>
                <Button variant="ghost" onClick={() => setAlertOpen(true)}>
                  <Icons.trash className="w-4 h-4 mr-2" />
                  <span>Delete all</span>
                </Button>
                <AlertModal
                  isOpen={alertOpen}
                  onClose={() => setAlertOpen(false)}
                  onConfirm={onDelete}
                  loading={isLoadingDelete}
                />
              </div>
              {notifications?.map((notification) => (
                <div key={notification.id} className="py-3 mx-1">
                  <NotificationItems
                    notification={notification}
                    onDelete={onDelete}
                  />
                </div>
              ))}
            </>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
