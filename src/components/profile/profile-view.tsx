"use client";

import React from "react";
import Image from "next/image";
import { User as userDb } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/icons";
import { useModal } from "@/hooks/use-modal";
import { EditProfile } from "@/components/modal-forms/edit-profile";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserName } from "@/components/user/user-name";
import { useFriendship } from "@/hooks/use-friendship";
import { FriendshipStatus } from "@/types";
import { checkFriendship } from "@/lib/utils";
import ImageModal from "@/components/image/image-modal";
import { UserAvatar } from "../user/user-avatar";

interface ProfileFormProps {
  currentUser: userDb | null;
  initialData: userDb | null;
  isCurrentUser: boolean;
}

export function ProfileView({
  currentUser,
  initialData,
  isCurrentUser,
}: ProfileFormProps) {
  const editPhotoModal = useModal();
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  const {
    requestFriend,
    isLoadingRequest,
    acceptFriend,
    isLoadingAccept,
    rejectFriend,
    isLoadingReject,
    removeFriend,
    isLoadingRemove,
  } = useFriendship({
    otherUserId: initialData?.externalId,
    currentUserId: currentUser?.externalId,
  });

  const { mutateAsync: toggleVerified } = useMutation({
    mutationFn: async () => {
      await axios.patch(`/api/subscribe/${initialData?.externalId}`, {
        verified: !initialData?.verified,
      });
    },
    onSuccess: () => {
      toast.success(
        initialData?.verified
          ? "Success make user unverified !"
          : "Success make user verified !"
      );
      router.refresh();
    },
  });

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsOpen(true);
  };

  return (
    <section
      id="profile"
      className="relative w-full container px-1 md:px-10 xl:px-36 grid grid-cols-1 "
    >
      <div className="flex flex-col relative justify-center">
        <div className="w-full flex">
          {initialData?.coverImage ? (
            <Image
              src={initialData.coverImage}
              alt="Cover image"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              width={1200}
              height={300}
              className="px-0 relative aspect-[3/1.3] md:aspect-[4/1.3] overflow-hidden bg-center rounded-md object-cover cursor-pointer"
              loading="lazy"
              onClick={() => openImageModal(initialData?.coverImage ?? "")}
            />
          ) : (
            <div className="w-full relative aspect-[3/1.3] md:aspect-[4/1.3] overflow-hidden bg-center rounded-md bg-accent brightness-150" />
          )}
        </div>
        <div className="flex-col md:flex">
          <div
            className="
        w-full
        gap-4
        flex
        flex-col
        md:flex
        md:flex-row
        justify-center
        items-center
        md:justify-start
        -top-16
        relative"
          >
            <div className="pl-0 md:pl-10">
              {!isCurrentUser ? (
                <Button
                  variant="none"
                  className="active:scale-95 transition active:brightness-90 hover:brightness-110 w-44 h-44 rounded-full"
                  onClick={() =>
                    openImageModal(
                      initialData?.externalImage ??
                        initialData?.profileImage ??
                        ""
                    )
                  }
                >
                  <UserAvatar
                    src={
                      initialData?.externalImage ??
                      initialData?.profileImage ??
                      ""
                    }
                    alt="Profile image"
                    size="xl"
                  />
                </Button>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="none"
                      className="active:scale-95 active:brightness-90 hover:brightness-110 w-44 h-44 rounded-full"
                    >
                      <UserAvatar
                        src={
                          initialData?.externalImage ??
                          initialData?.profileImage ??
                          ""
                        }
                        alt={initialData?.firstName ?? ""}
                        size="xl"
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-60">
                    <Button
                      variant="ghost"
                      className="justify-start flex gap-3 py-6 w-full"
                      onClick={() =>
                        openImageModal(
                          initialData?.externalImage ??
                            initialData?.profileImage ??
                            ""
                        )
                      }
                    >
                      <Icons.user className="mr-2 w-5 h-5" />
                      <span>See profile photo</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start flex gap-3 py-6 w-full"
                    >
                      <Icons.fileImage className="mr-2 w-5 h-5" />
                      <span>Update photo</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start flex gap-3 py-6 w-full"
                      disabled
                    >
                      <Icons.avatar className="mr-2 w-5 h-5" />
                      <span>Create avatar</span>
                    </Button>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            <div className="flex flex-col pt-0 md:pt-10 items-center md:items-start">
              <UserName
                firstName={initialData?.firstName}
                lastName={initialData?.lastName}
                verified={initialData?.verified}
                className="text-xl text-center md:text-left font-semibold line-clamp-2"
                iconClassName="w-4 h-4"
              />
              <p className="text-muted-foreground">
                {initialData?.friendIds.length} Friends
              </p>
            </div>
          </div>
          <div className="w-full flex gap-2 justify-end">
            {isCurrentUser ? (
              <>
                <Button
                  disabled
                  className="bg-facebook-primary text-white flex-1 md:flex-none"
                >
                  <Icons.plus className="w-4 h-4 mr-2" />
                  <span>Add to story</span>
                </Button>
                <Button
                  className="flex-1 md:flex-none"
                  onClick={() => editPhotoModal.onOpen()}
                >
                  <Icons.pencil className="w-4 h-4 mr-2" />
                  <span>Edit profile</span>
                </Button>
              </>
            ) : (
              <>
                {checkFriendship(currentUser, initialData) ===
                  FriendshipStatus.NOT_FRIENDS && (
                  <Button
                    onClick={() => requestFriend()}
                    className="bg-facebook-primary text-white flex-1 md:flex-none"
                    disabled={isLoadingRequest}
                  >
                    {isLoadingRequest ? (
                      <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Icons.userPlus className="w-5 h-5 mr-2" />
                    )}
                    <span>Add friend</span>
                  </Button>
                )}
                {checkFriendship(currentUser, initialData) ===
                  FriendshipStatus.FRIENDS && (
                  <Button
                    onClick={() => removeFriend()}
                    className="bg-facebook-primary text-white flex-1 md:flex-none"
                    disabled={isLoadingRemove}
                  >
                    {isLoadingRemove ? (
                      <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Icons.userX className="w-5 h-5 mr-2" />
                    )}
                    <span>Unfriend</span>
                  </Button>
                )}
                {checkFriendship(currentUser, initialData) ===
                  FriendshipStatus.REQUEST_RECEIVED && (
                  <>
                    <Button
                      onClick={() => acceptFriend()}
                      className="bg-facebook-primary text-white flex-1 md:flex-none"
                      disabled={isLoadingAccept}
                    >
                      {isLoadingAccept ? (
                        <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Icons.check className="w-4 h-4 mr-2" />
                      )}
                      <span>Accept</span>
                    </Button>
                    <Button
                      onClick={() => rejectFriend()}
                      className="bg-facebook-primary text-white flex-1 md:flex-none"
                      disabled={isLoadingReject}
                    >
                      {isLoadingReject ? (
                        <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Icons.close className="w-4 h-4 mr-2" />
                      )}
                      <span>Reject</span>
                    </Button>
                  </>
                )}
                {checkFriendship(currentUser, initialData) ===
                  FriendshipStatus.REQUEST_SENT && (
                  <Button className="bg-facebook-primary text-white flex-1 md:flex-none">
                    <Icons.peopleCheck className="w-5 h-5 mr-2" />
                    <span>Invitation sent</span>
                  </Button>
                )}
                <Button disabled className="flex-1 md:flex-none">
                  <Icons.message className="w-4 h-4 mr-2" />
                  <span>Send message</span>
                </Button>
                {currentUser?.role === "ADMIN" && (
                  <Button onClick={() => toggleVerified()}>
                    {initialData?.verified
                      ? "Mark as Unverified"
                      : "Mark as Verified"}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <EditProfile currentUser={currentUser} />
      <ImageModal
        setIsModalOpen={setIsOpen}
        isModalOpen={isOpen}
        imageUrl={selectedImage}
      />
    </section>
  );
}
