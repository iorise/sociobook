"use client";

import { useGetImage } from "@/hooks/use-get-image";
import Image from "next/image";
import * as React from "react";

interface PostCommentProps {
  postId: string;
}

export function ImageList({ postId }: PostCommentProps) {
  const { data: image, isLoading } = useGetImage(postId);
  if (!image || image.length === 0) {
    return null;
  }
  return (
    <div className="grid grid-rows-2 grid-cols-2 aspect-square">
      {image.map((image, index) => (
        <Image
          key={index}
          src={image.url}
          alt={`image ${index}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          width={300}
          height={300}
          className="object-cover w-full aspect-square object-center"
          loading="lazy"
        />
      ))}
    </div>
  );
}
