"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { checkFriendship, cn } from "@/lib/utils";
import { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { FriendshipStatus } from "@/types";
import { useFriendship } from "@/hooks/use-friendship";

interface FriendCardProps {
  type: string;
  emptyState: string;
  initialUrl?: string;
  friends: User[];
  currentUser?: User | null;
  filled?: boolean;
}

export function FriendsCard({
  friends,
  type,
  emptyState,
  initialUrl,
  currentUser,
  filled,
}: FriendCardProps) {
  const pathname = usePathname();

  return (
    <Card className={cn(filled ? "" : "bg-background shadow-none border-none")}>
      <CardHeader className="p-6 pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-xl">{type}</CardTitle>
          {initialUrl ? (
            <Button
              size="sm"
              variant="ghost"
              className="underline text-facebook-primary hover:text-facebook-primary text-sm"
              asChild
            >
              <Link href={initialUrl}>See all</Link>
            </Button>
          ) : null}
        </div>
        <CardDescription>
          {friends.length} {type}
        </CardDescription>
        <CardContent className="px-0">
          {friends.length !== 0 ? (
            <div
              className={cn(
                "grid gap-2.5 w-full",
                pathname === "/friends"
                  ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
                  : "grid-cols-3"
              )}
            >
              {friends.map((friend) => {
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
                    className="rounded-sm active:scale-95 transition-all duration-150 active:opacity-80"
                  >
                    <Link href={`/profile/${friend.externalId}`} tabIndex={-1}>
                      <CardHeader className="border-b p-0">
                        <AspectRatio ratio={10 / 10}>
                          <Image
                            src={
                              friend.externalImage ?? friend.profileImage ?? ""
                            }
                            alt={friend.firstName ?? ""}
                            sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                            fill
                            className="object-cover rounded-t-sm"
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
              })}
            </div>
          ) : (
            <div className="w-full py-6 flex justify-center items-center text-center text-muted-foreground">
              {emptyState}
            </div>
          )}
        </CardContent>
      </CardHeader>
    </Card>
  );
}
