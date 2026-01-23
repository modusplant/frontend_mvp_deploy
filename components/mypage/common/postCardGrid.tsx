"use client";

import { useState, ReactNode } from "react";
import PostCard from "@/components/_common/postCard";
import Pagination from "./pagination";
import { PostData } from "@/lib/types/post";

interface PostCardGridProps<T> {
  /**
   * React Query 훅
   */
  useQueryHook: (
    page: number,
    size: number
  ) => {
    data: T | undefined;
    isLoading: boolean;
    error: Error | null;
  };
  /**
   * 빈 상태 컴포넌트
   */
  emptyComponent: ReactNode;
  /**
   * 페이지당 아이템 개수
   * @default 9
   */
  pageSize?: number;
}

/**
 * 게시글 카드 그리드 공통 컴포넌트
 * - 로딩/에러/빈 상태 처리
 * - 카드 그리드 렌더링 (3열)
 * - 페이지네이션
 */
export default function PostCardGrid<
  T extends {
    posts: PostData[];
    totalPages: number;
  },
>({ useQueryHook, emptyComponent, pageSize = 9 }: PostCardGridProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error } = useQueryHook(currentPage, pageSize);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-neutral-40 text-base">로딩 중...</div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-system-alert text-base">
          게시글 목록을 불러오는데 실패했습니다.
        </div>
      </div>
    );
  }

  // 데이터 없음
  if (!data || data.posts.length === 0) {
    return <>{emptyComponent}</>;
  }

  // 더미데이터(개발용)
  // const data = {
  //   posts: dummyPosts,
  //   totalPages: 10,
  // };

  return (
    <div className="flex flex-col gap-[60px]">
      {/* 카드 그리드 (3열) */}
      <div className="grid grid-cols-1 gap-x-5 gap-y-[60px] md:grid-cols-2 lg:grid-cols-3">
        {data.posts.map((post) => (
          <PostCard key={post.postId} post={post} />
        ))}
      </div>

      {/* 페이지네이션 */}
      {data.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={data.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
