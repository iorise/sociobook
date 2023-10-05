"use client";

import * as React from "react";
import { User } from "@prisma/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { UserAvatar } from "@/components/user/user-avatar";
import { useSearchQuery } from "@/hooks/use-search-query";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PeopleListProps {
  apiUrl: string;
  queryKey: string;
}

export default function PeopleList({ apiUrl, queryKey }: PeopleListProps) {
  const searchParams = useSearchParams();
  const query = searchParams ? searchParams.get("q") : null;

  const encodedSearchQuery = encodeURI(query || "");
  const { data, refetch, isLoading, isFetched } = useSearchQuery<User[]>({
    apiUrl,
    queryKey,
    take: 5,
    query: encodedSearchQuery,
  });

  React.useEffect(() => {
    refetch();
  }, [encodedSearchQuery]);

  return (
    <div className="w-full max-w-xl">
      {query && query?.length > 0 ? (
        isFetched && data?.length === 0 ? (
          <div className="py-6 w-full flex items-center justify-center rounded-sm text-muted-foreground">
            <p>No Result found.</p>
          </div>
        ) : isLoading ? (
          <div className="w-full flex items-center justify-center">
            <Icons.spinner className="w-4 h-4 animate-spin" />
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>People</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="w-full flex flex-col gap-1.5">
                {data?.map((user: User) => (
                  <li key={user.id}>
                    <Link
                      href={`/profile/${user.externalId}`}
                      className="flex gap-2 p-2 items-center hover:bg-accent transition-all duration-200 rounded-md"
                    >
                      <UserAvatar
                        src={user.externalImage ?? user.profileImage ?? ""}
                      />
                      <p className="text-xs md:text-sm line-clamp-1">{`${
                        user.firstName
                      } ${user.lastName || ""}`}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                size="sm"
                className="w-full cursor-not-allowed"
                variant="outline"
              >
                See more
              </Button>
            </CardFooter>
          </Card>
        )
      ) : null}
    </div>
  );
}
