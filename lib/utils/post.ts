import { PostData } from "@/lib/types/post";

/**
 * 썸네일 추출 헬퍼 함수
 * - content 배열에서 첫 번째 이미지를 찾아 반환
 * - 이미지가 없으면 postId 기반으로 일관된 랜덤 이미지 반환
 */
export function getThumbnail(post: PostData): string {
  const imageContent = post.content.find((c) => c.type === "image");

  if (imageContent?.src) {
    return imageContent.src;
  }

  // postId의 마지막 문자를 사용하여 1-4 사이의 숫자로 변환
  const lastChar = post.postId.slice(-1);
  const charCode = lastChar.charCodeAt(0);
  const imageNumber = (charCode % 4) + 1;

  return `/post/image_0${imageNumber}.png`;
}

/**
 * 본문 첫 텍스트 추출 헬퍼 함수
 * - content 배열에서 첫 번째 텍스트를 찾아 반환
 */
export function getExcerpt(post: PostData): string | undefined {
  const textContent = post.content.find((c) => c.type === "text");
  if (!textContent) return undefined;

  return textContent.data;
}

/**
 * 날짜 포맷팅 헬퍼 함수
 * - 24시간 이내: n시간 전
 * - 1~10일 전: n일 전
 * - 11일 이후: YYYY년 MM월 DD일
 */
export function formatPostDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // 24시간 이내
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  // 1~10일 전
  if (diffDays >= 1 && diffDays <= 10) {
    return `${diffDays}일 전`;
  }

  // 11일 이후
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
