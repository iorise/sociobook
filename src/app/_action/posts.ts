import axios from "axios";
import { Post } from '@prisma/client';

type UserQueryParams = {
  externalId?: string | null;
  take?: number;
  lastCursor?: string;
};

export async function fetchPosts({
  externalId,
  take,
  lastCursor,
}: UserQueryParams) {
  const {data} = await axios.get(
    !externalId ? "/api/posts" : `/api/posts?userId=${externalId}`,
    {
      params: { take, lastCursor },
    }
  );
  return data;
}

export async function fetchPost(postId: string): Promise<Post> {
  const { data } = await axios.get(`/api/posts/${postId}`);
  return data;
}