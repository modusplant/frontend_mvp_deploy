import { clientApiInstance } from "../instances/clientInstance";
import { ApiResponse } from "@/lib/types/common";
import {
  GetMyPostsRequest,
  GetMyPostsResponseData,
  GetPostsRequest,
  GetPostsResponseData,
  GetRecentPostsRequest,
  GetRecentPostsResponseData,
  PostDetail,
  PostEditData,
  PostWritePayload,
} from "@/lib/types/post";

/**
 * 게시글 관련 API
 */
export const postApi = {
  /**
   * 게시글 목록 조회 (커서 기반 페이지네이션)
   * @param params 조회 파라미터
   * @returns 게시글 목록 응답
   */
  async getPosts(
    params: GetPostsRequest
  ): Promise<ApiResponse<GetPostsResponseData>> {
    const queryParams = new URLSearchParams();

    // size는 필수
    queryParams.append("size", params.size.toString());

    // 선택적 파라미터 추가
    if (params.lastPostId) {
      queryParams.append("lastPostId", params.lastPostId);
    }

    if (params.primaryCategoryId) {
      queryParams.append("primaryCategoryId", params.primaryCategoryId);
    }

    if (params.secondaryCategoryId) {
      queryParams.append("secondaryCategoryId", params.secondaryCategoryId);
    }

    const endpoint = `/api/v1/communication/posts?${queryParams.toString()}`;

    return clientApiInstance<GetPostsResponseData>(endpoint, {
      method: "GET",
      skipAuth: false, // 인증 필요 (북마크 상태 등)
    });
  },

  /**
   * 게시글 상세 조회
   * @param postId 게시글 ID (ULID)
   * @returns 게시글 상세 정보
   */
  async getPostDetail(postId: string): Promise<ApiResponse<PostDetail>> {
    return clientApiInstance<PostDetail>(
      `/api/v1/communication/posts/${postId}`,
      {
        method: "GET",
        skipAuth: false,
      }
    );
  },

  /**
   * 게시글 수정용 상세 조회
   * @param postId 게시글 ID (ULID)
   * @returns 게시글 상세 정보
   */
  async getEditPostDetail(postId: string): Promise<ApiResponse<PostEditData>> {
    return clientApiInstance<PostEditData>(
      `/api/v1/communication/posts/${postId}/data`,
      {
        method: "GET",
        skipAuth: false,
      }
    );
  },

  /**
   * 게시글 삭제
   * @param postId 게시글 ID (ULID)
   * @returns 성공 응답
   */
  async deletePost(postId: string): Promise<ApiResponse<void>> {
    return clientApiInstance<void>(`/api/v1/communication/posts/${postId}`, {
      method: "DELETE",
      skipAuth: false,
    });
  },

  /**
   * 게시글 좋아요
   * @param memberId 사용자 ID
   * @param postUlid 게시글 ULID
   * @returns 성공 응답
   */
  async likePost(
    memberId: string,
    postUlid: string
  ): Promise<ApiResponse<void>> {
    return clientApiInstance<void>(
      `/api/v1/members/${memberId}/like/communication/post/${postUlid}`,
      {
        method: "PUT",
        skipAuth: false,
      }
    );
  },

  /**
   * 게시글 좋아요 취소
   * @param memberId 사용자 ID
   * @param postUlid 게시글 ULID
   * @returns 성공 응답
   */
  async unlikePost(
    memberId: string,
    postUlid: string
  ): Promise<ApiResponse<void>> {
    return clientApiInstance<void>(
      `/api/v1/members/${memberId}/like/communication/post/${postUlid}`,
      {
        method: "DELETE",
        skipAuth: false,
      }
    );
  },

  /**
   * 게시글 북마크
   * @param memberId 사용자 ID
   * @param postUlid 게시글 ULID
   * @returns 성공 응답
   */
  async bookmarkPost(
    memberId: string,
    postUlid: string
  ): Promise<ApiResponse<void>> {
    return clientApiInstance<void>(
      `/api/v1/members/${memberId}/bookmark/communication/post/${postUlid}`,
      {
        method: "PUT",
        skipAuth: false,
      }
    );
  },

  /**
   * 게시글 북마크 취소
   * @param memberId 사용자 ID
   * @param postUlid 게시글 ULID
   * @returns 성공 응답
   */
  async unbookmarkPost(
    memberId: string,
    postUlid: string
  ): Promise<ApiResponse<void>> {
    return clientApiInstance<void>(
      `/api/v1/members/${memberId}/bookmark/communication/post/${postUlid}`,
      {
        method: "DELETE",
        skipAuth: false,
      }
    );
  },

  /**
   * 게시글 작성
   * @param payload 게시글 작성 데이터
   * @returns 성공 응답
   */
  async createPost(payload: PostWritePayload): Promise<ApiResponse<void>> {
    const formData = new FormData();

    // 1. 텍스트 콘텐츠를 파일로 변환하여 추가
    if (payload.textContent.trim()) {
      const textBlob = new Blob([payload.textContent], { type: "text/plain" });
      const textFile = new File([textBlob], "text_0.txt", {
        type: "text/plain",
      });
      formData.append("content", textFile);
    }

    // 2. 이미지 파일들 추가
    payload.images.forEach((image, index) => {
      formData.append("content", image);
    });

    // 3. orderInfo 생성 (텍스트 + 이미지 순서)
    const orderInfo: { filename: string; order: number }[] = [];
    let currentOrder = 1;

    if (payload.textContent.trim()) {
      orderInfo.push({ filename: "text_0.txt", order: currentOrder++ });
    }

    payload.images.forEach((image) => {
      orderInfo.push({ filename: image.name, order: currentOrder++ });
    });

    const orderBlob = new Blob([JSON.stringify(orderInfo)], {
      type: "application/json",
    });
    formData.append("orderInfo", orderBlob);

    // 4. Query Parameters 생성
    const params = new URLSearchParams({
      primaryCategoryId: payload.primaryCategoryId,
      secondaryCategoryId: payload.secondaryCategoryId,
      title: payload.title,
      isPublished: "true", // 항상 게시 (임시저장 제외)
    });

    return clientApiInstance<void>(`/api/v1/communication/posts?${params}`, {
      method: "POST",
      body: formData,
      skipAuth: false,
    });
  },

  /**
   * 게시글 수정
   * @param postId 게시글 ID (ULID)
   * @param payload 게시글 수정 데이터
   * @returns 성공 응답
   */
  async updatePost(
    postId: string,
    payload: PostWritePayload
  ): Promise<ApiResponse<void>> {
    const formData = new FormData();

    // 1. 텍스트 콘텐츠를 파일로 변환하여 추가
    if (payload.textContent.trim()) {
      const textBlob = new Blob([payload.textContent], { type: "text/plain" });
      const textFile = new File([textBlob], "text_0.txt", {
        type: "text/plain",
      });
      formData.append("content", textFile);
    }

    // 2. 이미지 파일들 추가
    payload.images.forEach((image) => {
      formData.append("content", image);
    });

    // 3. orderInfo 생성
    const orderInfo: { filename: string; order: number }[] = [];
    let currentOrder = 1;

    if (payload.textContent.trim()) {
      orderInfo.push({ filename: "text_0.txt", order: currentOrder++ });
    }

    payload.images.forEach((image) => {
      orderInfo.push({ filename: image.name, order: currentOrder++ });
    });

    const orderBlob = new Blob([JSON.stringify(orderInfo)], {
      type: "application/json",
    });
    formData.append("orderInfo", orderBlob);

    // 4. Query Parameters 생성
    const params = new URLSearchParams({
      primaryCategoryId: payload.primaryCategoryId,
      secondaryCategoryId: payload.secondaryCategoryId,
      title: payload.title,
      isPublished: "true",
    });

    return clientApiInstance<void>(
      `/api/v1/communication/posts/${postId}?${params}`,
      {
        method: "PUT",
        body: formData,
        skipAuth: false,
      }
    );
  },

  /**
   * 최근에 본 게시글 목록 조회 (페이지네이션)
   * @param params 조회 파라미터
   * @returns 최근에 본 게시글 목록 응답
   */
  async getRecentPosts(
    params: GetRecentPostsRequest
  ): Promise<ApiResponse<GetRecentPostsResponseData>> {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      size: params.size.toString(),
    });

    const endpoint = `/api/v1/communication/posts/me/history?${queryParams.toString()}`;

    return clientApiInstance<GetRecentPostsResponseData>(endpoint, {
      method: "GET",
      skipAuth: false, // 인증 필요
    });
  },

  /**
   * 내가 작성한 게시글 목록 조회 (페이지네이션)
   * @param params 조회 파라미터
   * @returns 내가 작성한 게시글 목록 응답
   */
  async getMyPosts(
    params: GetMyPostsRequest
  ): Promise<ApiResponse<GetMyPostsResponseData>> {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      size: params.size.toString(),
    });

    const endpoint = `/api/v1/communication/posts/me?${queryParams.toString()}`;

    return clientApiInstance<GetMyPostsResponseData>(endpoint, {
      method: "GET",
      skipAuth: false, // 인증 필요
    });
  },

  /**
   * 내가 좋아요한 게시글 목록 조회 (페이지네이션)
   * @param params 조회 파라미터
   * @returns 내가 좋아요한 게시글 목록 응답
   */
  async getLikedPosts(
    params: GetMyPostsRequest
  ): Promise<ApiResponse<GetMyPostsResponseData>> {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      size: params.size.toString(),
    });

    const endpoint = `/api/v1/communication/posts/me/likes?${queryParams.toString()}`;

    return clientApiInstance<GetMyPostsResponseData>(endpoint, {
      method: "GET",
      skipAuth: false, // 인증 필요
    });
  },

  /**
   * 내가 북마크한 게시글 목록 조회 (페이지네이션)
   * @param params 조회 파라미터
   * @returns 내가 북마크한 게시글 목록 응답
   */
  async getBookmarkedPosts(
    params: GetMyPostsRequest
  ): Promise<ApiResponse<GetMyPostsResponseData>> {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      size: params.size.toString(),
    });

    const endpoint = `/api/v1/communication/posts/me/bookmarks?${queryParams.toString()}`;

    return clientApiInstance<GetMyPostsResponseData>(endpoint, {
      method: "GET",
      skipAuth: false, // 인증 필요
    });
  },
};
