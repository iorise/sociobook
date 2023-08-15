import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useCurrentUser } from "./use-currentUser";
import { usePost } from "./use-post";

export const useLike = ({
  postId,
  userId,
}: {
  postId: string;
  userId?: string;
}) => {
  const { data: current } = useCurrentUser();
  const queryClient = useQueryClient();

  const { data: fetchedPost } = usePost(postId);

  const hasLiked = React.useMemo(() => {
    const list = fetchedPost?.likeIds || [];

    return list.includes(current?.externalId ?? "");
  }, [fetchedPost?.likeIds, current]);

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
