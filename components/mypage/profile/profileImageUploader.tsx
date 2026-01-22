"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";
import Image from "next/image";
import Profile from "@/components/_common/profileImage";

interface ProfileImageUploaderProps {
  imagePreview: string | null;
  onImageSelect: (file: File) => void;
  onImageDelete: () => void;
}

export default function ProfileImageUploader({
  imagePreview,
  onImageSelect,
  onImageDelete,
}: ProfileImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center gap-6">
      {/* 프로필 이미지 미리보기 */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-[100px] w-[100px]">
          {/* 배경 원 */}
          <div className="bg-neutral-90 absolute inset-0 rounded-full" />

          {/* 프로필 이미지 또는 기본 아이콘 */}
          <div className="inset-0 flex items-center justify-center">
            <Profile className="h-10 w-10" imageSrc={imagePreview} />
          </div>
        </div>

        {/* 이미지 삭제 버튼 */}
        {imagePreview && (
          <button
            onClick={onImageDelete}
            className="hover:text-neutral-20 text-sm leading-[1.2] font-normal tracking-[-0.01em] text-neutral-50"
          >
            이미지 삭제
          </button>
        )}
      </div>

      {/* 업로드 버튼 */}
      <button
        onClick={handleUploadClick}
        className="border-primary-40 hover:bg-primary-10 flex items-center gap-1.5 rounded-[40px] border px-[18px] py-3 transition-colors"
      >
        <Upload className="text-primary-50 h-4 w-4" />
        <span className="text-primary-50 text-sm leading-[1.2] font-medium tracking-[-0.02em]">
          프로필 사진 업로드
        </span>
      </button>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
