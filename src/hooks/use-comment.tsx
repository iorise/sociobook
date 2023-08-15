import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "@/app/_action/comment";

export function useComment(postId: string) {
  const { data, isLoading } = useQuery({
    queryFn: async () => await fetchComments(postId),
    queryKey: ["comment", postId],
  });

  return { data, isLoading };
}
