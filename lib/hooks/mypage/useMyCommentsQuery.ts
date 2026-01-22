import { useQuery } from "@tanstack/react-query";
import { commentApi } from "@/lib/api/client/comment";
import { GetMyCommentsResponseData } from "@/lib/types/comment";

/**
 * 내 댓글 목록 조회 훅
 * @param page 현재 페이지 (0-based)
 * @param size 페이지당 아이템 수 (기본값: 8)
 * @returns React Query 결과
 */
export default function useMyCommentsQuery(
  page: number,
  size: number = 8,
  userId?: string
) {
  return useQuery<GetMyCommentsResponseData>({
    queryKey: ["myComments", page, size, userId],
    queryFn: async () => {
      const response = await commentApi.getMyComments({
        page,
        size,
        uuid: userId,
      });
      if (!response.data) {
        throw new Error("내 댓글 목록을 불러오는데 실패했습니다.");
      }
      return response.data;
    },
    enabled: !!userId,
  });
}
