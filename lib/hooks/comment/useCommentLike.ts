import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentApi } from "@/lib/api/comment";
import { useAuthStore } from "@/lib/store/authStore";
import { Comment } from "@/lib/types/comment";

interface UseCommentLikeProps {
  postId: string;
  commentPath: string;
  initialLikeCount: number;
  initialIsLiked?: boolean;
}

interface UseCommentLikeReturn {
  likeCount: number;
  isLiked: boolean;
  isLiking: boolean;
  handleLike: () => void;
}

export function useCommentLike({
  postId,
  commentPath,
  initialLikeCount,
  initialIsLiked = false,
}: UseCommentLikeProps): UseCommentLikeReturn {
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  // 좋아요 토글 mutation
  const likeMutation = useMutation({
    mutationFn: async (isCurrentlyLiked: boolean) => {
      if (!isAuthenticated || !user) {
        throw new Error("로그인이 필요합니다.");
      }

      if (isCurrentlyLiked) {
        await commentApi.unlikeComment(user.id, postId, commentPath);
        return -1; // 좋아요 취소
      } else {
        await commentApi.likeComment(user.id, postId, commentPath);
        return 1; // 좋아요
      }
    },
    onMutate: async (isCurrentlyLiked) => {
      // 낙관적 업데이트: 이전 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });

      // 이전 데이터 스냅샷
      const previousComments = queryClient.getQueryData<Comment[]>([
        "comments",
        postId,
      ]);

      // 낙관적 업데이트
      queryClient.setQueryData<Comment[]>(["comments", postId], (old) => {
        if (!old) return old;
        return old.map((comment) =>
          comment.path === commentPath
            ? {
                ...comment,
                likeCount: comment.likeCount + (isCurrentlyLiked ? -1 : 1),
                isLiked: !isCurrentlyLiked,
              }
            : comment
        );
      });

      return { previousComments };
    },
    onError: (error: Error, _variables, context) => {
      // 에러 시 롤백
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["comments", postId],
          context.previousComments
        );
      }
      console.error("댓글 좋아요 처리 실패:", error);
      window.alert(error.message || "좋아요 처리에 실패했습니다.");
    },
    onSettled: () => {
      // 항상 최신 데이터로 리페치
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  // 현재 댓글 데이터 가져오기
  const comments = queryClient.getQueryData<Comment[]>(["comments", postId]);
  const currentComment = comments?.find((c) => c.path === commentPath);

  return {
    likeCount: currentComment?.likeCount ?? initialLikeCount,
    isLiked: currentComment?.isLiked ?? initialIsLiked,
    isLiking: likeMutation.isPending,
    handleLike: () => {
      likeMutation.mutate(currentComment?.isLiked ?? initialIsLiked);
    },
  };
}
