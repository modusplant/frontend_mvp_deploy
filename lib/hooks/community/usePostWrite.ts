"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { postApi } from "@/lib/api/post";
import { PostWritePayload } from "@/lib/types/post";

/**
 * 게시글 작성/수정 커스텀 훅
 * @param postId 수정 모드일 경우 게시글 ID
 */
export default function usePostWrite(postId?: string) {
  const router = useRouter();
  const isEditMode = !!postId;

  // 게시글 작성 Mutation
  const createMutation = useMutation({
    mutationFn: (payload: PostWritePayload) => postApi.createPost(payload),
    onSuccess: () => {
      window.alert("게시글이 등록되었습니다.");
      router.push("/"); // 메인페이지로 이동
    },
    onError: (error: Error) => {
      console.error("게시글 작성 실패:", error);
      window.alert("게시글 등록에 실패했습니다. 다시 시도해주세요.");
    },
  });

  // 게시글 수정 Mutation
  const updateMutation = useMutation({
    mutationFn: (payload: PostWritePayload) =>
      postApi.updatePost(postId!, payload),
    onSuccess: () => {
      window.alert("게시글이 수정되었습니다.");
      router.push(`/community/${postId}`); // 상세 페이지로 이동
    },
    onError: (error: Error) => {
      console.error("게시글 수정 실패:", error);
      window.alert("게시글 수정에 실패했습니다. 다시 시도해주세요.");
    },
  });

  // 제출 함수
  const handleSubmit = (payload: PostWritePayload) => {
    if (isEditMode) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  return {
    isEditMode,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    handleSubmit,
  };
}
