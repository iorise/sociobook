"use client";

import { User } from "@clerk/nextjs/server";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

interface ProfileDropdownProps {
  user: User;
}

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  const initials = `${user?.firstName?.charAt(0) ?? ""} ${
    user?.lastName?.charAt(0) ?? ""
  }`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-full h-10 w-10 ">
          <Avatar className="active:scale-95 transition-all active:opacity-80 duration-0">
            <AvatarImage
              src={user?.profileImageUrl ?? user?.imageUrl}
              alt={user?.firstName ?? ""}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96" align="end" forceMount>
        <DropdownMenuGroup className="mx-4 shadow-lg mb-2">
          <DropdownMenuItem asChild className="text-xl">
            <Link className="flex gap-2" href="">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={user?.profileImageUrl ?? user?.imageUrl}
                  alt={user?.firstName ?? ""}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span>
                {user.firstName} {user.lastName}
              </span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="mx-4" />
          <DropdownMenuItem className="px-2 py-2 text-facebook-primary">
            See All Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup className="mx-1">
          <DropdownMenuItem asChild>
            <Link href="">
              <div className="mr-2 bg-accent brightness-125 rounded-full p-2">
                <Icons.setting
                  className=" h-6 w-6 rounded-full"
                  aria-hidden="true"
                />
              </div>
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="">
              <div className="mr-2 bg-accent brightness-125 rounded-full p-2">
                <Icons.help
                  className=" h-6 w-6 rounded-full"
                  aria-hidden="true"
                />
              </div>
              Help & support
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="">
              <div className="mr-2 bg-accent brightness-125 rounded-full p-2">
                <Icons.moon
                  className=" h-6 w-6 rounded-full"
                  aria-hidden="true"
                />
              </div>
              View & accessibility
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="">
              <div className="mr-2 bg-accent brightness-125 rounded-full p-2">
                <Icons.feedback
                  className=" h-6 w-6 rounded-full"
                  aria-hidden="true"
                />
              </div>
              Feedback
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/login">
              <div className="mr-2 bg-accent brightness-125 rounded-full p-2">
                <Icons.logout
                  className=" h-6 w-6 rounded-full"
                  aria-hidden="true"
                />
              </div>
              <SignOutButton>Log out</SignOutButton>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <p className="flex-wrap my-2 text-muted-foreground text-xs mx-6">
          Privasi · Ketentuan · Iklan · Pilihan Iklan · Cookie · Lainnya · Iori
          &copy; 2023
        </p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
