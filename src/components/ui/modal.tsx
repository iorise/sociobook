"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface ModalProps {
  title: string;
  description?: string;
  onClose: () => void;
  isOpen: boolean;
  children?: React.ReactNode;
}

export function Modal({
  title,
  description,
  onClose,
  isOpen,
  children,
  ...props
}: ModalProps) {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange} {...props}>
      <DialogContent className="px-2">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
          <Separator />
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
}
