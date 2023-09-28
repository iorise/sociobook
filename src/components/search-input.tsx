"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";

import { User } from "@prisma/client";
import { useOnClickOutside } from "@/hooks/use-onclick-outside";
import { siteConfig } from "@/config/site";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { UserAvatar } from "./user-avatar";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { useSearchQuery } from "@/hooks/use-search-query";

export const inputType = z.object({
  input: z.string(),
});

type Inputs = z.infer<typeof inputType>;

export function SearchInput() {
  const router = useRouter();
  const commandRef = React.useRef<HTMLDivElement>(null);

  const request = debounce(async () => {
    refetch();
  }, 300);

  const debounceRequest = React.useCallback(() => {
    request();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const form = useForm<Inputs>({
    resolver: zodResolver(inputType),
    defaultValues: {
      input: "",
    },
  });

  const inputValue = form.getValues("input");

  const {
    isFetched,
    data: userQueryResult,
    isFetching,
    refetch,
  } = useSearchQuery<User[]>({
    apiUrl: "/api/search/people",
    queryKey: "people-search-query",
    query: inputValue,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    form.setValue("input", newValue);

    debounceRequest();
  };

  useOnClickOutside(commandRef, () => {
    form.setValue("input", "");
  });

  const handleSubmit = () => {
    if (inputValue) {
      router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="input"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative" ref={commandRef}>
                  <Input
                    placeholder={`Search on ${siteConfig.title}`}
                    type="text"
                    {...field}
                    onChange={handleInputChange}
                    className="flex-none rounded-full h-8 md:h-10 px-3 shrink-0 "
                  />
                  <div
                    className="absolute top-11 w-full bg-secondaryBackground inset-x-0 rounded-md"
                    role="listbox"
                    aria-label="Search Results"
                  >
                    {form.getValues("input").length > 0 ? (
                      isFetched && userQueryResult?.length === 0 ? (
                        <div className="py-6 w-full flex items-center justify-center rounded-sm text-muted-foreground">
                          <p className="text-xs line-clamp-1">
                            No Result found.
                          </p>
                        </div>
                      ) : (
                        <ul >
                          {userQueryResult?.map((item: User) => (
                            <li key={item.id}>
                              <Link
                                href={`/profile/${item.externalId}`}
                                className="flex gap-2 items-center p-2 hover:bg-accent transition-all duration-300 rounded-sm"
                              >
                                <UserAvatar
                                  src={
                                    item.externalImage ??
                                    item.profileImage ??
                                    ""
                                  }
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
                              variant="outline"
                              size="sm"
                              className="w-full rounded-sm text-facebook-primary duration-300"
                            >
                              Search {inputValue}
                              <Icons.search className="w-4 h-4 ml-1" />
                            </Button>
                          </li>
                        </ul>
                      )
                    ) : null}
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
