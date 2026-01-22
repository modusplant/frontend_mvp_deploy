import { X } from "lucide-react";
import Image from "next/image";

interface ImagePreviewItemProps {
  file: File;
  index: number;
  onRemove: (index: number) => void;
}

export default function ImagePreviewItem({
  file,
  index,
  onRemove,
}: ImagePreviewItemProps) {
  // 이미지 미리보기 URL 생성
  const previewUrl = URL.createObjectURL(file);

  return (
    <div className="group relative h-[200px] w-[200px] shrink-0">
      <Image
        src={previewUrl}
        alt={`업로드 이미지 ${index + 1}`}
        fill
        className="rounded-lg object-cover"
      />
      {/* 삭제 버튼 */}
      <button
        onClick={() => onRemove(index)}
        className="bg-neutral-70 absolute -top-2 -right-2 z-10 rounded-full p-1"
        aria-label="이미지 삭제"
      >
        <X className="h-4 w-4 text-white" />
      </button>
    </div>
  );
}
