import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { ProfileView } from "@/components/profile/profile-view";
import { InfoView } from "@/components/profile/info-view";
import prismadb from "@/lib/prismadb";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface ProfilePageProps {
  params: { userId: string };
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {

  const initialData = await prismadb.user.findUnique({
    where: {
      externalId: params.userId,
    },
  });

  const title = `${initialData?.firstName || ""} ${initialData?.lastName || ""} | Profile`
  const description = `Explore the profile of ${initialData?.firstName} ${initialData?.lastName} in ${siteConfig.title}.`;

  return {
    title,
    description
  }
}

export default async function ProfilePage(
  { params }: ProfilePageProps,
){
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

  const isCurrentUser = userId === params.userId;
  return (
    <>
      <ProfileView
        isCurrentUser={isCurrentUser}
        currentUser={currentUser}
        userId={userId}
        initialData={initialData}
      />
      <InfoView
        isCurrentUser={isCurrentUser}
        currentUser={currentUser}
        externalId={params.userId}
        initialData={initialData}
      />
    </>
  );
}
