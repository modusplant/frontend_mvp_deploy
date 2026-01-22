import { setCookie } from "@/lib/utils/cookies/client";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_MAX_AGE,
  REMEMBER_ME_MAX_AGE,
} from "@/lib/constants/auth";
import { decodeJWT } from "@/lib/utils/auth/decodeJWT";
import { memberApi } from "@/lib/api/client/member";
import { User } from "@/lib/types/auth";

/**
 * 인증 성공 후 공통 처리 (1-6단계)
 * @param accessToken - 액세스 토큰
 * @param rememberMe - 아이디 저장 여부
 * @returns 사용자 정보
 */
export async function processSuccessfulAuth(
  accessToken: string,
  rememberMe: boolean
): Promise<User> {
  try {
    // 1. AccessToken 저장 (쿠키)
    await setCookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      maxAge: ACCESS_TOKEN_MAX_AGE,
      path: "/",
      secure: true,
      sameSite: "Lax",
    });

    // 2. rememberMe 쿠키 저장 (1주일)
    if (rememberMe) {
      await setCookie("rememberMe", "true", {
        maxAge: REMEMBER_ME_MAX_AGE,
        path: "/",
        secure: true,
        sameSite: "Lax",
      });
    }

    // 3. JWT에서 사용자 정보 추출
    const decoded = decodeJWT(accessToken);

    if (!decoded) {
      throw new Error("유효하지 않은 토큰입니다.");
    }

    // 4. 토큰에서 추출한 ID로 추가 사용자 정보(image, introduction) 조회
    const { data: profileResponse } = await memberApi.getProfile(decoded.sub);

    // 5. 사용자 정보 구성
    const user: User = {
      id: decoded.sub,
      email: decoded.email,
      nickname: profileResponse?.nickname || decoded.nickname,
      role: decoded.role,
      image: profileResponse?.imageUrl || "",
      introduction: profileResponse?.introduction || "",
    };

    // 6. 사용자 정보 반환
    return user;
  } catch (error) {
    console.error("인증 처리 중 오류:", error);
    throw error;
  }
}
