import axios from "axios";

interface CommentQueryParams {
  postId: string;
  take?: number;
  lastCursor?: string;
}

export async function fetchComments({
  postId,
  take,
  lastCursor,
}: CommentQueryParams) {
  const url = `/api/comment?postId=${postId}`;
  const params = { take, lastCursor };
  const response = await axios.get(url, { params });
  return response.data;
}
