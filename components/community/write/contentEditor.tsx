"use client";

import ImageUploader from "./imageUploader";

interface ContentEditorProps {
  textContent: string;
  images: File[];
  onTextChange: (text: string) => void;
  onImagesChange: (images: File[]) => void;
}

export default function ContentEditor({
  textContent,
  images,
  onTextChange,
  onImagesChange,
}: ContentEditorProps) {
  return (
    <div className="border-surface-stroke flex w-3xl flex-col self-stretch rounded-[10px] border">
      {/* 본문 입력 영역 */}
      <div className="flex flex-1 flex-col gap-2.5 self-stretch p-5">
        <textarea
          value={textContent}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="내용을 입력해주세요."
          className="text-neutral-20 placeholder:text-neutral-60 h-full min-h-[300px] resize-none text-base leading-[1.8] font-normal tracking-[-0.01em] focus:outline-none"
        />
      </div>
      {/* 이미지 업로드 섹션 */}
      <div className="border-surface-stroke flex items-center justify-between gap-68 self-stretch border-t px-4 py-3.5">
        <ImageUploader images={images} onImagesChange={onImagesChange} />
      </div>
    </div>
  );
}
