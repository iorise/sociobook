"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ModalProps {
  title?: string;
  description?: string;
  onClose: () => void;
  isOpen: boolean;
  className?: string;
  images?: boolean;
  arrows?: boolean;
  prevFn?: () => void;
  nextFn?: () => void;
  children?: React.ReactNode;
}

export function Modal({
  title,
  description,
  onClose,
  isOpen,
  children,
  images,
  arrows,
  prevFn,
  nextFn,
  className,
  ...props
}: ModalProps) {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange} {...props}>
      <DialogContent className={cn("px-2", className)} prevFn={prevFn} nextFn={nextFn}>
        {images ? null : (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <Separator />
          </>
        )}
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
}
