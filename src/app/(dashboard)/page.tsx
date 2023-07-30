import React from "react";
import { UserButton } from "@clerk/nextjs/app-beta";

export default async function LobbyPage() {

  return (
    <div>
      <UserButton afterSignOutUrl="/login" />
      <div></div>
    </div>
  );
}
