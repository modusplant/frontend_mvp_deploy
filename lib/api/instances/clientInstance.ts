import { ApiResponse, ApiError } from "../../types/common";
import { getCookie, setCookie, deleteCookie } from "../../utils/cookies/client";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_MAX_AGE,
} from "../../constants/auth";

const BASE_URL = ""; // 클라이언트는 상대 경로 사용 (rewrites 적용)

/**
 * 클라이언트 전용: 리프레시 토큰으로 새 액세스 토큰 발급
 */
export async function refreshAccessToken(): Promise<string> {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/token/refresh`, {
      method: "POST",
      credentials: "include", // 쿠키 자동 전송
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let errorBody = null;
      try {
        errorBody = await response.text();
        console.error("[RefreshToken] 에러 응답 본문:", errorBody);
      } catch (e) {
        console.error("[RefreshToken] 응답 본문 읽기 실패");
      }

      throw new ApiError(
        response.status,
        "token_refresh_failed",
        `토큰 갱신에 실패했습니다 (${response.status})`
      );
    }

    const data: ApiResponse<{ accessToken: string }> = await response.json();

    if (!data.data || !data.data.accessToken) {
      throw new ApiError(
        500,
        "invalid_response",
        "유효하지 않은 토큰 갱신 응답입니다"
      );
    }

    const newAccessToken = data.data.accessToken;

    console.info("[RefreshToken] 새 액세스 토큰 발급 성공");

    // 새 액세스 토큰 쿠키에 저장
    setCookie(ACCESS_TOKEN_COOKIE_NAME, newAccessToken, {
      maxAge: ACCESS_TOKEN_MAX_AGE,
      path: "/",
      secure: true,
      sameSite: "Lax",
    });

    return newAccessToken;
  } catch (error) {
    console.error("[RefreshToken] 실패:", error);
    throw error;
  }
}

/**
 * 클라이언트 전용 API 클라이언트
 */
interface RequestConfig extends RequestInit {
  skipAuth?: boolean;
  isRetry?: boolean;
  enableCache?: boolean;
}

export async function clientApiInstance<T = any>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  const {
    skipAuth = false,
    isRetry = false,
    enableCache = false,
    ...fetchConfig
  } = config;

  const url = `${BASE_URL}${endpoint}`;

  const isFormData = fetchConfig.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...(!enableCache && {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    }),
    ...(fetchConfig.headers as Record<string, string>),
  };

  // 인증이 필요한 경우 액세스 토큰 추가
  if (!skipAuth) {
    const accessToken = getCookie(ACCESS_TOKEN_COOKIE_NAME);
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...fetchConfig,
      headers,
      credentials: "include", // 쿠키 자동 전송 (refreshToken)
    });

    const data: ApiResponse<T> = await response.json();

    // 401 에러이고 재시도가 아닌 경우 토큰 갱신 후 재시도
    if (data.status === 401 && !isRetry && !skipAuth) {
      try {
        await refreshAccessToken();
        return clientApiInstance<T>(endpoint, { ...config, isRetry: true });
      } catch (refreshError) {
        deleteCookie(ACCESS_TOKEN_COOKIE_NAME, {
          path: "/",
        });
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

    throw new ApiError(500, "network_error", "네트워크 오류가 발생했습니다");
  }
}
