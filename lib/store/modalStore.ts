import { create } from "zustand";

export interface ModalStore {
  isVisible: boolean;
  title?: string;
  description: string;
  type: "one-button" | "two-button" | "snackbar";
  buttonText?: string;
  onConfirm?: () => void;
  showModal: (
    modalData: Omit<ModalStore, "isVisible" | "showModal" | "hideModal">
  ) => void;
  hideModal: () => void;
}

const useModalStore = create<ModalStore>((set) => ({
  isVisible: false,
  title: "",
  description: "",
  type: "one-button",
  buttonText: undefined,
  onConfirm: undefined,

  showModal: (
    modalData: Omit<ModalStore, "isVisible" | "showModal" | "hideModal">
  ) => {
    set(() => ({
      isVisible: true,
      ...modalData,
    }));
  },

  hideModal: () => {
    set(() => ({
      isVisible: false,
      title: "",
      description: "",
      type: "one-button",
      buttonText: undefined,
      onConfirm: undefined,
    }));
  },
}));

export default useModalStore;

export const showModal = (
  modalData: Omit<ModalStore, "isVisible" | "showModal" | "hideModal">
) => useModalStore.getState().showModal(modalData);
