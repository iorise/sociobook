import { auth } from "@clerk/nextjs";

import { FriendsCard } from "@/components/profile/friends";
import { Shell } from "@/components/shell";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/prismadb";

export default async function FriendsPage() {
  const { userId } = auth();

  const currentUser = await prismadb.user.findUnique({
    where: {
      externalId: userId as string,
    },
  });

  const friends = await prismadb.user.findMany({
    where: {
      externalId: {
        in: currentUser?.friendIds || [],
      },
    },
    take: 12,
    orderBy: {
      createdAt: "desc",
    },
  });

  const friendRequests = await prismadb.user.findMany({
    where: {
      externalId: {
        in: currentUser?.friendRequests || [],
      },
    },
    take: 12,
    orderBy: {
      createdAt: "desc",
    },
  });

  const suggestedFriends = await prismadb.user.findMany({
    where: {
      externalId: {
        not: {
          in: [
            ...(currentUser?.friendIds || []),
            ...(currentUser?.friendRequests || []),
          ],
        },
      },
      NOT: {
        externalId: currentUser?.externalId,
      },
    },
    take: 18,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <Shell className="px-1 md:px-8">
      <FriendsCard
        friends={friends}
        type="Friends"
        emptyState="No Friend"
        initialUrl="/friends"
        currentUser={currentUser}
      />
      <Separator />
      <FriendsCard
        friends={friendRequests}
        type="Friend Requests"
        emptyState="No Friend Requests"
        initialUrl="/friends/request"
        currentUser={currentUser}
      />
      <Separator className="mx-0" />
      <FriendsCard
        friends={suggestedFriends}
        type="Suggested Friends"
        emptyState="No Suggested"
        initialUrl="/people"
        currentUser={currentUser}
      />
    </Shell>
  );
}
