import { deleteCookie } from "@/lib/utils/cookies";
import { ApiResponse } from "@/lib/types/common";
import {
  LoginRequest,
  LoginResponseData,
  User,
  SignupRequest,
  EmailVerificationResponseData,
  NicknameCheckResponseData,
} from "@/lib/types/auth";
import { clientApiInstance } from "../instances/clientInstance";

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
    const response = await clientApiInstance<LoginResponseData>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify(data),
        skipAuth: true, // 로그인은 인증 불필요
      }
    );
    return response;
  },

  /**
   * 로그아웃
   */
  async logout(): Promise<void> {
    await deleteCookie("accessToken", {
      path: "/",
    });
    // TODO: 필요시 서버에 로그아웃 요청 추가
    // await clientApiInstance('/api/auth/logout', { method: 'POST' });
  },

  /**
   * 회원가입
   */
  async signup(data: SignupRequest): Promise<ApiResponse<void>> {
    return clientApiInstance<void>("/api/members/register", {
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
      const response = await clientApiInstance<void>(
        "/api/members/verify-email/send",
        {
          method: "POST",
          body: JSON.stringify({ email }),
          skipAuth: true,
        }
      );

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
      const response = await clientApiInstance<EmailVerificationResponseData>(
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
      const response = await clientApiInstance<NicknameCheckResponseData>(
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
   * 비밀번호 재설정 이메일 요청
   */
  async requestPasswordResetEmail(email: string): Promise<ApiResponse<void>> {
    return clientApiInstance<void>("/api/auth/reset-password-request/send", {
      method: "POST",
      body: JSON.stringify({ email }),
      skipAuth: true,
    });
  },

  /**
   * 비밀번호 재설정 이메일 검증
   */
  async verifyPasswordResetEmail(uuid: string): Promise<ApiResponse<void>> {
    return clientApiInstance<void>(
      `/api/auth/reset-password-request/verify/email?uuid=${uuid}`,
      {
        method: "POST",
        skipAuth: true,
      }
    );
  },

  /**
   * 비밀번호 재설정
   */
  async resetPassword(password: string): Promise<ApiResponse<void>> {
    return clientApiInstance<void>(
      "/api/auth/reset-password-request/verify/input",
      {
        method: "POST",
        body: JSON.stringify({ password }),
        skipAuth: true,
      }
    );
  },
};
