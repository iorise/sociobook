"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Image as imageType } from "@prisma/client";
import Image from "next/image";

import { Icons } from "@/components/icons";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
  imageData: imageType;
  imagesPreview: imageType[];
  imagesLength: number;
  i: number;
}

const shadowImages = {
  boxShadow: "0px 1px 212px -49px rgba(35, 145, 247, 1)",
  WebkitBoxShadow: "0px 1px 212px -49px rgba(35, 145, 247, 1)",
  MozBoxShadow: "0px 1px 212px -49px rgba(35, 145, 247, 1)",
};

const variants = {
  hidden: { opacity: 0, scale: 0.9 },
  open: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
    },
  },
  out: {
    scale: 0.9,
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

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

  React.useEffect(() => {
    const image = imagesPreview[selectedIndex];
    setSelectedImage(image);
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
      <Image
        src={imageData?.url || ""}
        alt={`image ${i}`}
        width={300}
        height={300}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={cn(
          "aspect-square object-cover object-center w-full h-full cursor-pointer",
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
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          className="w-[80%] h-[80%] max-w-[80%] bg-transparent border-none justify-center items-center shadow-none"
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

          {isModalOpen && (
            <motion.div
              key={selectedImage?.url}
              variants={variants}
              initial="hidden"
              animate="open"
              exit="out"
            >
              <div className="bg-accent rounded-md w-full">
                <Image
                  src={selectedImage?.url || ""}
                  alt={`image ${i}`}
                  width={500}
                  height={500}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={cn(
                    shadowImages,
                    "object-contain border-border aspect-square"
                  )}
                  loading="lazy"
                />
              </div>
            </motion.div>
          )}

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
