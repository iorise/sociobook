import useSWR from "swr";

import fetcher from "@/lib/fetcher";

const useCurrentUser = (externalId?: string | undefined) => {
  const { data, error, isLoading, mutate } = useSWR(externalId ? "/api/current" : null, fetcher);

  return { data, error, isLoading, mutate };
};

export default useCurrentUser;
