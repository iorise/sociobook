"use client";

import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

interface UserNameProps {
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  verified: boolean | null | undefined;
  className?: string;
  iconClassName?: string;
}

export function UserName({
  firstName,
  lastName,
  verified,
  className,
  iconClassName,
}: UserNameProps) {
  return (
    <p className={cn("text-sm break-words line-clamp-2", className)}>
      {firstName} {lastName}
      <span className="inline-flex items-center ml-1">
        {verified && (
          <Icons.verified
            className={cn("self-center w-[0.87rem] h-[0.87rem]", iconClassName)}
          />
        )}
      </span>
    </p>
  );
}
