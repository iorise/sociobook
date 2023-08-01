import { MainNav, SidebarNav } from "@/types";

export const siteConfig = {
  MainNav: [
    {
      title: "Home",
      icon: "home",
      iconFill: "homeFill",
      href: "/",
      allowed: true,
      hidden: false,
      show: false,
    },
    {
      title: "Video",
      icon: "video",
      iconFill: "videoFill",
      href: "/video",
      allowed: false,
      hidden: false,
      show: false,
    },
    {
      title: "Marketplace",
      icon: "marketplace",
      iconFill: "marketplaceFill",
      href: "/marketplace",
      allowed: false,
      hidden: false,
      show: false,
    },
    {
      title: "Group",
      icon: "group",
      iconFill: "groupFill",
      href: "/group",
      allowed: false,
      hidden: false,
      show: false,
    },
    {
      title: "Games",
      icon: "game",
      iconFill: "gameFill",
      href: "/games",
      allowed: false,
      hidden: true,
      show: false,
    },
    {
      title: "Other",
      icon: "hamburger",
      iconFill: "hamburger",
      href: "/bookmarks",
      allowed: true,
      hidden: false,
      show: true,
    },
  ] satisfies MainNav[],
  sidebarNav: [
    {
      title: "Friends",
      href: "/friends",
      icon: "people",
      disabled: false,
    },
    {
      title: "Group",
      href: "/group",
      icon: "groupFill",
      disabled: true,
    },
    {
      title: "News",
      href: "/news",
      icon: "news",
      disabled: true,
    },
    {
      title: "Marketplace",
      href: "/marketplace",
      icon: "marketplaceFill",
      disabled: true,
    },
    {
      title: "Video",
      href: "/video",
      icon: "videoFill",
      disabled: true,
    },
  ] satisfies SidebarNav[],
  authFooterNav: [
    {
      title: "Sign Up",
      href: "/signup",
      external: false,
    },
    {
      title: "Log in",
      href: "/login",
      external: false,
    },
    {
      title: "Messenger",
      href: "https://www.messenger.com/",
      external: true,
    },
    {
      title: "Facebook Lite",
      href: "https://en-gb.facebook.com/lite/",
      external: true,
    },
    {
      title: "Video",
      href: "https://en-gb.facebook.com/watch/",
      external: true,
    },
    {
      title: "Places",
      href: "https://en-gb.facebook.com/places/",
      external: true,
    },
    {
      title: "Games",
      href: "https://en-gb.facebook.com/gaming/play/",
      external: true,
    },
    {
      title: "Marketplace",
      href: "https://www.facebook.com/marketplace/",
      external: true,
    },
    {
      title: "Meta Pay",
      href: "https://pay.meta.com/",
      external: true,
    },
    {
      title: "Meta Store",
      href: "https://store.meta.com/",
      external: true,
    },
    {
      title: "Meta Quest",
      href: "https://quest.meta.com/",
      external: true,
    },
    {
      title: "Instagram",
      href: "https://www.instagram.com/",
      external: true,
    },
    {
      title: "Threads",
      href: "https://threads.com/",
      external: true,
    },
    {
      title: "Fundraisers",
      href: "https://www.facebook.com/fundraisers/",
      external: true,
    },
    {
      title: "Services",
      href: "https://www.facebook.com/services/",
      external: true,
    },
    {
      title: "Voting Information Centre",
      href: "https://www.facebook.com/votinginformationcenter/",
      external: true,
    },
    {
      title: "Privacy Policy",
      href: "https://www.facebook.com/about/privacy/",
      external: true,
    },
    {
      title: "Privacy Centre",
      href: "https://www.facebook.com/privacy/",
      external: true,
    },
    {
      title: "Groups",
      href: "https://www.facebook.com/groups/",
      external: true,
    },
    {
      title: "About",
      href: "https://www.facebook.com/about/",
      external: true,
    },
    {
      title: "Create ad",
      href: "https://www.facebook.com/ads/manage/",
      external: true,
    },
    {
      title: "Create Page",
      href: "https://www.facebook.com/pages/create/",
      external: true,
    },
    {
      title: "Developers",
      href: "https://developers.facebook.com/",
      external: true,
    },
    {
      title: "Careers",
      href: "https://www.facebook.com/careers/",
      external: true,
    },
    {
      title: "Cookies",
      href: "https://www.facebook.com/policies/cookies/",
      external: true,
    },
    {
      title: "AdChoices",
      href: "https://www.facebook.com/policies/ads/",
      external: true,
    },
    {
      title: "Terms",
      href: "https://www.facebook.com/policies/",
      external: true,
    },
    {
      title: "Help",
      href: "https://www.facebook.com/help/",
      external: true,
    },
    {
      title: "Contact uploading and non-users",
      href: "https://www.facebook.com/help/contact/135208705162860",
      external: true,
    },
    {
      title: "Settings",
      href: "https://www.facebook.com/settings/",
      external: true,
    },
    {
      title: "Activity log",
      href: "https://www.facebook.com/me/allactivity/",
      external: true,
    },
  ],
};
