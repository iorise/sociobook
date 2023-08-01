import { SidebarNav } from "@/components/layouts/sidebar-nav";
import { PostHomePage } from "@/components/post/post-home-page";
import { siteConfig } from "@/config/site";

export default async function LobbyPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3">
      <SidebarNav items={siteConfig.sidebarNav} />
      <PostHomePage />
    </div>
  );
}
