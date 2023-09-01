"use client";

import * as React from "react";
import Image from "next/image";

import { Modal } from "@/components/ui/modal";

interface ImageModal {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen: boolean;
  imageUrl: string | null | undefined;
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
      className="w-[80%] h-[80%] max-w-[80%] bg-transparent border-none justify-center items-center shadow-none"
    >
      {isModalOpen && (
        <Image
          src={imageUrl ?? ""}
          alt={`${imageUrl}`}
          width={600}
          height={600}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain rounded-2xl shadow-images border-4 border-border "
          loading="lazy"
        />
      )}
    </Modal>
  );
}
