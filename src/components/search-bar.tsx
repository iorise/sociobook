"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import debounce from "lodash.debounce";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { User } from "@prisma/client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useOnClickOutside } from "@/hooks/use-onclick-outside";

export function SearchBar() {
  const [input, setInput] = React.useState("");
  const router = useRouter();
  const pathname = usePathname();
  const commandRef = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(commandRef, () => {
    setInput("");
  });

  const request = debounce(async () => {
    refetch();
  }, 300);

  const debounceRequest = React.useCallback(() => {
    request();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    isFetched,
    data: userQueryResult,
    isFetching,
    refetch,
  } = useQuery({
    queryFn: async () => {
      if (!input) return [];
      const { data } = await axios.get(`/api/search/people?q=${input}`);
      return data as User[];
    },
    queryKey: ["users-search-query"],
    enabled: false,
  });

  React.useEffect(() => {
    setInput("");
  }, [pathname]);

  return (
    <Command
      ref={commandRef}
      className="rounded-lg rounded-l-full rounded-r-full relative max-w-lg z-50 overflow-visible"
    >
      <CommandInput
        isLoading={isFetching}
        onValueChange={(text) => {
          setInput(text);
          debounceRequest();
        }}
        value={input}
        className="outline-none border-none focus:border-none focus:outline-none ring-0 rounded-full"
        placeholder="Search in Facebook"
      />
      {input.length > 0 && (
        <CommandList className="absolute top-full bg-secondaryBackground inset-x-0 shadow rounded-b-md">
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
          {userQueryResult?.map((user) => (
            <CommandItem
              key={user.externalId}
              value={`${user.firstName || ""} ${user.lastName || ""}`.trim()}
              onSelect={() => router.push(`/profile/${user.externalId}`)}
            >
              <Avatar className="w-6 h-6 mr-2">
                <AvatarImage
                  src={user.externalImage ?? user.profileImage ?? ""}
                />
              </Avatar>
              {user.firstName} {user.lastName}
            </CommandItem>
          ))}
        </CommandList>
      )}
    </Command>
  );
}
