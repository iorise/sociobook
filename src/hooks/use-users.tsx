import useSWR from "swr";

import fetcher from "@/lib/fetcher";

const useUsers = () => {
  const { data, error, isLoading, mutate } = useSWR("/api/profile", fetcher);

  return { data, error, isLoading, mutate };
};

export default useUsers;
