"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "./icons";

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

  const handleChange = React.useCallback(
    (base64: string) => {
      onChange(base64);
    },
    [onChange]
  );

  const handleDrop = React.useCallback(
    (files: File[]) => {
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

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    onDrop: handleDrop,
    disabled,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
    },
  });
  return (
    <div>
      {base64 ? (
        <div
          className="w-full flex items-center justify-center"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          {isCover ? (
            <div>
              <Image
                src={base64}
                alt="Uploaded image"
                width={400}
                height={100}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded-md bg-cover object-cover aspect-[4/1.5]"
                loading="lazy"
              />
            </div>
          ) : (
            <Avatar className="w-40 h-40">
              <AvatarImage src={base64} alt="Uploaded image" />
            </Avatar>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className="group w-full rounded-md border border-border cursor-pointer"
        >
          <input {...getInputProps()} />
          <div className="grid place-items-center gap-1 sm:px-5">
            <Icons.upload
              className="h-8 w-8 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="mt-2 text-base font-medium text-foreground">
              Add Profile Image
            </p>
            <p className="text-center text-xs text-muted-foreground">
              or drag and drop here
            </p>
          </div>
        </div>
      )}
    </div>
    // <div
    //   {...getRootProps()}
    //   className="hover:brightness-50 cursor-pointer rounded-md border-border border"
    // >
    //   <input {...getInputProps()} />
    //   {base64 ? (
    //     <div className="flex items-center justify-center">
    //       {isCover ? (
    //         <div>
    //           <Image
    //             src={base64}
    //             alt="Uploaded image"
    //             width={400}
    //             height={100}
    //             className="rounded-md bg-cover aspect-[4/1.5]"
    //             loading="lazy"
    //           />
    //         </div>
    //       ) : (
    //         <Avatar className="w-40 h-40">
    //           <AvatarImage src={base64} alt="Uploaded image" />
    //         </Avatar>
    //       )}
    //     </div>
    //   ) : (
    //     <div className="text-center">
    //       <p>Upload</p>
    //     </div>
    //   )}
    // </div>
  );
}
