import { Image } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGetImage(postId: string) {
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryFn: async () => {
      const res = await axios.get(`/api/image?postId=${postId}`);
      return res.data as Image[];
    },
    queryKey: ["image", postId],
  });

  return { data, isLoading, isError, isSuccess };
}
