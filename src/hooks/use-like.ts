import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

import { useCurrentUser } from "@/hooks/use-currentUser";
import { usePost } from "@/hooks/use-post";

export const useLike = (postId: string) => {
  const { data: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();

  const externalId = currentUser?.externalId ?? ""

  const { data: fetchedPost } = usePost(postId);

  const hasLiked = React.useMemo(() => {
    const list = fetchedPost?.likeIds || [];

    return list.includes(externalId);
  }, [fetchedPost?.likeIds, currentUser]);

  const { mutateAsync } = useMutation({
    mutationKey: (["like"]),
    mutationFn: async () => {
      let request;
      hasLiked
        ? (request = () => axios.delete("/api/like", { data: postId }))
        : (request = () => axios.post("/api/like", postId));

      await request();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["post", postId]);
      queryClient.invalidateQueries(["notifications", externalId]);
      toast.success(hasLiked ? "Unliked" : "Liked", {
        position: "bottom-left",
      });
    },
    onError: () => {
      toast.error("Something went wrong", {
        position: "bottom-left",
      });
    },
  });

  const toggleLike = React.useCallback(async () => {
    await mutateAsync();
  }, [mutateAsync]);

  return {
    hasLiked,
    toggleLike,
  };
};
