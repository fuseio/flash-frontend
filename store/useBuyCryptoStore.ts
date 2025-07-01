import { create } from "zustand";

interface BuyCryptoModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useBuyCryptoStore = create<BuyCryptoModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
