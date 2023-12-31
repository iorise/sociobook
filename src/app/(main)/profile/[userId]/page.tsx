import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { ProfileView } from "@/components/profile/profile-view";
import { InfoView } from "@/components/profile/info-view";
import prismadb from "@/lib/prismadb";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { PostButton } from "@/components/post/post-button";
import { FriendsCard } from "@/components/profile/friends";
import { Posts } from "@/components/post/post-list";
import { PostForm } from "@/components/modal-forms/post-form";

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
  const externalId = params.userId;
  return (
    <div>
      <ProfileView
        isCurrentUser={isCurrentUser}
        currentUser={currentUser}
        initialData={initialData}
      />
      <div className="container px-1 sm:px-10 xl:px-36 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-6">
        <aside className="block md:sticky top-14 z-30 h-full md:h-[calc(100vh_-_3.5rem)] w-full shrink-0 gap-0 py-4">
          <div className="flex flex-col gap-3">
            <InfoView isCurrentUser={isCurrentUser} initialData={initialData} />
            <FriendsCard
              friends={friends}
              type="Friends"
              emptyState="No Friends"
              filled
            />
          </div>
        </aside>
        <div className="py-4 flex flex-col gap-2.5">
          <PostButton
            currentUser={currentUser}
            initialData={initialData}
            isCurrentUser={isCurrentUser}
            externalId={params.userId}
          />
          <Posts
            currentUser={currentUser}
            apiUrl={`/api/posts?userId=${externalId}`}
            queryKey={`posts:${externalId}`}
          />
          <PostForm
            currentUser={currentUser}
            initialData={initialData}
            isCurrentUser={isCurrentUser}
            queryKey={`posts:${externalId}`}
          />
        </div>
      </div>
    </div>
  );
}
