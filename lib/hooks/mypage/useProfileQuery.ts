import { useQuery } from "@tanstack/react-query";
import { memberApi } from "@/lib/api/client/member";
import { ProfileData } from "@/lib/types/member";
import { ApiResponse } from "@/lib/types/common";

/**
 * 프로필 조회 React Query 훅
 *
 * @param userId - 사용자 ID (UUID)
 * @returns useQuery 결과 객체
 */
export function useProfileQuery(userId: string | null) {
  return useQuery<ApiResponse<ProfileData>, Error>({
    queryKey: ["profile", userId],
    queryFn: () => {
      if (!userId) {
        throw new Error("사용자 ID가 필요합니다.");
      }
      return memberApi.getProfile(userId);
    },
    enabled: !!userId, // userId가 있을 때만 쿼리 실행
    staleTime: 1000 * 60 * 60, // 1시간
    retry: 1,
  });
}
