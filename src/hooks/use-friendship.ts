import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";

interface Props {
  otherUserId: string | null | undefined;
  currentUserId: string | null | undefined;
}

export function useFriendship({ otherUserId, currentUserId }: Props) {
  const queryClient = useQueryClient();
  const params = useParams();

  const { mutateAsync: requestFriend } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(`/api/friendship/${otherUserId}`, {
        action: "request",
        friendId: currentUserId,
      });
      return data;
    },
  });

  const { mutateAsync: acceptFriend } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.patch(`/api/friendship/${otherUserId}`, {
        action: "accept",
        friendId: currentUserId,
      });
      return data;
    },
  });

  const { mutateAsync: rejectFriend } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.patch(`/api/friendship/${otherUserId}`, {
        action: "reject",
        friendId: otherUserId,
      });
      return data;
    },
  });

  const { mutateAsync: removeFriend } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(`/api/friendship/${otherUserId}`, {
        data: {
          action: "remove",
          friendId: currentUserId,
        },
      });
      return data;
    },
  });

  return {
    requestFriend,
    acceptFriend,
    rejectFriend,
    removeFriend,
  };
}
