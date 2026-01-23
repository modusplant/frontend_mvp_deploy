import { apiClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/types/common";
import { Comment, CommentCreatePayload } from "@/lib/types/comment";

/**
 * 댓글 관련 API
 */
export const commentApi = {
  /**
   * 특정 게시글의 댓글 목록 조회
   * @param postId 게시글 ID (ULID)
   * @returns 댓글 목록 (플랫 배열)
   */
  async getComments(postId: string): Promise<ApiResponse<Comment[]>> {
    return apiClient<Comment[]>(
      `/api/v1/communication/comments/post/${postId}`,
      {
        method: "GET",
        skipAuth: false,
      }
    );
  },

  /**
   * 댓글 추가
   * @param payload 댓글 생성 페이로드
   * @returns 성공 응답
   */
  async createComment(
    payload: CommentCreatePayload
  ): Promise<ApiResponse<void>> {
    return apiClient<void>("/api/v1/communication/comments", {
      method: "POST",
      skipAuth: false,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  },

  /**
   * 댓글 삭제
   * @param postUlid 게시글 ULID
   * @param path 댓글 경로 (예: "0", "0.1", "0.1.2")
   * @returns 성공 응답
   */
  async deleteComment(
    postUlid: string,
    path: string
  ): Promise<ApiResponse<void>> {
    return apiClient<void>(
      `/api/v1/communication/comments/post/${postUlid}/path/${path}`,
      {
        method: "DELETE",
        skipAuth: false,
      }
    );
  },

  /**
   * 댓글 좋아요
   * @param memberId 사용자 ID
   * @param postUlid 게시글 ULID
   * @param path 댓글 경로
   * @returns 성공 응답
   */
  async likeComment(
    memberId: string,
    postUlid: string,
    path: string
  ): Promise<ApiResponse<void>> {
    return apiClient<void>(
      `/api/v1/members/${memberId}/like/communication/post/${postUlid}/path/${path}`,
      {
        method: "PUT",
        skipAuth: false,
      }
    );
  },

  /**
   * 댓글 좋아요 취소
   * @param memberId 사용자 ID
   * @param postUlid 게시글 ULID
   * @param path 댓글 경로
   * @returns 성공 응답
   */
  async unlikeComment(
    memberId: string,
    postUlid: string,
    path: string
  ): Promise<ApiResponse<void>> {
    return apiClient<void>(
      `/api/v1/members/${memberId}/like/communication/post/${postUlid}/path/${path}`,
      {
        method: "DELETE",
        skipAuth: false,
      }
    );
  },
};
