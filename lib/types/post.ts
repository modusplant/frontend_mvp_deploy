/**
 * 콘텐츠 타입 (멀티파트)
 */
export interface ContentPart {
  type: "text" | "image" | "video" | "audio" | "file";
  order: number;
  filename: string;
  data?: string; // 텍스트인 경우만 존재
  src?: string; // 이미지/비디오/오디오/파일 미리보기 URL
}

/**
 * 게시글 목록 조회 요청 파라미터
 */
export interface GetPostsRequest {
  lastPostId?: string; // 커서 기반 페이지네이션
  size: number; // 페이지 크기
  primaryCategoryId?: string; // UUID
  secondaryCategoryId?: string; // UUID (쉼표로 구분하여 여러 개 가능)
}

/**
 * 게시글 목록 조회 응답 데이터
 */
export interface GetPostsResponseData {
  posts: PostData[];
  nextPostId: string | null;
  hasNext: boolean;
  size: number;
}

/**
 * 게시글 목록 응답 데이터 (개별 게시글)
 */
export interface PostData {
  postId: string;
  primaryCategory: string; // "일상", "Q&A", "팁"
  secondaryCategory: string; // "관엽/야생화", "기타" 등
  nickname: string;
  title: string;
  content: ContentPart[]; // 첫 번째 텍스트와 이미지만
  likeCount: number;
  publishedAt: string; // ISO 8601 형식
  commentCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

/**
 * 게시글 상세 타입 (API 응답)
 */
export interface PostDetail extends PostData {
  authorId: string;
  viewCount: number;
  isPublished: boolean;
  publishedAt: string;
  updatedAt: string;
}

/**
 * 게시글 수정용 데이터 타입 (API 응답)
 */
export interface PostEditData
  extends Omit<
    PostData,
    "likeCount" | "commentCount" | "isLiked" | "isBookmarked"
  > {
  primaryCategoryId: string;
  secondaryCategoryId: string;
  authorUuid: string;
  isPublished: boolean;
  updatedAt: string;
}

/**
 * 게시글 작성/수정 요청 타입
 */
export interface PostWritePayload {
  primaryCategoryId: string; // UUID
  secondaryCategoryId: string; // UUID
  title: string; // 최대 60자
  textContent: string; // 본문 텍스트
  images: File[]; // 이미지 파일들 (최대 10개, 각 10MB)
}

/**
 * 최근에 본 게시글 목록 조회 요청 파라미터
 */
export interface GetRecentPostsRequest {
  page: number; // 페이지 번호 (1부터 시작)
  size: number; // 페이지 크기
}

/**
 * 최근에 본 게시글 목록 조회 응답 데이터
 */
export interface GetRecentPostsResponseData {
  posts: PostData[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * 내가 작성한 게시글 목록 조회 요청 파라미터
 */
export interface GetMyPostsRequest {
  page: number; // 페이지 번호 (1부터 시작)
  size: number; // 페이지 크기
}

/**
 * 내가 작성한 게시글 목록 조회 응답 데이터
 */
export interface GetMyPostsResponseData {
  posts: PostData[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
