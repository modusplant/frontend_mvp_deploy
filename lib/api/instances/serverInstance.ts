import { ApiResponse, ApiError } from "../../types/common";
import { getCookie, deleteCookie } from "../../utils/cookies/server";
import { ACCESS_TOKEN_COOKIE_NAME } from "../../constants/auth";

const BASE_URL = process.env.BASE_URL || "";

/**
 * 서버 전용 API 클라이언트
 */
interface RequestConfig extends RequestInit {
  skipAuth?: boolean;
  enableCache?: boolean;
}

export async function serverApiInstance<T = any>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  const { skipAuth = false, enableCache = false, ...fetchConfig } = config;

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
    const accessToken = await getCookie(ACCESS_TOKEN_COOKIE_NAME);
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...fetchConfig,
      headers,
    });

    const data: ApiResponse<T> = await response.json();

    // 401 에러 시 쿠키 삭제 후 에러 전달 (서버에서는 토큰 갱신 불가)
    if (data.status === 401 && !skipAuth) {
      await deleteCookie(ACCESS_TOKEN_COOKIE_NAME);
      await deleteCookie("rememberMe");
      throw new ApiError(401, "authentication_required", "다시 로그인해주세요");
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
