import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { siteConfig } from "@/config/site";
import QueryWrapper from "@/components/providers/provider-client";

import "@/styles/globals.css";

import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
  keywords: ["Next.js", "React", "Tailwind CSS", "Clone app", "SocioBook", "Social network"],
  authors: [
    {
      name: "iori",
      url: "https://github.com/iorise",
    },
  ],
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <QueryWrapper>
        <html lang="en" suppressHydrationWarning>
          <body className={cn(font.className, "antialiased")}>
            {children}
            <Toaster />
          </body>
        </html>
      </QueryWrapper>
    </ClerkProvider>
  );
}
