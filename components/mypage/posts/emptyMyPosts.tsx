"use client";

import EmptyState from "@/components/_common/emptyState";

/**
 * 작성한 게시글이 없을 때 표시되는 빈 상태 컴포넌트
 */
export default function EmptyMyPosts() {
  return (
    <EmptyState
      title="작성한 게시글이 없어요!"
      description="지금 바로 첫 번째 게시글을 작성하고\n모두의 식물에서 활동을 시작해 보세요."
      buttonText="글 쓰러 가기"
      buttonHref="/community/write"
    />
  );
}
