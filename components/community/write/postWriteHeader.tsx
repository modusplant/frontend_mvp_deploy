"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";

interface PostWriteHeaderProps {
  isEditMode: boolean;
}

export default function PostWriteHeader({ isEditMode }: PostWriteHeaderProps) {
  const router = useRouter();
  const { user } = useAuthStore();

  return (
    <div>
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => router.back()}
        className="border-neutral-90 hover:bg-surface-98 mb-4 rounded-full border p-2 transition-colors"
        aria-label="뒤로가기"
      >
        <ArrowLeft className="h-4 w-4 text-neutral-50" />
      </button>

      {/* 제목 및 닉네임 */}
      <div className="flex flex-col gap-2.5">
        <h1 className="text-neutral-0 text-[28px] leading-[1.2] font-bold tracking-[-0.01em]">
          {isEditMode ? "게시글 수정" : "게시글 쓰기"}
        </h1>
        <p className="text-neutral-60 text-base leading-normal font-normal tracking-[-0.01em]">
          {user?.nickname || "사용자"}
        </p>
      </div>
    </div>
  );
}
