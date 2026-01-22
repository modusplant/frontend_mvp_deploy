"use client";

import { useQuery } from "@tanstack/react-query";
import { postApi } from "@/lib/api/client/post";
import { GetMyPostsResponseData } from "@/lib/types/post";

/**
 * 내가 북마크한 게시글 목록 조회 커스텀 훅
 *
 * @param page 페이지 번호 (1부터 시작)
 * @param size 페이지당 아이템 개수 (기본값: 9)
 * @returns React Query 결과
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useBookmarkedPostsQuery(1, 9);
 * ```
 */
export function useBookmarkedPostsQuery(page: number = 1, size: number = 9) {
  return useQuery<GetMyPostsResponseData | undefined>({
    queryKey: ["bookmarkedPosts", page, size],
    queryFn: async () => {
      const response = await postApi.getBookmarkedPosts({ page, size });

      if (response.status !== 200) {
        throw new Error(
          response.message || "북마크한 게시글 조회에 실패했습니다."
        );
      }

      return response.data;
    },
    retry: 1,
  });
}
