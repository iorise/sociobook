import { Icons } from "@/components/icons";
import { Comment, Image, Post, Prisma, User } from "@prisma/client";
import { FileWithPath } from "react-dropzone";

export interface MainNav {
  title: string;
  href: string;
  icon?: keyof typeof Icons;
  iconFill?: keyof typeof Icons;
  allowed?: boolean;
  hidden?: boolean;
  show?: boolean;
  disabled?: boolean;
}

export interface SidebarNav {
  title: string;
  href: string;
  icon?: keyof typeof Icons;
  disabled?: boolean;
}

export type CommentWithUser = Prisma.CommentGetPayload<{
  include: { author: true };
}>;

export type PostWithUser = Prisma.PostGetPayload<{
  include: { user: true; comments: true };
}>;

export type extendedPost = Post & {
    user: User
    comments: Comment[]
    images: Image[]
}

export type NotificationWithUser = Prisma.NotificationGetPayload<{
  include: {user: true}
}>

export type FileWithPreview = FileWithPath & {
  preview: string
}

export enum FriendshipStatus {
  FRIENDS = "FRIENDS",
  NOT_FRIENDS = "NOT_FRIENDS",
  REQUEST_SENT = "REQUEST_SENT",
  REQUEST_RECEIVED = "REQUEST_RECEIVED",
}
