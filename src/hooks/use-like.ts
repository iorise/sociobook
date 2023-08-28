import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

import { useCurrentUser } from "@/hooks/use-currentUser";
import { usePost } from "@/hooks/use-post";

interface PostData {
  likeIds: string[];
}

export const useLike = (postId: string) => {
  const { data: currentUser } = useCurrentUser();
  const { data: fetchedPost } = usePost(postId);
  const queryClient = useQueryClient();

  const externalId = currentUser?.externalId;

  const hasLiked = React.useMemo(() => {
    const list = fetchedPost?.likeIds || [];
    return (
      externalId !== undefined &&
      externalId !== null &&
      list.includes(externalId)
    );
  }, [fetchedPost?.likeIds, externalId]);

  const { mutateAsync } = useMutation({
    mutationKey: ["like"],
    mutationFn: async () => {
      let request;
      hasLiked
        ? (request = () => axios.delete("/api/like", { data: postId }))
        : (request = () => axios.post("/api/like", postId));

      await request();
    },
    onMutate: async () => {
      const previousPostData = queryClient.getQueryData<PostData | undefined>([
        "post",
        postId,
      ]);
      await Promise.all([
        queryClient.cancelQueries(["posts"]),
        queryClient.cancelQueries(["post", postId]),
      ]);

      queryClient.setQueryData<PostData | undefined>(
        ["post", postId],
        (oldData) => {
          if (oldData && externalId !== undefined && externalId !== null) {
            let updatedLikeIds = [...oldData.likeIds];

            if (hasLiked) {
              updatedLikeIds = updatedLikeIds.filter((id) => id !== externalId);
            } else if (!updatedLikeIds.includes(externalId)) {
              updatedLikeIds.push(externalId);
            }
            return {
              ...oldData,
              likeIds: updatedLikeIds,
            };
          }
          return oldData;
        }
      );

      return { previousPostData };
    },
    onSettled: () => {
      queryClient.invalidateQueries(["posts"]);
    },
    onError: (_, variables, context) => {
      queryClient.setQueryData(["post", postId], context?.previousPostData);
      toast.error("Like failed", {
        position: "bottom-left",
      });
    },
  });

  const likeCount = React.useMemo(() => {
    return fetchedPost?.likeIds.length ?? 0;
  }, [fetchedPost]);

  const toggleLike = React.useCallback(async () => {
    await mutateAsync();
  }, [mutateAsync]);

  return {
    hasLiked,
    toggleLike,
    likeCount,
  };
};
