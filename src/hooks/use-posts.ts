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
  userId?: string
  take?: number;
  lastCursor?: string;
};

export async function allPosts( { userId, take, lastCursor }: UserQueryParams) {

  const response = await axios.get(!userId ? "/api/posts" : `/api/posts/${userId}`, {
    params: { take, lastCursor },
  });
  return response.data;
};


