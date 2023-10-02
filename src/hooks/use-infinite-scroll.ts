import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { batchSize } from "@/lib/limit-batch";

interface InfiniteScrollProps {
  queryKey: string;
  apiUrl: string;
  batchType: keyof typeof batchSize;
  enabled?: boolean;
  postId?: string
}

export function useInfiniteScroll({
  queryKey,
  enabled,
  apiUrl,
  postId,
  batchType,
}: InfiniteScrollProps) {
  const { ref, inView } = useInView();
  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          take: batchSize[batchType],
          postId: postId,
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
    isFetching,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => {
      return lastPage?.metaData.lastCursor;
    },
    refetchOnWindowFocus: false,
    enabled,
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
    ref,
    inView,
    isFetching,
  };
}
