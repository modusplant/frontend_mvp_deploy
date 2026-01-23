/**
 * 댓글 타입 (API 응답 기반)
 */
export interface Comment {
  nickname: string;
  path: string; // "0", "0.1", "0.1.2" 형식의 계층 경로
  content: string;
  likeCount: number;
  createdAt: string;
  isDeleted: boolean;
  isLiked?: boolean; // 현재 사용자의 좋아요 여부
  children?: Comment[]; // 재귀 렌더링용 (파싱 후 추가)
  depth?: number; // UI 들여쓰기용 (파싱 후 추가)
}

/**
 * 댓글 작성 요청 페이로드
 */
export interface CommentCreatePayload {
  postId: string; // ulid
  path: string; // "0" or "0.1" or "0.1.2"
  content: string;
}
