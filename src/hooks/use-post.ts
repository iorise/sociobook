import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export function usePost(postId: string, queryKey: string) {
  const queryClient = useQueryClient();

  const { mutateAsync: deletePost, isLoading: isDeletingPost } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/posts/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([queryKey]);
      toast.success("Post deleted", {
        position: "bottom-left",
      });
    },
  });

  return { deletePost, isDeletingPost };
}
