import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import qs from "query-string";

interface UseSearchQueryProps {
  apiUrl: string;
  queryKey: string;
  query?: string;
  take?: number
}

export function useSearchQuery<T>({
  apiUrl,
  queryKey,
  query,
  take,
}: UseSearchQueryProps) {
  const fetchData = async () => {
    const url = qs.stringifyUrl({
      url: apiUrl,
      query: {
        q: query,
        take
      },
    });

    const payload = await fetch(url);
    return payload.json() as T;
  };

  const { isFetched, data, isFetching, refetch, isLoading } = useQuery({
    queryFn: fetchData,
    queryKey: [queryKey],
    refetchOnWindowFocus: false,
    enabled: false,
  });

  return {
    data,
    isFetched,
    isFetching,
    refetch,
    isLoading,
  };
}
