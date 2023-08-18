import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "@/app/_action/comment";

export function useComments(postId: string) {
  const { data, isLoading, isFetching, error, isError } = useQuery({
    queryFn: async () => await fetchComments(postId),
    queryKey: ["comment", postId],
  });

  return { data, isLoading, isFetching, error, isError };
}