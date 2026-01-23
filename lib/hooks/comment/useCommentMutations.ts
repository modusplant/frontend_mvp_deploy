import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentApi } from "@/lib/api/comment";
import { useAuthStore } from "@/lib/store/authStore";
import { generateCommentPath } from "@/lib/utils/parseComments";

interface UseCommentMutationsProps {
  postId: string;
  onSuccess?: () => void;
}

interface CreateCommentParams {
  parentPath?: string | null;
  currentCommentCount?: number;
  siblingCount?: number;
  content: string;
}

interface DeleteCommentParams {
  commentPath: string;
}

interface UseCommentMutationsReturn {
  // 생성
  createComment: (params: CreateCommentParams) => Promise<void>;
  isCreating: boolean;

  // 삭제
  deleteComment: (params: DeleteCommentParams) => Promise<void>;
  isDeleting: boolean;
}

export function useCommentMutations({
  postId,
  onSuccess,
}: UseCommentMutationsProps): UseCommentMutationsReturn {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  // 댓글 생성 mutation
  const createMutation = useMutation({
    mutationFn: async ({
      parentPath = null,
      currentCommentCount = 0,
      siblingCount = 0,
      content,
    }: CreateCommentParams) => {
      if (!isAuthenticated) {
        throw new Error("로그인이 필요합니다.");
      }

      if (content.trim().length === 0) {
        throw new Error("댓글 내용을 입력해주세요.");
      }

      const path = parentPath
        ? generateCommentPath(parentPath, siblingCount)
        : currentCommentCount.toString();

      await commentApi.createComment({
        postId,
        path,
        content: content.trim(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("댓글 작성 실패:", error);
      window.alert(error.message || "댓글 작성에 실패했습니다.");
    },
  });

  // 댓글 삭제 mutation
  const deleteMutation = useMutation({
    mutationFn: async ({ commentPath }: DeleteCommentParams) => {
      if (!window.confirm("댓글을 삭제하시겠습니까?")) {
        throw new Error("취소됨");
      }
      await commentApi.deleteComment(postId, commentPath);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      if (error.message !== "취소됨") {
        console.error("댓글 삭제 실패:", error);
        window.alert("댓글 삭제에 실패했습니다.");
      }
    },
  });

  return {
    createComment: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteComment: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
