import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchComments } from "@/app/_action/comment";

const BATCH_COMMENTS = 3

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
      fetchComments({ postId, take: BATCH_COMMENTS, lastCursor: pageParam }),
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
