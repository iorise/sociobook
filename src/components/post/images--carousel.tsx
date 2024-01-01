"use client";

import { Image as ImageType } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { Icons } from "../icons";

interface ImagesCarouselProps {
  images: ImageType[] | undefined;
}

export function ImagesCarousel({ images }: ImagesCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  if (!images) {
    return null;
  }

  const handleNextClick = () => {
    const nextIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(nextIndex);
  };

  const handlePrevClick = () => {
    const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(prevIndex);
  };

  return (
    <div className="container w-full max-h-[calc(100vh_-_3.5rem)]">
      <div className="flex justify-betweeen items-center">
        <Icons.arrowLeft className="w-8 h-8" onClick={handlePrevClick} />
        <div className="w-full h-[calc(100vh_-_3.5rem)] relative">
          <Image
            src={images[currentImageIndex].url}
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <Icons.arrowRight className="w-8 h-8" onClick={handleNextClick} />
      </div>
    </div>
  );
}
