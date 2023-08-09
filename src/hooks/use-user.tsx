import useSWR from "swr";

import fetcher from "@/lib/fetcher";

const useUser = (externalId: string | undefined) => {
  const { data, error, isLoading, mutate } = useSWR(externalId ? `/api/profile/${externalId}` : null, fetcher);

  return { data, error, isLoading, mutate };
};

export default useUser;
