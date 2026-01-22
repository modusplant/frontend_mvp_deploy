interface SnackbarModalProps {
  description: string;
  isAnimating: boolean;
}

export default function SnackbarModal({
  description,
  isAnimating,
}: SnackbarModalProps) {
  return (
    <div
      className={`text-neutral-10 fixed bottom-28 left-1/2 z-99 min-w-80 -translate-x-1/2 transform rounded-2xl bg-neutral-100 px-16 py-7 text-center font-semibold shadow-lg transition-all duration-300 ${
        isAnimating ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
    >
      {description}
    </div>
  );
}
