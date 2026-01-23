"use client";

import { Image as ImageIcon } from "lucide-react";
import useImageUpload from "@/lib/hooks/community/useImageUpload";
import ImagePreviewItem from "./imagePreviewItem";
import ImageDropZone from "./imageDropZone";

interface ImageUploaderProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
  maxSizeInMB?: number;
}

export default function ImageUploader({
  images,
  onImagesChange,
  maxImages = 10,
  maxSizeInMB = 10,
}: ImageUploaderProps) {
  const {
    fileInputRef,
    isDragging,
    handleFileSelect,
    handleRemoveImage,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useImageUpload({ maxImages, maxSizeInMB, onImagesChange, images });

  return (
    <div className="w-full">
      {/* 이미지 업로드 버튼 */}
      <div className="flex items-center gap-1 rounded-[40px] px-3 py-2.25">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-neutral-20 flex items-center gap-1 text-[15px] leading-normal font-medium tracking-[-0.01em]"
        >
          <ImageIcon className="h-4.5 w-4.5" />
          사진
        </button>
      </div>

      {/* 이미지 미리보기 스크롤 */}
      {images.length > 0 && (
        <div
          className={`mt-4 overflow-x-auto rounded-lg pb-2 ${
            isDragging
              ? "border-primary-50 bg-primary-10"
              : "border-surface-stroke"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex min-w-min gap-3 px-2 py-2">
            {images.map((image, index) => (
              <ImagePreviewItem
                key={index}
                file={image}
                index={index}
                onRemove={handleRemoveImage}
              />
            ))}
          </div>
        </div>
      )}

      {/* 드래그 앤 드롭 안내 */}
      {images.length === 0 && (
        <ImageDropZone
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />
      )}
    </div>
  );
}
