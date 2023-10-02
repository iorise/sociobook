"use client";

import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { User as userDb } from "@prisma/client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { DropdownList } from "@/components/ui/dropdown-list";
import { UserName } from "@/components/user/user-name";
import { UserAvatar } from "@/components/user/user-avatar";

interface ProfileDropdownProps {
  currentUser: userDb | null;
}

export function ProfileDropdown({ currentUser }: ProfileDropdownProps) {
  const src = currentUser?.externalImage ?? currentUser?.profileImage ?? "";
  const alt = currentUser?.firstName ?? "";
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full w-9 h-9 md:h-10 md:w-10 active:scale-95 active:brightness-90 "
        >
          <UserAvatar src={src} alt={alt} size="md" className="w-9 h-9" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end" forceMount>
        <div className="grid px-1 py-2 mb-3 shadow-glow-sm rounded-lg ">
          <Button variant="ghost" className="flex justify-start py-6" asChild>
            <Link
              className="flex gap-2 items-center"
              href={`/profile/${currentUser?.externalId}`}
            >
              <UserAvatar src={src} alt={alt} size="md" className="w-9 h-9" />
              <UserName
                firstName={currentUser?.firstName}
                lastName={currentUser?.lastName}
                verified={currentUser?.verified}
                className="text-lg font-semibold line-clamp-1"
                iconClassName="h-4 w-4"
              />
            </Link>
          </Button>
          <Separator className="my-2" />
          <p className="px-3 text-facebook-primary cursor-not-allowed text-sm md:text-base tracking-tighter">
            See All Profile
          </p>
        </div>
        <div className="relative px-1 flex flex-col">
          <ul>
            {dropdownItems.map((item) => {
              const Icon = Icons[item.icon ?? "logo"];
              return (
                <li key={item.title}>
                  <DropdownList
                    title={item.title}
                    icon={Icon}
                    item={item.item}
                  />
                </li>
              );
            })}
            <li>
              <SignOutButton>
                <div className="flex cursor-pointer items-center hover:bg-accent py-1.5 px-3 rounded-lg">
                  <div className="mr-2 bg-accent brightness-110 rounded-full p-2">
                    <Icons.logout
                      className="w-4 h-4 md:w-5 md:h-5 text-sm md:text-base"
                      aria-hidden="true"
                    />
                  </div>
                  <span>Log out</span>
                </div>
              </SignOutButton>
            </li>
          </ul>
        </div>
        <p className="flex-wrap my-2 text-muted-foreground text-xs mx-6">
          Privasi · Ketentuan · Iklan · Pilihan Iklan · Cookie · Lainnya · Meta
          &copy; 2023
        </p>
      </PopoverContent>
    </Popover>
  );
}

const dropdownItems = [
  {
    title: "Settings",
    icon: "setting",
  },
  {
    title: "Help & support",
    icon: "help",
  },
  {
    title: "Dark mode",
    icon: "moon",
    item: true,
  },
  {
    title: "Feedback",
    icon: "feedback",
  },
] as { title: string; icon: keyof typeof Icons; item?: boolean }[];
