"use client";

import PostCardGrid from "@/components/mypage/common/postCardGrid";
import EmptyLikes from "@/components/mypage/likes/emptyLikes";
import { useLikedPostsQuery } from "@/lib/hooks/mypage/useLikedPostsQuery";

export default function LikeSection() {
  return (
    <div className="border-surface-98 flex flex-col gap-[30px] rounded-xl border bg-white p-10">
      {/* 페이지 제목 */}
      <h1 className="text-neutral-5 text-xl leading-[1.2] font-bold tracking-[-0.01em]">
        좋아요
      </h1>

      {/* 게시글 카드 그리드 */}
      <PostCardGrid
        useQueryHook={useLikedPostsQuery}
        emptyComponent={<EmptyLikes />}
        pageSize={9}
      />
    </div>
  );
}
