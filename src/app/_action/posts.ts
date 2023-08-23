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
  const url = externalId ? `/api/posts?userId=${externalId}` : "/api/posts";
  const params = { take, lastCursor };
  const response = await axios.get(url, { params });
  return response.data;
}

export async function fetchPost(postId: string): Promise<Post> {
  const response = await axios.get(`/api/posts/${postId}`);
  const post = response.data;
  return post;
}
