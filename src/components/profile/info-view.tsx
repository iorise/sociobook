"use client";

import * as React from "react";
import { User } from "@clerk/nextjs/server";
import { User as userDb } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Feeds } from "../feeds";

interface FeedsProps {
  user: User | null;
  initialData: userDb | null;
}

export function InfoView({ user, initialData }: FeedsProps) {
  const bio = initialData?.bio;
  return (
    <div className="container px-10 xl:px-36 grid grid-cols-1 md:grid-cols-[500px_minmax(0,1fr)] gap-6">
      <aside className="lg:sticky top-14 z-30 w-full shrink-0 py-4">
        <Card>
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-2xl">Bio</CardTitle>
          </CardHeader>
          <CardContent className="px-8 ">
            {bio ? (
              <div className="w-full text-center flex flex-col gap-2">
                <p className="break-words flex-wrap">{initialData?.bio}</p>
                <Button variant="outline" className="w-full">
                  Edit bio
                </Button>
              </div>
            ) : (
              <Button variant="outline" className="w-full">
                Add bio
              </Button>
            )}
          </CardContent>
        </Card>
      </aside>
      <div>
        <Feeds user={user} initialData={initialData} />
      </div>
    </div>
  );
}
