import { cookies } from "next/headers";

/**
 * 서버 전용 쿠키 유틸리티
 * next/headers의 cookies()를 사용
 */

export interface CookieOptions {
  maxAge?: number; // 초 단위
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  httpOnly?: boolean;
}

export interface CookieEntry {
  name: string;
  value: string;
}

/**
 * 서버에서 쿠키 값 읽기
 */
export async function getCookie(name: string): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value || null;
}

/**
 * 서버에서 쿠키 설정
 */
export async function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): Promise<void> {
  const {
    maxAge = 30 * 60,
    path = "/",
    secure = true,
    sameSite = "lax",
    httpOnly = false,
  } = options;

  const cookieStore = await cookies();
  cookieStore.set(name, value, {
    maxAge,
    path,
    secure,
    sameSite,
    httpOnly,
  });
}

/**
 * 서버에서 쿠키 삭제
 */
export async function deleteCookie(name: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}
