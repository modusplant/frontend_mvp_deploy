"use client";

interface PostWriteActionsProps {
  isSubmitting: boolean;
  isFormValid: boolean;
  onSubmit: () => void;
  isEditMode: boolean;
}

export default function PostWriteActions({
  isSubmitting,
  isFormValid,
  onSubmit,
  isEditMode,
}: PostWriteActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2.5">
      <button
        onClick={onSubmit}
        disabled={!isFormValid || isSubmitting}
        className={`flex h-10 items-center gap-25 rounded-[7px] px-5 py-3.5 text-[15px] leading-[1.2] font-medium tracking-[-0.01em] transition-colors ${
          isFormValid && !isSubmitting
            ? "bg-primary-50 hover:bg-primary-70 text-white"
            : "bg-neutral-90 cursor-not-allowed text-white"
        }`}
      >
        {isSubmitting
          ? isEditMode
            ? "수정 중..."
            : "등록 중..."
          : isEditMode
            ? "수정하기"
            : "등록하기"}
      </button>
    </div>
  );
}
