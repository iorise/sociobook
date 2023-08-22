import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { SidebarNav } from "@/components/layouts/sidebar-nav";
import { PostFeeds } from "@/components/post-feeds";
import { siteConfig } from "@/config/site";
import { Aside } from "@/components/layouts/aside";
import prismadb from "@/lib/prismadb";

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  const users = await prismadb.user.findMany({
    where: {
      externalId: {
        not: userId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const currentUser = await prismadb.user.findUnique({
    where: {
      externalId: userId,
    },
  });

  const isCurrentUser = currentUser?.externalId === userId;

  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[minmax(0,1fr)_180px] md:gap-8 lg:gap-16 lg:grid-cols-[280px_minmax(0,1fr)_240px]">
      <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.6rem)] w-full shrink-0 lg:sticky lg:block py-4">
        <SidebarNav items={siteConfig.sidebarNav} />
      </aside>
      <PostFeeds currentUser={currentUser} isCurrentUser={isCurrentUser} />
      <aside className="hidden md:sticky md:block fixed top-14 z-30 h-[calc(100vh-3.6rem)] w-full shrink-0  py-4">
        <Aside users={users} />
      </aside>
    </div>
  );
}
