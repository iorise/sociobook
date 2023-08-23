import { User } from "@prisma/client";
import axios from "axios";

export async function getCurrentUser(): Promise<User> {
  const response = await axios.get("/api/current");
  return response.data;
}
