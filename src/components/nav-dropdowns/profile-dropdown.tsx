"use client";

import { User } from "@clerk/nextjs/server";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { User as userDb } from "@prisma/client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { DropdownList } from "@/components/ui/dropdown-list";

interface ProfileDropdownProps {
  user: User | null;
  initialData: userDb | null;
}

export function ProfileDropdown({ user, initialData }: ProfileDropdownProps) {
  const initials = `${user?.firstName?.charAt(0) ?? ""} ${
    user?.lastName?.charAt(0) ?? ""
  }`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full h-10 w-10 active:scale-95 active:brightness-90 "
        >
          <Avatar >
            <AvatarImage
              src={
                initialData?.externalImage ??
                user?.profileImageUrl ??
                user?.imageUrl
              }
              alt={user?.firstName ?? ""}
            />
            <AvatarFallback>
              <img src="/images/placeholder.png" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end" forceMount>
        <div className="grid mx-1 mb-3 shadow-lg rounded-lg">
          <Link
            className="flex gap-2 items-center"
            href={`/profile/${user?.id}`}
          >
            <Avatar className="w-9 h-9">
              <AvatarImage
                src={
                  initialData?.externalImage ??
                  user?.profileImageUrl ??
                  user?.imageUrl
                }
                alt={user?.firstName ?? ""}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="text-xl font-semibold">
              {user?.firstName} {user?.lastName}
            </span>
          </Link>
          <Separator className="my-2" />
          <div className="text-facebook-primary cursor-not-allowed">
            See All Profile
          </div>
        </div>
        <div className="relative mx-1 flex flex-col">
          <DropdownList
            title="Settings"
            icon={
              <Icons.setting
                className=" h-6 w-6 rounded-full"
                aria-hidden="true"
              />
            }
          />
          <DropdownList
            title="Help & support"
            icon={
              <Icons.help
                className=" h-6 w-6 rounded-full"
                aria-hidden="true"
              />
            }
          />
          <DropdownList
            item
            title="Dark mode"
            icon={
              <Icons.moon
                className=" h-6 w-6 rounded-full"
                aria-hidden="true"
              />
            }
          />
          <DropdownList
            title="Feedback"
            icon={
              <Icons.feedback
                className=" h-6 w-6 rounded-full"
                aria-hidden="true"
              />
            }
          />
          <SignOutButton>
            <div className="flex cursor-pointer items-center hover:bg-accent py-1.5 px-3 rounded-lg">
              <div className="mr-2 bg-accent brightness-110 rounded-full p-2">
                <Icons.logout
                  className="h-6 w-6 rounded-full"
                  aria-hidden="true"
                />
              </div>
              <span>Log out</span>
            </div>
          </SignOutButton>
        </div>
        <p className="flex-wrap my-2 text-muted-foreground text-xs mx-6">
          Privasi · Ketentuan · Iklan · Pilihan Iklan · Cookie · Lainnya · Meta
          &copy; 2023
        </p>
      </PopoverContent>
    </Popover>
  );
}
