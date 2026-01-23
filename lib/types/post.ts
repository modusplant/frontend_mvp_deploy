/**
 * 1차 카테고리 타입
 */
export type PrimaryCategory = "all" | "daily" | "qna" | "tip";

/**
 * 2차 카테고리 타입 (1차 카테고리별)
 */
export type SecondaryCategoryDaily =
  | "all"
  | "foliage-wildflower"
  | "geranium"
  | "begonia"
  | "succulent-cactus"
  | "carnivorous-vine-bulb"
  | "fern-moss-aquatic"
  | "veranda-garden"
  | "farm-vegetable"
  | "plant-shopping"
  | "etc";

export type SecondaryCategoryQnA =
  | "all"
  | "watering-soil"
  | "leaf-growth-pest"
  | "water-leaf-cutting"
  | "cutting-division"
  | "repotting-pruning"
  | "overwintering-seed"
  | "plant-recommend"
  | "etc";

export type SecondaryCategoryTip = "all";

export type SecondaryCategory =
  | SecondaryCategoryDaily
  | SecondaryCategoryQnA
  | SecondaryCategoryTip;

/**
 * 콘텐츠 타입 (멀티파트)
 */
export interface ContentPart {
  type: "text" | "image" | "video" | "audio" | "file";
  order: number;
  filename: string;
  data: string; // 텍스트는 문자열, 파일은 URL
}

/**
 * 게시글 콘텐츠 파트 (API 응답)
 */
export interface PostContentPart {
  type: "text" | "image" | "video" | "audio" | "file";
  order: number;
  filename: string;
  data: string;
}

/**
 * 게시물 타입
 */
export interface Post {
  id: string;
  primaryCategoryId: string; // UUID
  secondaryCategoryId: string; // UUID
  primaryCategory: PrimaryCategory;
  secondaryCategory: SecondaryCategory;
  title: string;
  content: ContentPart[]; // 멀티파트 콘텐츠
  excerpt?: string; // 본문 요약 (말줄임표 사용)
  author: {
    id: string;
    nickname: string; // name -> nickname
    avatar?: string;
  };
  thumbnail?: string; // 썸네일 이미지 (없으면 기본 이미지)
  createdAt: Date;
  updatedAt?: Date;
  views?: number; // 조회수 (선택)
  likes: number; // 좋아요 수
  commentCount: number; // 댓글 수
  isBookmarked: boolean; // 북마크 여부
  isPublished: boolean; // 게시/임시저장
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
 * 게시글 목록 응답 데이터 (개별 게시글)
 */
export interface PostData {
  postId: string;
  primaryCategory: string; // "일상", "Q&A", "팁"
  secondaryCategory: string; // "관엽/야생화", "기타" 등
  nickname: string;
  title: string;
  content: PostContentPart[]; // 첫 번째 텍스트와 이미지만
  likeCount: number;
  publishedAt: string; // ISO 8601 형식
  commentCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
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
 * 게시글 상세 콘텐츠 타입 (API 응답)
 */
export interface PostContent {
  type: "text" | "image";
  order: number;
  filename?: string;
  data: string; // 텍스트 내용 or base64 이미지
}

/**
 * 게시글 상세 타입 (API 응답)
 */
export interface PostDetail {
  authorUuid: string;
  authorNickname: string;
  title: string;
  content: PostContent[];
  primaryCategory: string;
  secondaryCategory: string;
  viewCount: number;
  likeCount: number;
  bookmarkCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  isLiked: boolean; // 현재 사용자의 좋아요 여부
  isBookmarked: boolean; // 현재 사용자의 북마크 여부
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
