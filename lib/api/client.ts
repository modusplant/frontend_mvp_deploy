import { ApiResponse, ApiError } from "../types/common";
import { useAuthStore } from "../store/authStore";

const BASE_URL = "";

/**
 * authStore에서 액세스 토큰 가져오기
 */
export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return useAuthStore.getState().accessToken;
};

/**
 * authStore에 액세스 토큰 저장
 */
export const setAccessToken = (token: string): void => {
  if (typeof window === "undefined") return;
  useAuthStore.getState().setAccessToken(token);
};

/**
 * authStore에서 액세스 토큰 제거
 */
export const removeAccessToken = (): void => {
  if (typeof window === "undefined") return;
  useAuthStore.getState().setAccessToken(null);
};

/**
 * 리프레시 토큰으로 새 액세스 토큰 발급
 */
export async function refreshAccessToken(): Promise<string> {
  const response = await fetch(`${BASE_URL}/api/auth/token/refresh`, {
    method: "POST",
    credentials: "include", // httpOnly 쿠키 전송
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      "token_refresh_failed",
      "토큰 갱신에 실패했습니다"
    );
  }

  const data: ApiResponse<{ accessToken: string }> = await response.json();

  if (data.status !== 200 || !data.data?.accessToken) {
    throw new ApiError(
      data.status,
      data.code,
      data.message || "토큰 갱신에 실패했습니다"
    );
  }

  const newAccessToken = data.data.accessToken;
  setAccessToken(newAccessToken);
  return newAccessToken;
}

/**
 * API 클라이언트 설정
 */
interface RequestConfig extends RequestInit {
  skipAuth?: boolean; // 인증 헤더 스킵 여부
  isRetry?: boolean; // 재시도 여부
}

/**
 * 공통 API 클라이언트
 */
export async function apiClient<T = any>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  const { skipAuth = false, isRetry = false, ...fetchConfig } = config;

  const url = `${BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchConfig.headers as Record<string, string>),
  };

  // 인증이 필요한 경우 액세스 토큰 추가
  if (!skipAuth) {
    const accessToken = getAccessToken();
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...fetchConfig,
      headers,
      credentials: "include", // 쿠키 전송 (refreshToken)
    });

    const data: ApiResponse<T> = await response.json();

    // 401 에러이고 재시도가 아닌 경우 토큰 갱신 후 재시도
    if (data.status === 401 && !isRetry && !skipAuth) {
      try {
        await refreshAccessToken();
        // 토큰 갱신 후 재시도
        return apiClient<T>(endpoint, { ...config, isRetry: true });
      } catch (refreshError) {
        // 리프레시 토큰도 만료된 경우 로그아웃 처리
        removeAccessToken();
        throw new ApiError(
          401,
          "authentication_required",
          "다시 로그인해주세요"
        );
      }
    }

    // 에러 응답 처리
    if (data.status >= 400) {
      throw new ApiError(
        data.status,
        data.code,
        data.message || "요청에 실패했습니다"
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // 네트워크 에러 등
    throw new ApiError(500, "network_error", "네트워크 오류가 발생했습니다");
  }
}
