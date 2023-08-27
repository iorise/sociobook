import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { isClerkAPIResponseError } from "@clerk/nextjs";
import { formatDistanceToNowStrict } from "date-fns";
import { User } from "@prisma/client";
import { FriendshipStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function catchClerkError(err: unknown) {
  const unknownErr = "Something went wrong, please try again later.";

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });
    return toast(errors.join("\n"));
  } else if (isClerkAPIResponseError(err)) {
    return toast.error(err.errors[0]?.longMessage ?? unknownErr);
  } else {
    return toast.error(unknownErr);
  }
}

export function formatBytes(
  bytes: number,
  decimals = 0,
  sizeType: "accurate" | "normal" = "normal"
) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`;
}

export function formatDates(date: Date) {
  const distance = formatDistanceToNowStrict(new Date(date));
  const formattedDistance = distance
    .replace("seconds", "s")
    .replace("second", "s")
    .replace("minutes", "m")
    .replace("minute", "m")
    .replace("hours", "h")
    .replace("hour", "h")
    .replace("days", "d")
    .replace("day", "d")
    .replace("months", "mo")
    .replace("month", "mo")
    .replace("years", "y")
    .replace("year", "y");

  return formattedDistance;
}

export function isArrayOfFile(files: unknown): files is File[] {
  const isArray = Array.isArray(files);
  if (!isArray) return false;
  return files.every((file) => file instanceof File);
}

export function checkFriendship(currentUser: User | null, otherUser: User | null) {
  if (currentUser?.friendIds.find((friend) => friend === otherUser?.externalId)) {
    return FriendshipStatus.FRIENDS;
  }

  if (
    currentUser?.friendRequests.find((friend) => friend === otherUser?.externalId)
  ) {
    return FriendshipStatus.REQUEST_RECEIVED;
  }

  if (
    otherUser?.friendRequests.find(
      (friendRequest) => friendRequest === currentUser?.externalId
    )
  ) {
    return FriendshipStatus.REQUEST_SENT;
  }

  return FriendshipStatus.NOT_FRIENDS;
}
