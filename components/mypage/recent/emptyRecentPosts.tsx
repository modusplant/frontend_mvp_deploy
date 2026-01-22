"use client";

import EmptyState from "@/components/_common/emptyState";

/**
 * 최근에 본 게시글이 없을 때 표시되는 빈 상태 컴포넌트
 */
export default function EmptyRecentPosts() {
  return (
    <EmptyState
      title="최근 본 식물 기록이 없어요!"
      description="초록빛 가득한 이야기들을 탐색하고\n나만의 식물 아카이브를 채워보세요."
      buttonText="둘러보기"
      buttonHref="/"
    />
  );
}
