import { fetchPost } from '@/app/_action/posts';
import { useQuery } from '@tanstack/react-query';

export function usePost(postId: string) {
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryFn: () => fetchPost(postId),
    queryKey: ["post", postId],
  });

  return { data, isLoading, isError, isSuccess };
}