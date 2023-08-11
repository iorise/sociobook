"use client";

import * as React from "react";
import { User } from "@clerk/nextjs/server";
import { User as userDb } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostFeeds } from "@/components/post-feeds";

interface FeedsProps {
  user: User | null;
  initialData: userDb | null;
  currentUser: userDb | null
}

export function InfoView({ user, initialData, currentUser }: FeedsProps) {
  const currentUsers = user?.id === initialData?.externalId;
  const bio = initialData?.bio;

  return (
    <div className="container px-10 xl:px-36 grid grid-cols-1 lg:grid-cols-[29rem_minmax(0,1fr)] gap-6">
      <aside className="top-14 z-30 w-full shrink-0 py-4">
        <Card>
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-2xl">Bio</CardTitle>
          </CardHeader>
          <CardContent className="px-8 ">
            {bio ? (
              <div className="w-full text-center flex flex-col gap-2">
                <p className="break-words flex-wrap">{initialData?.bio}</p>
                {currentUsers ? (
                  <Button variant="outline" className="w-full">
                    Edit bio
                  </Button>
                ) : null}
              </div>
            ) : currentUsers ? (
              <Button variant="outline" className="w-full">
                Add bio
              </Button>
            ) : (
              <p className="w-full text-center">No bio to show.</p>
            )}
          </CardContent>
        </Card>
      </aside>
      <div>
        <PostFeeds
          user={user}
          currentUser={currentUser}
          initialData={initialData}
          currentUsers={currentUsers}
          externalId={initialData?.externalId}
        />
      </div>
    </div>
  );
}
