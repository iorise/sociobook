"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface FriendCardProps {
  friends: User[];
}

export function FriendsCard({ friends }: FriendCardProps) {
  return (
    <Card>
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-2xl">Friends</CardTitle>
        <CardDescription>{friends.length} Friend</CardDescription>
        <CardContent className="px-0">
          <div className="grid grid-cols-3 gap-2.5 w-full">
            {friends.length !== 0 ? (
              friends.map((friend) => (
                <div
                  key={friend.id}
                  className="active:scale-95 transition-all duration-150 active:opacity-80"
                >
                  <Link href={`/profile/${friend.externalId}`}>
                    <Image
                      src={friend.externalImage ?? friend.profileImage ?? ""}
                      alt={friend.firstName ?? ""}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      width={100}
                      height={100}
                      className="rounded-md object-cover w-full aspect-square"
                    />
                    <p className="text-sm font-semibold line-clamp-1">
                      {friend.firstName} {friend.lastName ?? ""}
                    </p>
                  </Link>
                </div>
              ))
            ) : (
              <div className="w-full flex justify-center items-center text-center text-muted-foreground">
                No friend
              </div>
            )}
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
