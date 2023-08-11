import { currentUser as current, useSession } from "@clerk/nextjs";

import { SidebarNav } from "@/components/layouts/sidebar-nav";
import { PostFeeds } from "@/components/post-feeds";
import { siteConfig } from "@/config/site";
import { Aside } from "@/components/layouts/aside";
import prismadb from "@/lib/prismadb";

export default async function DashboardPage() {
  const user = await current();

  const currentUser = await prismadb.user.findUnique({
    where: {
      externalId: user?.id,
    },
  });

  const users = await prismadb.user.findMany({
    where: {
      externalId: {
        not: user?.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const currentUsers = currentUser?.externalId === user?.id;

  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[minmax(0,1fr)_150px] md:gap-6 lg:grid-cols-[258px_minmax(0,1fr)_200px] xl:gap-16">
      <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.6rem)] w-full shrink-0 lg:sticky lg:block py-4">
        <SidebarNav items={siteConfig.sidebarNav} />
      </aside>
      <PostFeeds user={user} currentUser={currentUser} currentUsers={currentUsers}/>
      <Aside users={users} />
    </div>
  );
}
