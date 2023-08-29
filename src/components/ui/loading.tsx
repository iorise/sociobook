import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/icons";

export default function Loading() {
  return (
    <div className="sticky top-0 z-[999] px-1 sm:px-4 h-14 flex items-center justify-between border-b bg-secondaryBackground">
      <Icons.logo className="w-11 h-11" />
      <div className="flex gap-2">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>
    </div>
  );
}
