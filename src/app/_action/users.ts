import { User } from "@prisma/client";
import axios from "axios";

export async function getCurrentUser(): Promise<User> {
  const response = await axios.get("/api/current");
  return response.data;
}

export async function getSearchUsers(
  searchQuery: string
): Promise<
  Pick<
    User,
    "firstName" | "lastName" | "externalImage" | "externalId" | "profileImage"
  >[]
> {
  const response = await axios.get(`/api/search/people?q=${searchQuery}`);
  return response.data;
}
