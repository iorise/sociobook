import { currentUser } from "@clerk/nextjs";

import { ProfileForm } from "@/components/profile/profile-form";
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
      <ProfileForm initialData={user} user={authUser}/>
    </div>
  );
}
