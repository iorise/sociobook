import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Post, User } from "@prisma/client";

export function usePost(postId: string, queryKey?: string) {
  const queryClient = useQueryClient();

  // const { data, isLoading, isError, isSuccess } = useQuery({
  //   queryFn: async () => {
  //     const { data } = await axios.get(`/api/posts/${postId}`);
  //     return data as Post & {user: User};
  //   },
  //   queryKey: ["post", postId],
  //   refetchOnWindowFocus: false,
  // });

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
