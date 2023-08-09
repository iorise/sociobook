"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import Cropper, { ReactCropperElement } from "react-cropper";

import "cropperjs/dist/cropper.css";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface ImageUploadProps {
  onChange: (base64: string) => void;
  value?: string;
  disabled?: boolean;
  isCover?: boolean;
}

export function ImageUpload({
  onChange,
  disabled,
  value,
  isCover,
}: ImageUploadProps) {
  const [base64, setBase64] = React.useState(value);
  const [cropData, setCropData] = React.useState<string | null>(null);
  const cropperRef = React.useRef<ReactCropperElement>(null);

  const handleChange = React.useCallback(
    (base64: string) => {
      onChange(base64);
    },
    [onChange]
  );

  const handleDrop = React.useCallback(
    (files: any) => {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (event: any) => {
        setBase64(event.target.result);
        handleChange(event.target.result);
      };

      reader.readAsDataURL(file);
    },
    [handleChange]
  );

  const handleCrop = () => {
    if (cropperRef.current) {
      const croppedImage = cropperRef.current.cropper.getCroppedCanvas();
      setCropData(croppedImage.toDataURL());
    }
  };

  const handleSave = () => {
    if (cropData) {
      handleChange(cropData);
      setBase64(cropData);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: handleDrop,
    disabled,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
  });
  return (
    <div {...getRootProps({ className: "w-full" })}>
      <input {...getInputProps()} />
      {base64 ? (
        <div className="flex items-center justify-center">
          {isCover ? (
            <div>
              <Image
                src={base64}
                alt="Uploaded image"
                width={400}
                height={100}
                className="rounded-md bg-contain aspect-[4/1.5]"
              />
            </div>
          ) : (
            <Avatar className="w-40 h-40">
              <AvatarImage src={base64} alt="Uploaded image" />
            </Avatar>
          )}
        </div>
      ) : (
        <div className="text-center">
          <p>Upload</p>
        </div>
      )}
    </div>
  );
}
