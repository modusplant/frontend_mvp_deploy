/**
 * 쿠키 관리 유틸리티 (클라이언트/서버 통합)
 * 환경을 자동으로 감지하여 적절한 방식으로 동작
 */

export interface CookieOptions {
  maxAge?: number; // 초 단위
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
  httpOnly?: boolean;
}

/**
 * 쿠키에서 값 읽기 (클라이언트/서버 통합)
 */
export async function getCookie(name: string): Promise<string | null> {
  // 클라이언트 환경
  if (typeof document !== "undefined") {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
      const trimmed = cookie.trim();
      if (trimmed.startsWith(nameEQ)) {
        return decodeURIComponent(trimmed.substring(nameEQ.length));
      }
    }

    return null;
  }

  // 서버 환경
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value || null;
  } catch {
    return null;
  }
}

/**
 * 쿠키에 값 저장 (클라이언트/서버 통합)
 */
export async function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): Promise<void> {
  const {
    maxAge = 30 * 60,
    path = "/",
    domain,
    secure = true,
    sameSite = "Lax",
    httpOnly = false,
  } = options;

  // 클라이언트 환경
  if (typeof document !== "undefined") {
    let cookieString = `${name}=${encodeURIComponent(value)}`;

    if (maxAge) {
      cookieString += `; Max-Age=${maxAge}`;
    }

    if (path) {
      cookieString += `; Path=${path}`;
    }

    if (domain) {
      cookieString += `; Domain=${domain}`;
    }

    if (secure) {
      cookieString += "; Secure";
    }

    if (sameSite) {
      cookieString += `; SameSite=${sameSite}`;
    }

    document.cookie = cookieString;
    return;
  }

  // 서버 환경
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();

    cookieStore.set(name, value, {
      maxAge,
      path,
      secure,
      sameSite: sameSite as any,
      httpOnly,
    });
  } catch (error) {
    console.error("쿠키 설정 실패:", error);
  }
}

/**
 * 쿠키 삭제 (클라이언트/서버 통합)
 */
export async function deleteCookie(
  name: string,
  options: CookieOptions = {}
): Promise<void> {
  // 클라이언트 환경
  if (typeof document !== "undefined") {
    const { path = "/", domain, secure = true, sameSite = "Lax" } = options;

    let cookieString = `${name}=`;

    if (path) {
      cookieString += `; Path=${path}`;
    }

    if (domain) {
      cookieString += `; Domain=${domain}`;
    }

    if (secure) {
      cookieString += "; Secure";
    }

    if (sameSite) {
      cookieString += `; SameSite=${sameSite}`;
    }

    cookieString += "; Max-Age=-1";

    document.cookie = cookieString;
    return;
  }

  // 서버 환경
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    cookieStore.delete(name);
  } catch (error) {
    console.error("쿠키 삭제 실패:", error);
  }
}
