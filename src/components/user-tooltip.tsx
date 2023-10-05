"use client";

import Link from "next/link";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserName } from "@/components/user/user-name";
import { UserAvatar } from "@/components/user/user-avatar";
import { cn } from "@/lib/utils";

interface UserTooltipProps {
  imageUrl: string;
  firstName: string | null;
  lastName: string | null;
  userCreatedAt: string;
  verified: boolean;
  size: "md" | "lg";
  larger?: boolean;
  href: string;
  children: React.ReactNode;
}

export function UserTooltip({
  imageUrl,
  firstName,
  lastName,
  userCreatedAt,
  verified,
  size,
  href,
  larger,
  children,
}: UserTooltipProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent
          className={cn("bg-card shadow-glow-sm border", larger && "px-6 py-4")}
        >
          <div className="flex items-center justify-center gap-3">
            <Link href={href}>
              <UserAvatar src={imageUrl} size={size} />
            </Link>
            <div className="flex flex-col gap-2">
              <UserName
                firstName={firstName}
                lastName={lastName}
                verified={verified}
                className={cn(
                  "text-sm font-medium text-foreground",
                  larger && "text-base"
                )}
                iconClassName={cn("h-3 w-3", larger && "h-4 w-4")}
              />
              <p className={cn("text-muted-foreground", larger && "text-sm")}>
                Joined: {userCreatedAt}
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
