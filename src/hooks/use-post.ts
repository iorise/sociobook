import { fetchPost } from "@/app/_action/posts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export function usePost(postId: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryFn: () => fetchPost(postId),
    queryKey: ["post", postId],
    refetchOnWindowFocus: false,
  });

  const { mutateAsync: deletePost, isLoading: isDeletingPost } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/posts/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      toast.success("Post deleted", {
        position: "bottom-left",
      });
    },
  });

  return { data, isLoading, isError, isSuccess, deletePost, isDeletingPost };
}
