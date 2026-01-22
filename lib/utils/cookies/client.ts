/**
 * 클라이언트 전용 쿠키 유틸리티
 * document.cookie를 사용
 */

export interface CookieOptions {
  maxAge?: number; // 초 단위
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}

export interface CookieEntry {
  name: string;
  value: string;
}

/**
 * 클라이언트에서 쿠키 값 읽기
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

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

/**
 * 클라이언트에서 쿠키 설정
 */
export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  if (typeof document === "undefined") return;

  const {
    maxAge = 30 * 60,
    path = "/",
    domain,
    secure = true,
    sameSite = "Lax",
  } = options;

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
}

/**
 * 클라이언트에서 쿠키 삭제
 */
export function deleteCookie(name: string, options: CookieOptions = {}): void {
  if (typeof document === "undefined") return;

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
}

/**
 * 클라이언트에서 모든 쿠키 가져오기
 */
export function getAllCookies(): CookieEntry[] {
  if (typeof document === "undefined") return [];
  if (!document.cookie) return [];

  return document.cookie.split(";").reduce<CookieEntry[]>((acc, raw) => {
    const [name, ...rest] = raw.trim().split("=");
    if (!name) return acc;
    const value = rest.join("=");
    acc.push({ name, value: decodeURIComponent(value) });
    return acc;
  }, []);
}
