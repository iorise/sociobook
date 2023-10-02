import { Metadata } from "next";

import { SidebarShell } from "@/components/shell";
import { Sidebar } from "@/components/layouts/sidebar";
import { siteConfig } from "@/config/site";
import { siteSearch } from "@/config/search";

export const metadata: Metadata = {
  title: `Search | ${siteConfig.title}`,
};

interface SearchLayoutProps {
  children: React.ReactNode;
}

export default function SearchLayout({ children }: SearchLayoutProps) {
  return (
    <div className="mx-auto min-h-[calc(100vh_-_3.5rem)] px-0 flex-1 items-start justify-between grid grid-cols-1 sm:grid-cols-[260px_minmax(0,1fr)] p-0 m-0">
      <SidebarShell className="py-0 pl-0 border-r hidden sm:block">
        <Sidebar items={siteSearch} type="Search" />
      </SidebarShell>
      <main className="flex items-center">{children}</main>
    </div>
  );
}
