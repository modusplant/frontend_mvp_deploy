/**
 * JWT 페이로드 타입
 */
export interface JWTPayload {
  /** 사용자 UUID */
  sub: string;
  nickname: string;
  email: string;
  role: string;
  exp: number; // Unix timestamp (초 단위)
}

/**
 * JWT 토큰 디코딩 (서버/클라이언트 공용)
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    // base64url -> base64, 패딩 추가
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4 ? "=".repeat(4 - (base64.length % 4)) : "";
    const base64WithPad = base64 + pad;

    let decoded: string;

    // 서버 환경 (Node.js)
    if (typeof window === "undefined") {
      decoded = Buffer.from(base64WithPad, "base64").toString("utf-8");
    }
    // 클라이언트 환경 (브라우저)
    else {
      const binary = window.atob(base64WithPad);
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      decoded = new TextDecoder().decode(bytes);
    }

    const payload = JSON.parse(decoded);
    return payload as JWTPayload;
  } catch (error) {
    console.error("JWT 디코딩 실패:", error);
    return null;
  }
}
