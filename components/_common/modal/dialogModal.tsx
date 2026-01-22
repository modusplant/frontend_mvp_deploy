import Button from "@/components/_common/button";

interface DialogModalProps {
  title: string;
  description: string;
  type: "one-button" | "two-button";
  buttonText?: string;
  onConfirm?: () => void;
  hideModal: () => void;
}

export default function DialogModal({
  title,
  description,
  type,
  buttonText,
  onConfirm,
  hideModal,
}: DialogModalProps) {
  return (
    <div
      className="bg-opacity-50 fixed inset-0 z-99 flex items-center justify-center"
      onClick={hideModal}
    >
      <div
        className="w-96 rounded-2xl bg-neutral-100 py-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-1 py-9">
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="">{description}</p>
        </div>
        <div className="flex justify-center">
          {type === "two-button" && (
            <Button
              variant="default"
              size="lg"
              onClick={hideModal}
              className="text-neutral-10 mr-4 min-w-24 rounded-md px-5 py-3"
            >
              취소
            </Button>
          )}
          <Button
            variant="point"
            size="lg"
            onClick={() => {
              onConfirm?.();
              hideModal();
            }}
            className="min-w-24 rounded-md px-5 py-3 text-neutral-100"
          >
            {buttonText || "OK"}
          </Button>
        </div>
      </div>
    </div>
  );
}
