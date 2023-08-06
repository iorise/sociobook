import { currentUser } from "@clerk/nextjs";

import { ProfileView } from "@/components/profile/profile-view";
import { InfoView } from "@/components/profile/info-view";
import prismadb from "@/lib/prismadb";

export default async function ProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  const user = await prismadb.user.findUnique({
    where: {
      externalId: params.userId,
    },
  });

  const authUser = await currentUser();

  return (
    <div>
      <ProfileView initialData={user} user={authUser}/>
      <InfoView />
    </div>
  );
}
