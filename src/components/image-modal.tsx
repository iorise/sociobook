"use client";

import * as React from "react";
import Image from "next/image";

import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

interface ImageModal {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen: boolean;
  imageUrl: string | null | undefined;
}

const shadowImages = {
  boxShadow: "0px 1px 212px -49px rgba(35, 145, 247, 1)",
  WebkitBoxShadow: "0px 1px 212px -49px rgba(35, 145, 247, 1)",
  MozBoxShadow: "0px 1px 212px -49px rgba(35, 145, 247, 1)",
};

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
      className="w-[80%] h-[80%] max-h-[80%] max-w-[80%] bg-transparent border-none justify-center items-center shadow-none"
    >
      {isModalOpen && (
        <Image
          src={imageUrl ?? ""}
          alt={`${imageUrl}`}
          width={500}
          height={500}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={cn(
            shadowImages,
            "object-contain rounded-2xl border-4 border-border aspect-square "
          )}
          loading="lazy"
        />
      )}
    </Modal>
  );
}
