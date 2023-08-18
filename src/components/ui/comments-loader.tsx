"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function CommentsLoader() {
  return (
    <div className="flex flex-col gap-3 py-2">
      <div className="flex mt-2 gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-16 w-64 rounded-lg" />
      </div>
      <div className="flex mt-2 gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-6 w-1/2 rounded-full" />
      </div>
      <div className="flex mt-2 gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-12 w-36 rounded-lg" />
      </div>
    </div>
  );
}
