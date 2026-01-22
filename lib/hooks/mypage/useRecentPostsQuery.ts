"use client";

import { useQuery } from "@tanstack/react-query";
import { postApi } from "@/lib/api/client/post";
import { GetRecentPostsResponseData } from "@/lib/types/post";

/**
 * 최근에 본 게시글 목록 조회 훅
 * @param page 페이지 번호 (1부터 시작)
 * @param size 페이지 크기
 */
export function useRecentPostsQuery(page: number, size: number = 8) {
  return useQuery<GetRecentPostsResponseData>({
    queryKey: ["recentPosts", page, size],
    queryFn: async () => {
      const response = await postApi.getRecentPosts({ page, size });
      if (response.status !== 200 || !response.data) {
        throw new Error(
          response.message || "최근에 본 게시글을 불러오는데 실패했습니다."
        );
      }
      return response.data;
    },
    gcTime: 1000 * 60 * 5, // 5분
  });
}
