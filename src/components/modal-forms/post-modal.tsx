"use client";

import * as React from "react";

import { CommentInput } from "@/components/inputs/comment-input";
import { useCommentModal } from "@/hooks/use-comment-modal";
import { Modal } from "@/components/ui/modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Comment } from "@prisma/client";

interface PostModalProps {
  data: Comment[] | null;
}

export function PostModal({ data }: PostModalProps) {
  const commentModal = useCommentModal();
  return (
    <Modal
      title={`Your post`}
      isOpen={commentModal.isOpen}
      onClose={commentModal.onClose}
    >
      <div>
          <div>
            {data?.map((comment) => (
              <div key={comment.id}>
                <p>{comment.text}</p>
              </div>
            ))}
          </div>
          <CommentInput />
      </div>
    </Modal>
  );
}
