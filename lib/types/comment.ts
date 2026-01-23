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
  image?: string | null; // 프로필 이미지 (base64)
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

/**
 * 마이페이지 - 내 댓글 아이템
 */
export interface MyComment {
  content: string; // 댓글 내용
  createdAt: string; // yyyy-mm-dd
  postTitle: string; // 게시글 제목
  postId: string; // 게시글 ID (추가됨)
  totalCommentsOfPost: number; // 해당 게시글의 총 댓글 수
}

/**
 * 내 댓글 목록 조회 요청
 */
export interface GetMyCommentsRequest {
  page: number;
  size?: number;
  uuid?: string;
}

/**
 * 내 댓글 목록 조회 응답
 */
export interface GetMyCommentsResponseData {
  commentList: MyComment[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
