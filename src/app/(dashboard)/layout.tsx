import { currentUser } from '@clerk/nextjs'
import { redirect} from "next/navigation"

import { SiteHeader } from "@/components/layouts/site-header";
import { ThemeProvider } from "@/components/theme-provider";

interface LobbyLayoutProps {
  children: React.ReactNode;
}

export default async function LobbyLayout({ children }: LobbyLayoutProps) {
  const user = await currentUser()

  if (!user) {
    redirect("/login")
  }
  return (
    <div>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <SiteHeader user={user}/>
        {children}
      </ThemeProvider>
    </div>
  );
}
