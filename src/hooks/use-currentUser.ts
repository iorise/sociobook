import { getCurrentUser } from "@/app/_action/users";
import { useQuery } from "@tanstack/react-query";

export function useCurrentUser() {
  const {data, isLoading} = useQuery({
    queryFn: () => getCurrentUser(),
    queryKey: ["currentUser"]
  });

  return {data, isLoading}
}
