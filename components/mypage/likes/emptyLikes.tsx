"use client";

import EmptyState from "@/components/_common/emptyState";

/**
 * 좋아요한 게시글이 없을 때 표시되는 컴포넌트
 */
export default function EmptyLikes() {
  return (
    <EmptyState
      title="좋아요한 게시글이 없어요!"
      description="초록빛 가득한 이야기들을 탐색하고\n나만의 식물 아카이브를 채워보세요."
      buttonText="둘러보기"
      buttonHref="/"
    />
  );
}
