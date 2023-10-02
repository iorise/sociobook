"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";
import Link from "next/link";
import { User } from "@prisma/client";

import { useOnClickOutside } from "@/hooks/use-onclick-outside";
import { siteConfig } from "@/config/site";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/user/user-avatar";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useSearchQuery } from "@/hooks/use-search-query";

export function SearchInput() {
  const router = useRouter();
  const commandRef = React.useRef<HTMLDivElement>(null);
  const [input, setInput] = React.useState("");

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
    refetch,
  } = useSearchQuery<User[]>({
    apiUrl: "/api/search/people",
    queryKey: `people:search:query:${input}`,
    query: input,
  });

  useOnClickOutside(commandRef, () => {
    setInput("");
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (typeof input !== "string") {
      return;
    }
    const encodedInput = encodeURI(input);
    router.push(`/search?q=${encodedInput}`);
  };

  console.log(input);

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative" ref={commandRef}>
        <Input
          placeholder={`Search on ${siteConfig.title}`}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            debounceRequest();
          }}
          className="flex-none rounded-full h-9 md:h-10 px-3 shrink-0"
        />
        <div
          className="absolute top-11 w-full bg-secondaryBackground inset-x-0 rounded-md"
          role="listbox"
          aria-label="Search Results"
        >
          {input.length > 0 ? (
            isFetched && userQueryResult?.length === 0 ? (
              <div className="py-6 w-full flex items-center justify-center rounded-sm text-muted-foreground">
                <p className="text-xs line-clamp-1">No Result found.</p>
              </div>
            ) : (
              <ul>
                {userQueryResult?.map((item: User) => (
                  <li key={item.id}>
                    <Link
                      href={`/profile/${item.externalId}`}
                      className="flex gap-2 items-center p-2 hover:bg-accent transition-all duration-300 rounded-sm"
                    >
                      <UserAvatar
                        src={item.externalImage ?? item.profileImage ?? ""}
                        size="sm"
                      />
                      <p className="text-xs md:text-sm line-clamp-1">{`${
                        item.firstName
                      } ${item.lastName || ""}`}</p>
                    </Link>
                  </li>
                ))}

                <li>
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    className="w-full rounded-sm text-facebook-primary duration-300 line-clamp-1"
                  >
                    Search
                    <span className="inline-flex ml-1 items-center">
                      {input}
                      <Icons.search className="w-4 h-4 ml-1" />
                    </span>
                  </Button>
                </li>
              </ul>
            )
          ) : null}
        </div>
      </div>
    </form>
  );
}
