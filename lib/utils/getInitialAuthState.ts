import { memberApi } from "@/lib/api/server/member";
import { decodeJWT } from "@/lib/utils/auth/decodeJWT";

/**
 * 서버에서 초기 인증 상태 결정
 * Middleware에서 토큰 갱신이 완료된 상태에서 쿠키만 읽음
 */
export async function getInitialAuthState(): Promise<any | null> {
  try {
    const { cookies } = await import("next/headers");

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const rememberMe = cookieStore.get("rememberMe")?.value;

    // rememberMe가 false이거나 accessToken이 없으면 null 반환
    if (rememberMe !== "true" || !accessToken) {
      return null;
    }

    // AccessToken에서 사용자 정보 추출
    const decoded = decodeJWT(accessToken);
    if (!decoded) {
      return null;
    }

    // 토큰에서 추출한 ID로 추가 사용자 정보(image, introduction) 조회
    try {
      const { data: profileResponse } = await memberApi.getProfile(decoded.sub);

      return {
        id: decoded.sub,
        email: decoded.email,
        nickname: profileResponse?.nickname || decoded.nickname,
        role: decoded.role,
        image: profileResponse?.imageUrl || "",
        introduction: profileResponse?.introduction || "",
      };
    } catch (profileError) {
      console.error("프로필 조회 실패:", profileError);
      // 프로필 조회 실패해도 토큰에서 추출한 정보는 반환
      return {
        id: decoded.sub,
        email: decoded.email,
        nickname: decoded.nickname,
        role: decoded.role,
        image: "",
        introduction: "",
      };
    }
  } catch (error) {
    console.error("인증 상태 조회 실패:", error);
    return null;
  }
}
