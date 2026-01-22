import { useQuery } from "@tanstack/react-query";
import { memberApi } from "@/lib/api/client/member";
import { AuthInfo } from "@/lib/types/member";

/**
 * 회원 인증 정보 조회 훅
 */
export function useMemberAuthInfo(userId: string | undefined) {
  return useQuery<AuthInfo | undefined>({
    queryKey: ["member", "authInfo", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("사용자 ID가 필요합니다.");
      }
      const response = await memberApi.getAuthInfo(userId);
      return response.data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 60, // 1시간 fresh 상태 유지
  });
}
