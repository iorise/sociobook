"use client";

import { User } from "@prisma/client";
import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserName } from "@/components/user/user-name";
import { setTransition } from "@/lib/transition";

interface FriendListProps {
  user: User;
}

export function FriendListItem({ user }: FriendListProps) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        {...setTransition({
          duration: 0.7,
        })}
      >
        <Button
          variant="ghost"
          className="justify-start flex gap-3 py-6 w-full"
          asChild
        >
          <Link href={`/profile/${user?.externalId}`}>
            <Avatar className="w-9 h-9">
              <AvatarImage
                src={user?.externalImage ?? user.profileImage ?? ""}
                alt={user?.firstName ?? ""}
              />
              <AvatarFallback>
                <img src="/images/placeholder.png" />
              </AvatarFallback>
            </Avatar>
            <UserName
              firstName={user?.firstName || ""}
              lastName={user.lastName || ""}
              verified={user.verified}
              iconClassName="h-4 w-4"
            />
          </Link>
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}
