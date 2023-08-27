"use client";

import * as React from "react";
import { User as userDb } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostFeeds } from "@/components/post-feeds";

interface infoViewProps {
  currentUser: userDb | null;
  initialData: userDb | null;
  externalId?: string | null;
  isCurrentUser?: boolean;
}

export function InfoView({
  initialData,
  externalId,
  isCurrentUser,
  currentUser,
}: infoViewProps) {
  const bio = initialData?.bio;

  return (
    <div className="container px-10 xl:px-36 grid grid-cols-1 lg:grid-cols-[29rem_minmax(0,1fr)] gap-6">
      <aside className="top-14 z-30 w-full shrink-0 py-4">
        <Card>
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-2xl">Bio</CardTitle>
          </CardHeader>
          <CardContent className="px-8 ">
            <div className="w-full text-center">
              {isCurrentUser ? (
                bio !== null || bio !== "" ? (
                  <div className="flex flex-col gap-2">
                    <p className="w-full break-words flex-wrap text-center">
                      {bio}
                    </p>
                    <Button variant="outline" className="w-full">
                      Edit bio
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="w-full text-center">No bio to show.</p>
                    <Button variant="outline" className="w-full">
                      Add bio
                    </Button>
                  </div>
                )
              ) : (
                <p
                  className="w-full break-words flex-wrap text-center"
                >
                  {bio}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </aside>
      <div>
        <PostFeeds
          currentUser={currentUser}
          initialData={initialData}
          isCurrentUser={isCurrentUser}
          externalId={externalId}
        />
      </div>
    </div>
  );
}
