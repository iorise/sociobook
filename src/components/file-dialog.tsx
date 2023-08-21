import * as React from "react";
import type { FileWithPreview } from "@/types";
import {
  useDropzone,
  type Accept,
  type FileRejection,
  type FileWithPath,
} from "react-dropzone";
import type {
  FieldPath,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form";
import { toast } from "react-hot-toast";

import { cn, formatBytes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { ImageCropper } from "@/components/ui/image-cropper";

// FIXME Your proposed upload exceeds the maximum allowed size, this should trigger toast.error too

interface FileDialogProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends React.HTMLAttributes<HTMLDivElement> {
  name: TName;
  setValue: UseFormSetValue<TFieldValues>;
  accept?: Accept;
  maxSize?: number;
  maxFiles?: number;
  files: FileWithPreview[] | null;
  setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[] | null>>;
  isUploading?: boolean;
  disabled?: boolean;
}

export function FileDialog<TFieldValues extends FieldValues>({
  name,
  setValue,
  accept = {
    "image/*": [],
  },
  maxSize = 1024 * 1024 * 2,
  maxFiles = 1,
  files,
  setFiles,
  isUploading = false,
  disabled = false,
  className,
  ...props
}: FileDialogProps<TFieldValues>) {
  const onDrop = React.useCallback(
    (acceptedFiles: FileWithPath[], rejectedFiles: FileRejection[]) => {
      acceptedFiles.forEach((file) => {
        const fileWithPreview = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
        setFiles((prev) => [...(prev ?? []), fileWithPreview]);
      });

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ errors }) => {
          if (errors[0]?.code === "file-too-large") {
            toast.error(
              `File is too large. Max size is ${formatBytes(maxSize)}`,
              {
                position: "bottom-center",
              }
            );
            return;
          }
          errors[0]?.message &&
            toast.error(errors[0].message, {
              position: "bottom-center",
            });
        });
      }
    },

    [maxSize, setFiles]
  );

  // Register files to react-hook-form
  React.useEffect(() => {
    setValue(name, files as PathValue<TFieldValues, Path<TFieldValues>>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
    multiple: maxFiles > 1,
    disabled,
  });

  // Revoke preview url when component unmounts
  React.useEffect(() => {
    return () => {
      if (!files) return;
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showDropImage, setShowDropImage] = React.useState(false);

  return (
    <div className="">
      {showDropImage && (
        <div className="w-full">
          {files?.length ? (
            <div className="w-full items-center justify-center flex flex-col">
              <div
                className={cn(
                  "w-[70%] grid grid-cols-2 gap-1",
                  files.length === 1 && "grid-cols-1"
                )}
              >
                {files?.map((file, i) => (
                  <ImageCropper
                    key={i}
                    i={i}
                    files={files}
                    setFiles={setFiles}
                    file={file}
                  />
                ))}
              </div>
              <div className="flex gap-2 items-center justify-center mt-2.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  onClick={() => setFiles(null)}
                >
                  <Icons.trash className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Remove all</span>
                </Button>
                <Button
                  type="button"
                  {...getRootProps()}
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                >
                  <input {...getInputProps()} />
                  <Icons.plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={cn(
                "group relative grid h-48 w-full cursor-pointer place-items-center rounded-lg border-2 border-muted-foreground/25 py-2.5 text-center transition hover:bg-accent",
                "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isDragActive && "border-muted-foreground/50",
                disabled && "pointer-events-none opacity-60",
                className
              )}
              {...props}
            >
              <input {...getInputProps()} />
              {isUploading ? (
                <div className="group grid w-full place-items-center gap-1 sm:px-10">
                  <Icons.upload
                    className="h-9 w-9 animate-pulse text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
              ) : isDragActive ? (
                <div className="grid place-items-center gap-2 text-muted-foreground sm:px-5">
                  <Icons.upload
                    className={cn("h-8 w-8", isDragActive && "animate-bounce")}
                    aria-hidden="true"
                  />
                  <p className="text-base font-medium">Drop the file here</p>
                </div>
              ) : (
                <div className="grid place-items-center gap-1 sm:px-5">
                  <Icons.upload
                    className="h-8 w-8 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <p className="mt-2 text-base font-medium text-foreground">
                    Add Photo/video
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">
                    Please upload file with size less than{" "}
                    {formatBytes(maxSize)}
                  </p>
                  <p className="text-center text-xs text-muted-foreground">
                    You can upload up to {maxFiles}{" "}
                    {maxFiles === 1 ? "file" : "files"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <div className="w-full mt-2.5 p-2 py-1.5 flex items-center justify-center gap-2 border-border border-2 rounded-md">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="active:bg-black/70 rounded-full"
          disabled={disabled}
          onClick={() => setShowDropImage(!showDropImage)}
        >
          <Icons.fileImage className="w-6 h-6" />
          <span className="sr-only">Upload Images</span>
        </Button>
        <Button disabled variant="ghost" size="icon">
          <Icons.peopleTag className="w-6 h-6" />
        </Button>
        <Button disabled variant="ghost" size="icon">
          <Icons.emoji className="w-6 h-6" />
        </Button>
        <Button disabled variant="ghost" size="icon">
          <Icons.location className="w-6 h-6" />
        </Button>
        <Button disabled variant="ghost" size="icon">
          <Icons.gif className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
