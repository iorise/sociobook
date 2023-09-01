import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Metadata } from "next";

import { SidebarNav } from "@/components/layouts/sidebar-nav";
import { PostFeeds } from "@/components/post-feeds";
import { siteConfig } from "@/config/site";
import { Aside } from "@/components/layouts/aside";
import prismadb from "@/lib/prismadb";
import { SidebarShell } from "@/components/shell";

export const metadata: Metadata = {
  title: "Facebook",
  description:
    "Connect with friends and the world around you on Facebook. Share photos, send messages, and more.",
};

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  const currentUser = await prismadb.user.findUnique({
    where: {
      externalId: userId,
    },
  });

  const isCurrentUser = currentUser?.externalId === userId;

  return (
    <div className="mx-auto min-h-[calc(100vh_-_3.5rem)] px-1 flex-1 items-start justify-between md:grid md:grid-cols-[minmax(0,1fr)_260px] lg:grid-cols-[260px_minmax(0,1fr)_260px] p-0 m-0">
      <SidebarShell className="hidden lg:block">
        <SidebarNav items={siteConfig.sidebarNav} currentUser={currentUser} />
      </SidebarShell>
      <main className="px-1 md:px-2 lg:px-16 xl:px-28 container">
        <PostFeeds currentUser={currentUser} isCurrentUser={isCurrentUser} />
      </main>
      <SidebarShell className="hidden md:block">
        <Aside />
      </SidebarShell>
    </div>
  );
}
