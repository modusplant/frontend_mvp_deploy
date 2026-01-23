"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Badge from "@/components/_common/badge";
import { formatRelativeTime } from "@/lib/utils/formatTime";

interface PostDetailHeaderProps {
  secondaryCategory: string;
  title: string;
  nickname: string;
  publishedAt: string;
  viewCount: number;
  isUpdated?: boolean;
}

export default function PostDetailHeader({
  secondaryCategory,
  title,
  nickname,
  publishedAt,
  viewCount,
  isUpdated,
}: PostDetailHeaderProps) {
  const router = useRouter();

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

      {/* 카테고리 배지 */}
      <div>
        <Badge variant="default" size="md" className="my-4">
          {secondaryCategory}
        </Badge>
      </div>

      {/* 제목 */}
      <h1 className="text-neutral-10 mb-2 text-[28px] leading-tight font-bold">
        {title}
      </h1>

      {/* 작성자 정보 */}
      <div className="text-neutral-70 mb-8 flex items-center gap-2 text-[13px]">
        {/* 작성자 */}
        <span className="text-neutral-20 text-[15px] font-semibold">
          {nickname}
        </span>

        {/* 작성일 */}
        <span className="">{formatRelativeTime(publishedAt)}</span>
        <span>·</span>
        {/* 조회수 */}
        <span>조회 {viewCount.toLocaleString()}</span>
        {isUpdated && (
          <>
            <span>·</span>
            <span>수정됨</span>
          </>
        )}
      </div>
    </div>
  );
}
