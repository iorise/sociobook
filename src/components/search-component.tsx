"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { User } from "@prisma/client";

import { getSearchUsers } from "@/app/_action/users";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Shell } from "./shell";

export function PeopleSearchComponent() {
  const search = useSearchParams();
  const searchQuery = search ? search.get("q") : null;

  const encodedSearchQuery = encodeURIComponent(searchQuery || "");

  const { data, isLoading } = useQuery({
    queryKey: ["users", encodedSearchQuery],
    queryFn: () => getSearchUsers(encodedSearchQuery),
    refetchOnWindowFocus: false,
  });

  console.log(data);
  return (
    <Shell>
      <div className="flex flex-col gap-5">
        {data?.map(
          (
            user: Pick<
              User,
              | "firstName"
              | "lastName"
              | "externalImage"
              | "externalId"
              | "profileImage"
            >
          ) => (
            <div key={user.externalId} className="flex items-center gap-2">
              <Avatar>
                <AvatarImage
                  src={user.externalImage ?? user.profileImage ?? ""}
                />
              </Avatar>
              {user.firstName} {user.lastName}
            </div>
          )
        )}
      </div>
    </Shell>
  );
}
