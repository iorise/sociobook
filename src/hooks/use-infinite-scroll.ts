import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";

const BATCH_MESSAGES = 5;

interface InfiniteScrollProps {
  queryKey: string;
  apiUrl: string;
}

export function useInfiniteScroll({ queryKey, apiUrl }: InfiniteScrollProps) {
  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          take: BATCH_MESSAGES,
          lastCursor: pageParam,
        },
      },
      { skipNull: true }
    );

    const payload = await fetch(url);
    return payload.json();
  };

  const {
    data,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isSuccess,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => {
      return lastPage?.metaData.lastCursor;
    },
    refetchOnWindowFocus: false,
  });

  return {
    data,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isSuccess,
    isFetchingNextPage,
    status,
  };
}
