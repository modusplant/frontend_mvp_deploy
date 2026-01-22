import { format, differenceInMinutes, differenceInHours } from "date-fns";
import { ko } from "date-fns/locale";

/**
 * 상대 시간 포맷팅 (게시글 상세 페이지용)
 * - 1시간 미만: "n분 전"
 * - 24시간 미만: "n시간 전"
 * - 그 외: "yyyy-MM-dd HH:mm"
 *
 * @param dateString ISO 8601 형식의 날짜 문자열 (예: "2025-11-26T12:00:00Z")
 * @returns 포맷팅된 시간 문자열
 *
 * @example
 * formatRelativeTime("2025-11-26T14:50:00Z") // 현재 15:00이면 "10분 전"
 * formatRelativeTime("2025-11-26T10:00:00Z") // 현재 15:00이면 "5시간 전"
 * formatRelativeTime("2025-11-25T10:00:00Z") // "2025-11-25 10:00"
 */
export function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const targetDate = new Date(dateString);

  const minutesDiff = differenceInMinutes(now, targetDate);
  const hoursDiff = differenceInHours(now, targetDate);

  if (minutesDiff < 60) {
    // 1시간 미만
    return `${minutesDiff}분 전`;
  } else if (hoursDiff < 24) {
    // 24시간 미만
    return `${hoursDiff}시간 전`;
  } else {
    // 그 외: yyyy-MM-dd HH:mm
    return format(targetDate, "yyyy-MM-dd HH:mm", { locale: ko });
  }
}

/**
 * 절대 시간 포맷팅 (yyyy-MM-dd HH:mm)
 * @param dateString ISO 8601 형식의 날짜 문자열
 * @returns 포맷팅된 시간 문자열
 *
 * @example
 * formatAbsoluteTime("2025-11-26T14:30:00Z") // "2025-11-26 14:30"
 */
export function formatAbsoluteTime(dateString: string): string {
  return format(new Date(dateString), "yyyy-MM-dd HH:mm", { locale: ko });
}

/**
 * 날짜만 포맷팅 (yyyy-MM-dd)
 * @param dateString ISO 8601 형식의 날짜 문자열
 * @returns 포맷팅된 날짜 문자열
 *
 * @example
 * formatDate("2025-11-26T14:30:00Z") // "2025-11-26"
 */
export function formatDate(dateString: string): string {
  return format(new Date(dateString), "yyyy-MM-dd", { locale: ko });
}
