"use client";

import * as React from "react";
import { formatDistanceToNowStrict } from "date-fns";

import { NotificationWithUser } from "@/types";
import { Icons } from "@/components/icons";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/use-notifications";

interface NotificationItemsProps {
  notification: NotificationWithUser;
}

export function NotificationItems({ notification }: NotificationItemsProps) {
  const senderName = `${notification.senderFirstname || ""} ${
    notification.senderLastname || ""
  }`;

  const { deleteNotification, isDeleting } = useNotifications();

  const onDelete = React.useCallback(async () => {
    await deleteNotification(notification.id);
  }, [deleteNotification, notification.id]);

  const createdAt = React.useMemo(() => {
    const distance = formatDistanceToNowStrict(
      new Date(notification.createdAt)
    );
    return `${distance} ago`;
  }, [notification.createdAt]);

  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Avatar>
            <AvatarImage src={notification?.senderProfileImage || ""} />
          </Avatar>
          {notification.type === "LIKE" && (
            <Icons.thumbFill className="absolute w-4 h-4 bottom-0 right-0" />
          )}
          {notification.type === "FRIEND_REQUEST" && (
            <Icons.people className="absolute w-4 h-4 bottom-0 right-0" />
          )}
          {notification.type === "COMMENT" && (
            <Icons.messageFill className="absolute w-4 h-4 bottom-0 right-0" />
          )}
        </div>
        <div className="flex flex-col">
          <div>
            <p className="text-base line-clamp-3 break-words text-foreground/80 leading-tight">
              <span className="font-medium text-foreground">
                {notification.user?.firstName || ""}
              </span>
              ,{" "}
              {notification.type === "COMMENT" && (
                <span className="lowercase">
                  {senderName} commented on your post:{" "}
                  <span className="italic">&lsquo;</span>
                  <span className="italic">{notification.content}</span>
                  <span className="italic">&rsquo;</span>
                </span>
              )}
              {notification.type === "LIKE" && (
                <span className="lowercase">
                  {senderName} {notification.content}
                </span>
              )}
              {notification.type === "FRIEND_REQUEST" && (
                <span className="lowercase">
                  {notification.content} {senderName}
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">{createdAt}</p>
          </div>
        </div>
      </div>
      <Button variant="ghost" onClick={onDelete}>
        {isDeleting ? (
          <Icons.spinner className="w-4 h-4 animate-spin" />
        ) : (
          <Icons.trash className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
