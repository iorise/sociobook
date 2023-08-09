"use client";

import Link from "next/link";
import { User } from "@clerk/nextjs/server";
import { User as userDb } from "@prisma/client";

import { Icons } from "@/components/icons";
import { MainNav } from "@/components/layouts/main-nav";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { ProfileDropdown } from "@/components/nav-dropdowns/profile-dropdown";
import { NotificationsDropdown } from "@/components/nav-dropdowns/notificatioin-dropdown";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import Image from "next/image";

interface SiteHeaderProps {
  user: User | null;
  initialData: userDb | null
}

export function SiteHeader({ user, initialData }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-secondaryBackground">
      <div className="mx-6 flex h-14 items-center justify-between">
        <div className="flex gap-2 -ml-1 items-center">
          <Link aria-label="Home" href="/">
            <Image src="/logo.png" alt="logo" width={55} height={55} />
          </Link>
          <Command className="rounded-full">
            <CommandInput placeholder="Search in Facebook" />
          </Command>
        </div>
        <div className="flex-1 md:flex-none">
          <MainNav items={siteConfig.MainNav} />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full hidden lg:flex"
          >
            <Icons.menu className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full lg:hidden flex"
          >
            <Icons.plus className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Icons.message className="w-5 h-5" />
          </Button>
          <NotificationsDropdown />
          <ProfileDropdown user={user} initialData={initialData}/>
        </div>
      </div>
    </header>
  );
}
