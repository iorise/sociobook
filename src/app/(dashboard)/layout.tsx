import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { SiteHeader } from "@/components/layouts/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import prismadb from "@/lib/prismadb";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  const initialData = await prismadb.user.findUnique({
    where: {
      externalId: userId,
    },
  });

  return (
    <div>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <SiteHeader currentUser={initialData} />
        {children}
      </ThemeProvider>
    </div>
  );
}
