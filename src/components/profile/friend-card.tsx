"use client";

import { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { checkFriendship } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { FriendshipStatus } from "@/types";
import { useFriendship } from "@/hooks/use-friendship";

interface FriendCardProps {
  friend: User;
  currentUser?: User | null;
}

export function FriendCard({ friend, currentUser }: FriendCardProps) {
  const {
    requestFriend,
    isLoadingRequest,
    acceptFriend,
    isLoadingAccept,
    rejectFriend,
    isLoadingReject,
    removeFriend,
    isLoadingRemove,
  } = useFriendship({
    otherUserId: friend.externalId,
    currentUserId: currentUser?.externalId,
  });
  return (
    <Card
      key={friend.id}
      className="group rounded-sm active:scale-95 transition-all duration-150 active:opacity-80"
    >
      <Link href={`/profile/${friend.externalId}`} tabIndex={-1}>
        <CardHeader className="border-b p-0">
          <AspectRatio ratio={10 / 10}>
            <Image
              src={
                friend.externalImage ??
                friend.profileImage ??
                "/images/placeholder.png"
              }
              alt={friend.firstName ?? ""}
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              fill
              className="object-cover rounded-t-sm group-hover:opacity-90 transition-all duration-150"
            />
          </AspectRatio>
        </CardHeader>
        <CardContent className="p-2">
          <p className="text-sm font-semibold line-clamp-1">
            {friend.firstName} {friend.lastName ?? ""}
          </p>
        </CardContent>
      </Link>
      {currentUser ? (
        <CardFooter className="p-2">
          {checkFriendship(currentUser as User, friend) ===
          FriendshipStatus.NOT_FRIENDS ? (
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-full rounded-sm text-xs"
              onClick={() => requestFriend()}
              disabled={isLoadingRequest}
            >
              Add Friend
            </Button>
          ) : checkFriendship(currentUser as User, friend) ===
            FriendshipStatus.FRIENDS ? (
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-full rounded-sm line-clamp-1 text-xs"
              onClick={() => removeFriend()}
              disabled={isLoadingRemove}
            >
              Delete Friend
            </Button>
          ) : checkFriendship(currentUser as User, friend) ===
            FriendshipStatus.REQUEST_RECEIVED ? (
            <div className="grid gap-1 w-full">
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-full rounded-sm text-xs bg-facebook-primary"
                onClick={() => acceptFriend()}
                disabled={isLoadingAccept}
              >
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-full rounded-sm text-xs"
                onClick={() => rejectFriend()}
                disabled={isLoadingReject}
              >
                Reject
              </Button>
            </div>
          ) : checkFriendship(currentUser as User, friend) ===
            FriendshipStatus.REQUEST_SENT ? (
            <p className="text-xs text-muted-foreground tracking-tighter">
              Friend request sent
            </p>
          ) : null}
        </CardFooter>
      ) : null}
    </Card>
  );
}
