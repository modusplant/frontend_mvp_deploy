"use client";

import MyPostList from "@/components/mypage/posts/myPostList";

export default function MyPostSection() {
  return (
    <div className="border-surface-98 flex flex-col gap-[30px] rounded-xl border bg-white p-10">
      {/* 페이지 제목 */}
      <h1 className="text-neutral-5 text-xl leading-[1.2] font-bold tracking-[-0.01em]">
        내가 쓴 글
      </h1>

      {/* 게시글 목록 */}
      <MyPostList />
    </div>
  );
}
