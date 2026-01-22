import { serverApiInstance } from "@/lib/api/instances/serverInstance";
import { ApiResponse } from "@/lib/types/common";
import { ProfileData, AuthInfo } from "@/lib/types/member";

/**
 * 회원 프로필 API
 */
export const memberApi = {
  /**
   * 프로필 조회
   * GET /api/v1/members/{id}/profile
   */
  async getProfile(userId: string): Promise<ApiResponse<ProfileData>> {
    return serverApiInstance<ProfileData>(`/api/v1/members/${userId}/profile`, {
      method: "GET",
    });
  },
};
