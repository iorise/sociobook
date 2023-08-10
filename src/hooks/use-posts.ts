import axios from "axios";

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


