"use client";

import Link from "next/link";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";

import { Icons } from "@/components/icons";
import { MainNav } from "@/components/layouts/main-nav";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { ProfileDropdown } from "@/components/nav-dropdown/profile-dropdown";
import { NotificationsDropdown } from "@/components/nav-dropdown/notification-dropdown";
import { SearchInput } from "@/components/input/search-input";
import { usePostModal } from "@/hooks/use-post-modal";

interface SiteHeaderProps {
  currentUser: User | null;
}

export function SiteHeader({ currentUser }: SiteHeaderProps) {
  const router = useRouter();

  const { onOpen } = usePostModal();
  return (
    <header className="sticky h-14 top-0 z-40 w-full border-b bg-secondaryBackground">
      <div className="px-2 sm:px-4 h-full flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <Link aria-label="Home" href="/">
            <Icons.logo id="logo" className="w-9 h-9 md:w-10 md:h-10" />
          </Link>

          <SearchInput />
        </div>
        <div className="flex-1 md:flex-none">
          <MainNav items={siteConfig.MainNav} />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full hidden lg:flex cursor-not-allowed"
          >
            <Icons.menu className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full lg:hidden flex"
            onClick={() => onOpen()}
          >
            <Icons.plus className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full hidden lg:flex cursor-not-allowed"
          >
            <Icons.message className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full flex lg:hidden duration-0 active:scale-95 transition-all active:opacity-80"
            onClick={() => router.push("/friends")}
          >
            <Icons.people className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
          <NotificationsDropdown />
          <ProfileDropdown currentUser={currentUser} />
        </div>
      </div>
    </header>
  );
}
