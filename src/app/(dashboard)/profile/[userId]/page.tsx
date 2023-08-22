import { auth } from "@clerk/nextjs";

import { ProfileView } from "@/components/profile/profile-view";
import { InfoView } from "@/components/profile/info-view";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";

export default async function ProfilePage({
  params,
}: {
  params: { userId: string };
}) {

  const {userId} = auth()

  if (!userId) {
    redirect("/login")
  }

  const initialData = await prismadb.user.findUnique({
    where: {
      externalId: params.userId,
    },
  });

  const currentUser = await prismadb.user.findUnique({
    where: {
      externalId: userId
    }
  })

  const isCurrentUser = userId === params.userId
  return (
    <>
      <ProfileView isCurrentUser={isCurrentUser} currentUser={currentUser} userId={userId} initialData={initialData}/>
      <InfoView isCurrentUser={isCurrentUser} currentUser={currentUser} externalId={params.userId} initialData={initialData}/>
    </>
  );
}
