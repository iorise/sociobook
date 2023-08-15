import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export async function getCurrentUser(): Promise<User> {
  const {data} = await axios.get("/api/current");
  return data;
}

export function useCurrentUser() {
  const {data, isLoading} = useQuery({
    queryFn: () => getCurrentUser(),
    queryKey: ["currentUser"]
  });

  return {data, isLoading}
}
