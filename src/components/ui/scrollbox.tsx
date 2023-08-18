"use client";

import { cn } from "@/lib/utils";

interface ScrollboxProps {
  children: React.ReactNode;
  className?: string;
}

export function Scrollbox({ children, className }: ScrollboxProps) {
  return (
    <div
      className={cn(
        `flex flex-col overflow-x-hidden overflow-y-scroll max-h-56 md:max-h-80 scrollbar-thin scrollbar-thumb-input scrollbar-track-card scrollbar-track-rounded-xl scrollbar-thumb-rounded-xl`,
        className
      )}
    >
      {children}
    </div>
  );
}
