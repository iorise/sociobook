"use client";

import * as React from "react";
import NextImage from "next/image";

import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

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
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const image = new Image();
    image.src = imageUrl as string;
    image.onload = () => {
      setIsLoading(false);
    };
  }, [imageUrl]);

  return (
    <Modal
      images
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      className="px-0 p-0 bg-black"
    >
      {isModalOpen && (
        <div className="aspect-square">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Icons.spinner className="w-6 h-6 text-facebook-primary animate-spin" />
            </div>
          ) : (
            <NextImage
              src={imageUrl ?? ""}
              alt={imageUrl ?? ""}
              width={500}
              height={500}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={cn("w-full object-contain rounded-lg")}
              loading="lazy"
            />
          )}
        </div>
      )}
    </Modal>
  );
}
