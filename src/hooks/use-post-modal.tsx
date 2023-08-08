import { create } from "zustand";

interface UseStoreModal {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
}

export const usePostModal = create<UseStoreModal>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
}))