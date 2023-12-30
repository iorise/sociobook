"use client";

import * as React from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export function AlertModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: AlertModalProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <Modal
      title="Are you sure?"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="w-full flex items-center  pt-6 space-x-2 justify-end">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          {loading && <Icons.spinner className="animate-spin w-4 h-4 mr-2" />}{" "}
          Continue
        </Button>
      </div>
    </Modal>
  );
}
