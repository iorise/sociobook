import { Icons } from "@/components/icons";
import React from "react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh_-_3.5rem)] w-full flex flex-col gap-5 items-center justify-center">
      <Icons.lock className="w-20 h-20 text-facebook-primary" />
      <p className="text-xl font-medium text-muted-foreground">
        This page does not exist.
      </p>
    </div>
  );
}
