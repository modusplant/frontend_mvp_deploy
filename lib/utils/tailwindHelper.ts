import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS 클래스명을 조건부로 병합하는 헬퍼 함수
 * clsx로 조건부 클래스를 처리하고, tailwind-merge로 중복 제거
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
