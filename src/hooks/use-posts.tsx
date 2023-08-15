import { fetchPosts } from "@/app/_action/posts";
import { useQuery } from "@tanstack/react-query";

export function usePosts (externalId?: string) {
  const {data, isLoading} = useQuery({
    queryFn: () => fetchPosts({externalId}),
    queryKey: (["posts"])
  })

  return {data, isLoading}
}


