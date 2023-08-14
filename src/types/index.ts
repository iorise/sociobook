import { Icons } from "@/components/icons";
import { Comment, Post, Prisma, User } from "@prisma/client";

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

export type extendedComment = Comment & {
  author: User;
 
};

export type extendedPost = Post & {
    user: User
    comments: Comment[]
}
