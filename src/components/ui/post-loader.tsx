"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PostLoader() {
  return (
    <Card>
            <CardContent>
              <div className="flex flex-col gap-48">
                <div className="flex items-center mt-5">
                  <Skeleton className="h-10 w-10 rounded-full mr-4" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-4 w-[190px]" />
                  </div>
                </div>
                <div className="flex justify-center gap-16 md:gap-36">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
  )
}
