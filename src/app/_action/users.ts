import { User } from "@prisma/client";
import axios from "axios";

export async function getCurrentUser(): Promise<User> {
  const { data } = await axios.get("/api/current");
  return data;
}
