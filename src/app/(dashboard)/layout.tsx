import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { SiteHeader } from "@/components/layouts/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import prismadb from "@/lib/prismadb";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await currentUser();

  if (!user) {
    redirect("/login");
  }

  const initialData = await prismadb.user.findUnique({
    where: {
      externalId: user.id,
    },
  });

  return (
    <div>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <SiteHeader user={user} initialData={initialData} />
        {children}
      </ThemeProvider>
    </div>
  );
}
