import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

export function useNotifications() {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteNotification, isLoading: isDeleting } =
    useMutation({
      mutationFn: async (notificationId: string) => {
        await axios.delete(`/api/notifications/${notificationId}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["notifications"]);
        toast.success("Notification deleted");
      },
    });

  return {
    deleteNotification,
    isDeleting,
  };
}
