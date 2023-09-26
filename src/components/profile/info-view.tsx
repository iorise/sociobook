"use client";

import * as React from "react";
import { User as userDb } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface infoViewProps {
  initialData: userDb | null;
  isCurrentUser?: boolean;
}

export function InfoView({
  initialData,
  isCurrentUser,
}: infoViewProps) {
  const bio = initialData?.bio;

  return (
    <Card>
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-xl">Bio</CardTitle>
      </CardHeader>
      <CardContent className="px-8 ">
        <div className="w-full text-center">
          {isCurrentUser ? (
            bio !== null && bio !== "" && bio !== undefined ? (
              <div className="flex flex-col gap-2">
                <p className="w-full break-words flex-wrap text-center">
                  {bio}
                </p>
                <Button disabled variant="outline" className="w-full">
                  Edit bio
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="w-full text-center text-muted-foreground">
                  No bio to show.
                </p>
                <Button disabled variant="outline" className="w-full">
                  Add bio
                </Button>
              </div>
            )
          ) : (
            <p className="w-full break-words flex-wrap text-center">
              {bio !== null && bio !== "" && bio !== undefined ? (
                bio
              ) : (
                <p className="w-full text-center text-muted-foreground">
                  No bio to show.
                </p>
              )}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
