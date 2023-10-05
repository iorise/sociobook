"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Image as imageType } from "@prisma/client";
import NextImage from "next/image";

import { Icons } from "@/components/icons";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { setTransition } from "@/lib/transition";

interface ImagePreviewProps {
  imageData: imageType;
  imagesPreview: imageType[];
  imagesLength: number;
  i: number;
}

export function ImagePreview({
  imageData,
  imagesPreview,
  imagesLength,
  i,
}: ImagePreviewProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [selectedImage, setSelectedImage] = React.useState<imageType | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    const image = new Image();
    image.src = imageData.url;
    image.onload = () => {
      setIsLoading(false);
      setSelectedImage(imagesPreview[selectedIndex]);
    };
  }, [selectedIndex, imagesPreview]);

  function handleSelectedImage(index: number) {
    setSelectedIndex(index);
    setIsModalOpen(true);
  }

  function handleNextImage(type: "prev" | "next") {
    setSelectedIndex((prevIndex) => {
      const nextIndex =
        type === "prev"
          ? prevIndex === 0
            ? imagesLength - 1
            : prevIndex - 1
          : prevIndex === imagesLength - 1
          ? 0
          : prevIndex + 1;

      return nextIndex;
    });
  }

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      isModalOpen
        ? event.key === "ArrowRight"
          ? handleNextImage("next")
          : event.key === "ArrowLeft"
          ? handleNextImage("prev")
          : null
        : null;
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  return (
    <>
      <NextImage
        src={imageData?.url || ""}
        alt={`image ${i}`}
        width={300}
        height={300}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={cn(
          "aspect-square object-cover object-center w-full h-full cursor-pointer rounded-md",
          imagesLength === 3 && i === 2
            ? "col-span-2 aspect-[2/1]"
            : "col-span-1"
        )}
        loading="lazy"
        onClick={() => handleSelectedImage(i)}
      />
      <AnimatePresence>
        <Modal
          images
          className="shadow-glow-md p-0 px-0 dark:bg-black bg-white"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          {imagesLength !== 1 && (
            <Button
              variant="none"
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-[99] opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              onClick={() => handleNextImage("prev")}
            >
              <Icons.arrowLeft className="w-6 h-6" />
            </Button>
          )}

          <motion.div
            key={selectedIndex}
            {...setTransition({
              opacity: 0.8,
              duration: 0.2,
            })}
            className="aspect-square flex w-full h-full items-center justify-center"
          >
            {isModalOpen && isLoading ? (
              <Icons.spinner className="w-6 h-6 text-facebook-primary animate-spin" />
            ) : (
              <NextImage
                src={selectedImage?.url || ""}
                alt={`image ${i}`}
                width={500}
                height={500}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={cn("object-contain w-full rounded-lg aspect-square")}
                loading="lazy"
              />
            )}
          </motion.div>
          {imagesLength !== 1 && (
            <Button
              variant="none"
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-[99] opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              onClick={() => handleNextImage("next")}
            >
              <Icons.arrowRight className="w-6 h-6" />
            </Button>
          )}
        </Modal>
      </AnimatePresence>
    </>
  );
}
