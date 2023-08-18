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
  const { data } = await axios.get(`/api/comment?postId=${postId}`, {
    params: { take, lastCursor },
  });
  return data;
}
