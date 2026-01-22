import { showModal } from "@/lib/store/modalStore";
import { useRef, useState } from "react";

interface UseImageUploadProps {
  maxImages?: number;
  maxSizeInMB?: number;
  onImagesChange: (images: File[]) => void;
  images: File[];
}

export default function useImageUpload({
  maxImages = 10,
  maxSizeInMB = 10,
  onImagesChange,
  images,
}: UseImageUploadProps) {
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
        showModal({
          type: "snackbar",
          description:
            "지원하지 않는 파일 형식입니다. jpeg, png, jpg 파일만 업로드 가능합니다.",
        });
        return;
      }

      // 용량 검증
      if (file.size > maxSizeInBytes) {
        showModal({
          type: "snackbar",
          description: "10MB 이하의 이미지를 등록해주세요.",
        });
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
      showModal({
        type: "snackbar",
        description: `최대 ${maxImages}장 등록 가능합니다. 선택된 사진을 삭제 후 재시도 해주세요.`,
      });
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
      showModal({
        type: "snackbar",
        description: `최대 ${maxImages}장 등록 가능합니다. 선택된 사진을 삭제 후 재시도 해주세요.`,
      });
      return;
    }

    onImagesChange([...images, ...validFiles]);
  };

  return {
    fileInputRef,
    isDragging,
    handleFileSelect,
    handleRemoveImage,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
