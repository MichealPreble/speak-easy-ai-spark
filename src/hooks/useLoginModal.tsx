
import { create } from "zustand";

interface LoginModalStore {
  isOpen: boolean;
  defaultTab: "signin" | "signup";
  open: (tab?: "signin" | "signup") => void;
  close: () => void;
}

export const useLoginModal = create<LoginModalStore>((set) => ({
  isOpen: false,
  defaultTab: "signin",
  open: (tab = "signin") => set({ isOpen: true, defaultTab: tab }),
  close: () => set({ isOpen: false }),
}));
