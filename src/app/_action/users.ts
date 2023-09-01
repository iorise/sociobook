import { User } from "@prisma/client";
import axios from "axios";

type getFriendListProps = {
  externalId?: string | null;
  take?: number;
  lastCursor?: string;
};

export async function getCurrentUser(): Promise<User> {
  const res = await axios.get("/api/current");
  return res.data;
}

export async function getSearchUsers(
  searchQuery: string
): Promise<
  Pick<
    User,
    "firstName" | "lastName" | "externalImage" | "externalId" | "profileImage"
  >[]
> {
  const res = await axios.get(`/api/search/people?q=${searchQuery}`);
  return res.data;
}

export async function getFriendList({
  take,
  lastCursor,
}: getFriendListProps) {
  const url = `/api/friends`
  const params = { take, lastCursor };
  const res = await axios.get(url, { params });
  return res.data
}
