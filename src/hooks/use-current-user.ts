import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useCurrentUser() {
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get("/api/current");
      return data;
    },
    queryKey: ["currentUser"],
  });

  return { data, isLoading };
}
