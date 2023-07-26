import { ThemeProvider } from "@/components/theme-provider";
import { currentUser } from '@clerk/nextjs'
import { redirect} from "next/navigation"

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
        {children}
      </ThemeProvider>
    </div>
  );
}
