"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ImageModalProps {
  imageData: string; // base64 이미지 데이터
  onClose: () => void;
}

export default function ImageModal({ imageData, onClose }: ImageModalProps) {
  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // body 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
        aria-label="닫기"
      >
        <X className="h-6 w-6" />
      </button>

      {/* 이미지 */}
      <div
        className="relative max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={`data:image/png;base64,${imageData}`}
          alt="확대된 이미지"
          width={1920}
          height={1080}
          className="h-auto max-h-[90vh] w-auto max-w-[90vw] object-contain"
          priority
        />
      </div>
    </div>
  );
}
