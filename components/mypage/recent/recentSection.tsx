import RecentPostList from "./recentPostList";

/**
 * 최근에 본 글 섹션 컴포넌트
 */
export default function RecentSection() {
  return (
    <div className="border-surface-98 flex flex-col gap-[30px] rounded-xl border bg-white p-10">
      {/* 페이지 제목 */}
      <h1 className="text-neutral-5 text-xl leading-[1.2] font-bold tracking-[-0.01em]">
        최근에 본 글
      </h1>

      {/* 게시글 리스트 */}
      <RecentPostList />
    </div>
  );
}
