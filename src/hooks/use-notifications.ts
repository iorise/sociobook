import { NotificationWithUser } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

export function useNotifications() {

  const { data: notifications, isLoading, refetch, error: fetchError } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get("/api/notifications");
      return data as NotificationWithUser[];
    },
    queryKey: ["notifications"],
    enabled: false,
    refetchOnWindowFocus: false,
  });

  const { mutateAsync: deleteNotification, isLoading: isDeleting } =
    useMutation({
      mutationFn: async (notificationId: string) => {
        await axios.delete(`/api/notifications/${notificationId}`);
      },
      onSuccess: () => {
        refetch();
        toast.success("Notification deleted")
      },
    });

  return {
    notifications,
    isLoading,
    deleteNotification,
    fetchError,
    isDeleting,
    refetch
  };
}
