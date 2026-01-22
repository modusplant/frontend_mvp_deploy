import { clientApiInstance } from "@/lib/api/instances/clientInstance";
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
    return clientApiInstance<ProfileData>(`/api/v1/members/${userId}/profile`, {
      method: "GET",
    });
  },

  /**
   * 프로필 수정 (덮어쓰기)
   * PUT /api/v1/members/{id}/profile
   * Content-Type: multipart/form-data
   */
  async updateProfile(
    userId: string,
    formData: FormData
  ): Promise<ApiResponse<ProfileData>> {
    return clientApiInstance<ProfileData>(`/api/v1/members/${userId}/profile`, {
      method: "PUT",
      body: formData,
      // FormData는 자동으로 Content-Type 설정됨
      headers: {
        // Content-Type을 명시하지 않으면 브라우저가 자동으로 multipart/form-data로 설정
      },
    });
  },

  /**
   * 회원 인증 정보 조회
   * POST /api/v1/members/{id}/auth-info
   */
  async getAuthInfo(userId: string): Promise<ApiResponse<AuthInfo>> {
    return clientApiInstance<AuthInfo>(`/api/v1/members/${userId}/auth-info`, {
      method: "GET",
    });
  },

  /**
   * 이메일 변경
   * POST /api/v1/members/{id}/modify/email
   */
  async changeEmail(
    userId: string,
    currentEmail: string,
    newEmail: string
  ): Promise<ApiResponse<void>> {
    return clientApiInstance<void>(`/api/v1/members/${userId}/modify/email`, {
      method: "POST",
      body: JSON.stringify({
        currentEmail,
        newEmail,
      }),
    });
  },
};
