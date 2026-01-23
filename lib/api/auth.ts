import { apiClient, removeAccessToken } from "./client";
import { ApiResponse } from "@/lib/types/common";
import {
  LoginRequest,
  LoginResponseData,
  User,
  UserAuthInfoResponseData,
  SignupRequest,
  EmailVerificationResponseData,
  NicknameCheckResponseData,
} from "@/lib/types/auth";
import { decodeJWT } from "@/lib/utils/auth";

/**
 * 인증 API
 */
export const authApi = {
  /**
   * 로그인
   */
  async login(
    data: LoginRequest
  ): Promise<ApiResponse<LoginResponseData> & { user?: User }> {
    const response = await apiClient<LoginResponseData>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
      skipAuth: true, // 로그인은 인증 불필요
    });

    // JWT에서 사용자 정보 추출
    if (response.data?.accessToken) {
      const decoded = decodeJWT(response.data.accessToken);
      if (decoded) {
        (response as any).user = {
          id: decoded.sub,
          email: data.email,
          nickname: decoded.nickname,
          roles: decoded.roles,
        };
      }
    }

    return response;
  },

  /**
   * 로그아웃
   */
  async logout(): Promise<void> {
    removeAccessToken();
    // TODO: 필요시 서버에 로그아웃 요청 추가
    // await apiClient('/api/auth/logout', { method: 'POST' });
  },

  /**
   * 회원가입
   */
  async signup(data: SignupRequest): Promise<ApiResponse<void>> {
    return apiClient<void>("/api/members/register", {
      method: "POST",
      body: JSON.stringify(data),
      skipAuth: true,
    });
  },

  /**
   * 이메일 인증 요청
   */
  async requestEmailVerification(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient<void>("/api/members/verify-email/send", {
        method: "POST",
        body: JSON.stringify({ email }),
        skipAuth: true,
      });

      return {
        success: response.status === 200,
        message:
          response.status === 200
            ? "인증 메일이 발송되었습니다."
            : response.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "인증 메일 발송에 실패했습니다.",
      };
    }
  },

  /**
   * 이메일 인증 확인
   */
  async verifyEmailCode(
    email: string,
    code: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient<EmailVerificationResponseData>(
        "/api/members/verify-email",
        {
          method: "POST",
          body: JSON.stringify({
            email,
            verifyCode: code,
          }),
          skipAuth: true,
        }
      );

      const isVerified = response.data?.hasEmailAuth === true;
      return {
        success: isVerified,
        message: isVerified
          ? "이메일 인증이 완료되었습니다."
          : "인증에 실패했습니다.",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "인증 코드 확인에 실패했습니다.",
      };
    }
  },

  /**
   * 닉네임 중복 확인
   */
  async checkNickname(
    nickname: string
  ): Promise<{ success: boolean; available: boolean; message: string }> {
    try {
      const response = await apiClient<NicknameCheckResponseData>(
        `/api/v1/members/check/nickname/${encodeURIComponent(nickname)}`,
        {
          method: "GET",
          skipAuth: true,
        }
      );

      const isExisted = response.data?.isNicknameExisted === true;
      return {
        success: true,
        available: !isExisted,
        message: isExisted
          ? "이미 사용중인 닉네임입니다."
          : "사용 가능한 닉네임입니다.",
      };
    } catch (error: any) {
      return {
        success: false,
        available: false,
        message: error.message || "닉네임 확인에 실패했습니다.",
      };
    }
  },

  /**
   * 현재 사용자 인증 정보 조회
   */
  async getCurrentUser(
    userId: string
  ): Promise<ApiResponse<UserAuthInfoResponseData>> {
    return apiClient<UserAuthInfoResponseData>(
      `/api/v1/members/${userId}/auth-info`,
      {
        method: "POST",
      }
    );
  },
};
