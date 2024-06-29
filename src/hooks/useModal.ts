import { create } from "zustand";
import { Server } from "@prisma/client";

export type ModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "serverMembers"
  | "createChannel";

interface ModalData {
  server?: Server;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean; // Indicates whether the Card modal is open or not
  onOpen: (type: ModalType, data?: ModalData) => void; // Function to open the modal
  onClose: () => void; // Function to close the modal
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
