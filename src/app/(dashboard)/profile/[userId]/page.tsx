import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { ProfileView } from "@/components/profile/profile-view";
import { InfoView } from "@/components/profile/info-view";
import prismadb from "@/lib/prismadb";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { PostFeeds } from "@/components/post-feeds";
import { FriendsCard } from "@/components/profile/friend-card";

interface ProfilePageProps {
  params: { userId: string };
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const initialData = await prismadb.user.findUnique({
    where: {
      externalId: params.userId,
    },
  });

  const title = `${initialData?.firstName || ""} ${
    initialData?.lastName || ""
  } | Profile`;
  const description = `Explore the profile of ${initialData?.firstName} ${initialData?.lastName} in ${siteConfig.title}.`;

  return {
    title,
    description,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  const initialData = await prismadb.user.findUnique({
    where: {
      externalId: params.userId,
    },
  });

  const currentUser = await prismadb.user.findUnique({
    where: {
      externalId: userId,
    },
  });

  const friends = await prismadb.user.findMany({
    where: {
      externalId: {
        in: initialData?.friendIds || [],
      },
    },
    take: 6,
  });

  const isCurrentUser = userId === params.userId;
  return (
    <div>
      <ProfileView
        isCurrentUser={isCurrentUser}
        currentUser={currentUser}
        initialData={initialData}
      />
      <div className="container px-1 sm:px-10 xl:px-36 grid grid-cols-1 lg:grid-cols-[29rem_minmax(0,1fr)] gap-6">
        <aside className="top-14 z-30 w-full shrink-0 py-4 block md:sticky h-full">
          <div className="flex flex-col gap-3">
            <InfoView
              isCurrentUser={isCurrentUser}
              currentUser={currentUser}
              externalId={params.userId}
              initialData={initialData}
            />
            <FriendsCard friends={friends} />
          </div>
        </aside>
        <PostFeeds
          currentUser={currentUser}
          initialData={initialData}
          isCurrentUser={isCurrentUser}
          externalId={params.userId}
        />
      </div>
    </div>
  );
}
