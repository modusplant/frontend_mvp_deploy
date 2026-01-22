"use client";

import PostCardGrid from "@/components/mypage/common/postCardGrid";
import EmptyBookmarks from "@/components/mypage/bookmarks/emptyBookmarks";
import { useBookmarkedPostsQuery } from "@/lib/hooks/mypage/useBookmarkedPostsQuery";

export default function BookmarkSection() {
  return (
    <div className="border-surface-98 flex flex-col gap-[30px] rounded-xl border bg-white p-10">
      {/* 페이지 제목 */}
      <h1 className="text-neutral-5 text-xl leading-[1.2] font-bold tracking-[-0.01em]">
        북마크
      </h1>

      {/* 게시글 카드 그리드 */}
      <PostCardGrid
        useQueryHook={useBookmarkedPostsQuery}
        emptyComponent={<EmptyBookmarks />}
        pageSize={9}
      />
    </div>
  );
}
