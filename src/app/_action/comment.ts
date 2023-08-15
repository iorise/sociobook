import axios from "axios";

export async function fetchComments(postId: string) {
    const { data } = await axios.get(`/api/comment?postId=${postId}`)
    return data
}