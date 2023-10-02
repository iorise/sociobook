"use client";

import { useUser } from "@clerk/nextjs";

export function UserProfile() {
  const { user } = useUser();

  return (
    <div>
      <div>
        <img src={user?.imageUrl} alt="" />
        <img src={user?.profileImageUrl} alt="" />
        {user?.fullName ?? user?.username}
      </div>
    </div>
  );
}
