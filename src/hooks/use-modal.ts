import { create } from "zustand";

interface UseStoreModal {
  isOpen: boolean;
  type: "post" | null;
  onOpen: () => void;
  onClose: () => void;
}

export const useModal = create<UseStoreModal>((set) => ({
  type: null,
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
