import axios from "axios";
import { Post } from "@prisma/client";

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
  const { data } = await axios.get(url, { params });
  return data;
}

export async function fetchPost(postId: string): Promise<Post> {
  const { data } = await axios.get(`/api/posts/${postId}`);
  return data;
}
