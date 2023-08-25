import { fetchPosts } from "@/app/_action/posts";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useInfinitePosts(externalId?: string) {
  const {
    data,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isSuccess,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryFn: ({ pageParam = "" }) =>
      fetchPosts({ externalId, take: 6, lastCursor: pageParam }),
    queryKey: ["posts"],
    getNextPageParam: (lastPage) => {
      return lastPage?.metaData.lastCursor;
    },
  });
  return {
    data,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isSuccess,
    isFetchingNextPage,
  };
}
