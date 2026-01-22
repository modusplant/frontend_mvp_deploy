"use client";

import { useState, ReactNode } from "react";
import PostListItem from "./postListItem";
import Pagination from "./pagination";
import { PostData } from "@/lib/types/post";
import { dummyPosts } from "@/lib/data/posts";

interface PostListProps<T> {
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
   * @default 8
   */
  pageSize?: number;
}

/**
 * 게시글 리스트 공통 컴포넌트
 * - 로딩/에러/빈 상태 처리
 * - 게시글 리스트 렌더링
 * - 페이지네이션
 */
export default function PostList<
  T extends {
    posts: PostData[];
    totalPages: number;
  },
>({ useQueryHook, emptyComponent, pageSize = 8 }: PostListProps<T>) {
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

  // 더미 데이터(개발용)
  // const data = {
  //   posts: dummyPosts,
  //   totalPages: 10,
  // };

  return (
    <div className="flex flex-col gap-[30px]">
      {/* 게시글 리스트 */}
      <div className="flex flex-col gap-6">
        {data.posts.map((post, index) => (
          <div key={post.postId}>
            <PostListItem post={post} />
            {/* 마지막 아이템이 아니면 구분선 추가 */}
            {index < data.posts.length - 1 && (
              <div className="mt-6 h-px w-full bg-[#EFEFEF]" />
            )}
          </div>
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
