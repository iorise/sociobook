import { MainNav } from "@/types";

export const siteSearch = [
  {
    title: "All",
    href: "/search",
    icon: "home",
  },
  {
    title: "People",
    href: "/search/people",
    icon: "userPlus",
    disabled: true
  },
  {
    title: "Post",
    href: "/search/post",
    icon: "user",
    disabled: true
  },
] satisfies MainNav[];
