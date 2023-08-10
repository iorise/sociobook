import fetcher from "@/lib/fetcher";
import axios from "axios";
import useSWR from "swr";


export function usePosts  (externalId?: string) {
  const url = externalId
    ? `/api/posts/${externalId}`
    : `/api/posts`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return { data, error, isLoading, mutate };
};

type UserQueryParams = {
  externalId?: string | null
  take?: number;
  lastCursor?: string;
};

export async function allPosts( { externalId, take, lastCursor }: UserQueryParams) {

  const response = await axios.get(!externalId ? "/api/posts" : `/api/posts/${externalId}`, {
    params: { take, lastCursor },
  });
  return response.data;
};


