interface ErrorStateProps {
  message?: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="flex h-64 items-center justify-center text-center">
      <div>
        <p className="text-base font-medium text-red-500 md:text-lg">
          게시글을 불러오는데 실패했습니다
        </p>
        <p className="text-neutral-90 mt-1 text-xs md:mt-2 md:text-sm">
          {message || "잠시 후 다시 시도해주세요"}
        </p>
      </div>
    </div>
  );
}
