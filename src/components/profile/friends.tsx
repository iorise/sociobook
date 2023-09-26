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
import { FriendCard } from "./friend-card";

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
                return (
                  <FriendCard
                    key={friend.id}
                    friend={friend}
                    currentUser={currentUser}
                  />
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
