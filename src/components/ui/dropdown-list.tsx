"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

interface DropdownListProps {
  title: string;
  icon: React.ReactElement;
  item?: boolean;
}

export function DropdownList({ title, icon, item }: DropdownListProps) {
  const { setTheme, theme } = useTheme();
  const isDarkMode = theme === "dark";

  const toggleDarkMode = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };
  return (
    <div
      className={cn(
        "flex cursor-pointer items-center hover:bg-accent py-1.5 px-3 rounded-lg",
        item ? "justify-between" : ""
      )}
    >
      <div className="flex items-center">
        <div className="mr-2 bg-accent brightness-110 rounded-full p-2">
          {icon}
        </div>
        <span>{title}</span>
      </div>
      <div>
        {item && (
          <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
        )}
      </div>
    </div>
  );
}
