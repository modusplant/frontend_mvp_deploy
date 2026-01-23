"use client";

import { useRef, useState } from "react";
import { Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // 파일 검증
  const validateFiles = (files: FileList | null): File[] => {
    if (!files) return [];

    const validFiles: File[] = [];
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    Array.from(files).forEach((file) => {
      // 확장자 검증
      const validExtensions = ["image/jpeg", "image/png", "image/jpg"];
      if (!validExtensions.includes(file.type)) {
        window.alert(
          "지원하지 않는 파일 형식입니다. jpeg, png, jpg 파일만 업로드 가능합니다."
        );
        return;
      }

      // 용량 검증
      if (file.size > maxSizeInBytes) {
        window.alert("10MB 이하의 이미지를 등록해주세요.");
        return;
      }

      validFiles.push(file);
    });

    return validFiles;
  };

  // 파일 선택 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const validFiles = validateFiles(files);

    if (images.length + validFiles.length > maxImages) {
      window.alert(
        `최대 ${maxImages}장 등록 가능합니다. 선택된 사진을 삭제 후 재시도 해주세요.`
      );
      return;
    }

    onImagesChange([...images, ...validFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 이미지 삭제
  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  // 드래그 앤 드롭
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    const validFiles = validateFiles(files);

    if (images.length + validFiles.length > maxImages) {
      window.alert(
        `최대 ${maxImages}장 등록 가능합니다. 선택된 사진을 삭제 후 재시도 해주세요.`
      );
      return;
    }

    onImagesChange([...images, ...validFiles]);
  };

  // 이미지 미리보기 URL 생성
  const getPreviewUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

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

      {/* 이미지 미리보기 그리드 */}
      {images.length > 0 && (
        <div
          className={`mt-4 grid w-full grid-cols-5 gap-3 rounded-lg ${
            isDragging
              ? "border-primary-50 bg-primary-10"
              : "border-surface-stroke"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {images.map((image, index) => (
            <div key={index} className="group relative aspect-square">
              <Image
                src={getPreviewUrl(image)}
                alt={`업로드 이미지 ${index + 1}`}
                fill
                className="rounded-lg object-cover"
              />
              {/* 삭제 버튼 */}
              <button
                onClick={() => handleRemoveImage(index)}
                className="bg-neutral-70 absolute -top-2 -right-2 rounded-full p-1"
                aria-label="이미지 삭제"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 드래그 앤 드롭 안내 */}
      {images.length === 0 && (
        <div
          className={`mt-4 flex min-h-[120px] items-center justify-center rounded-lg border-2 border-dashed ${
            isDragging
              ? "border-primary-50 bg-primary-10"
              : "border-surface-stroke"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p className="text-neutral-60 text-sm">
            이미지를 드래그하여 업로드하거나 버튼을 클릭하세요
          </p>
        </div>
      )}
    </div>
  );
}
