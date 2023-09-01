import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface Props {
  otherUserId: string | null | undefined;
  currentUserId: string | null | undefined;
}

export function useFriendship({ otherUserId, currentUserId }: Props) {
  const router = useRouter();

  const { mutateAsync: requestFriend, isLoading: isLoadingRequest } =
    useMutation({
      mutationFn: async () => {
        const { data } = await axios.post(`/api/friendship/${otherUserId}`, {
          action: "request",
          friendId: currentUserId,
        });
        return data;
      },
      onSuccess: () => {
        router.refresh();
        toast.success("Friend request sent", {
          position: "bottom-left",
        });
      },
    });

  const { mutateAsync: acceptFriend, isLoading: isLoadingAccept } = useMutation(
    {
      mutationFn: async () => {
        const { data } = await axios.patch(`/api/friendship/${otherUserId}`, {
          action: "accept",
          friendId: currentUserId,
        });
        return data;
      },
      onSuccess: () => {
        router.refresh();
        toast.success("Friend request accepted", {
          position: "bottom-left",
        });
      },
    }
  );

  const { mutateAsync: rejectFriend, isLoading: isLoadingReject } = useMutation(
    {
      mutationFn: async () => {
        const { data } = await axios.patch(`/api/friendship/${otherUserId}`, {
          action: "reject",
          friendId: otherUserId,
        });
        return data;
      },
      onSuccess: () => {
        router.refresh();
        toast.success("Friend request rejected", {
          position: "bottom-left",
        });
      },
    }
  );

  const { mutateAsync: removeFriend, isLoading: isLoadingRemove } = useMutation(
    {
      mutationFn: async () => {
        const { data } = await axios.delete(`/api/friendship/${otherUserId}`, {
          data: {
            action: "remove",
            friendId: currentUserId,
          },
        });
        return data;
      },
      onSuccess: () => {
        router.refresh();
        toast.success("Friend removed", {
          position: "bottom-left",
        });
      },
    }
  );

  return {
    requestFriend,
    isLoadingRequest,
    acceptFriend,
    isLoadingAccept,
    rejectFriend,
    isLoadingReject,
    removeFriend,
    isLoadingRemove,
  };
}
