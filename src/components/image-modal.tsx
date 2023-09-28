"use client";

import * as React from "react";
import Image from "next/image";

import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

interface ImageModal {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen: boolean;
  imageUrl: string | null;
}

export default function ImageModal({
  setIsModalOpen,
  isModalOpen,
  imageUrl,
}: ImageModal) {
  return (
    <Modal
      images
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      className="px-0 p-0 dark:bg-black bg-white"
    >
      {isModalOpen &&
        (imageUrl ? (
          <Image
            src={imageUrl ?? "/images/placeholder.png"}
            alt="Profile image"
            width={500}
            height={500}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={cn("w-full object-contain rounded-lg")}
            loading="lazy"
          />
        ) : (
          <p>Image not available</p>
        ))}
    </Modal>
  );
}
