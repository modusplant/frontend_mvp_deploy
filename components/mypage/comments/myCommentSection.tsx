"use client";

import MyCommentList from "@/components/mypage/comments/myCommentList";

export default function MyCommentSection() {
  return (
    <div className="border-surface-98 flex flex-col gap-[30px] rounded-xl border bg-white p-10">
      {/* 페이지 제목 */}
      <h1 className="text-neutral-5 text-xl leading-[1.2] font-bold tracking-[-0.01em]">
        내 댓글
      </h1>

      {/* 댓글 목록 */}
      <MyCommentList />
    </div>
  );
}
