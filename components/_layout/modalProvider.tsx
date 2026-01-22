"use client";

import useModalStore from "@/lib/store/modalStore";
import { useSnackbarAnimation } from "../_common/modal/useSnackbarAnimation";
import SnackbarModal from "../_common/modal/snackbarModal";
import DialogModal from "../_common/modal/dialogModal";

export default function ModalProvider() {
  const isVisible = useModalStore((state) => state.isVisible);
  const type = useModalStore((state) => state.type);
  const hideModal = useModalStore((state) => state.hideModal);

  const isAnimating = useSnackbarAnimation(
    isVisible && type === "snackbar",
    hideModal
  );

  if (!isVisible) {
    return null;
  }

  const { title, description, buttonText, onConfirm } =
    useModalStore.getState();

  if (type === "snackbar") {
    return (
      <SnackbarModal description={description} isAnimating={isAnimating} />
    );
  }

  return (
    <DialogModal
      title={title || ""}
      description={description}
      type={type}
      buttonText={buttonText}
      onConfirm={onConfirm}
      hideModal={hideModal}
    />
  );
}
