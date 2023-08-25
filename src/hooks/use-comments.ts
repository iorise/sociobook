import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchComments } from "@/app/_action/comment";

export function useComments(postId: string) {
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
      fetchComments({ postId, take: 10, lastCursor: pageParam }),
    queryKey: ["comment", postId],
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
