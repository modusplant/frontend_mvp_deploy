import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { postApi } from "@/lib/api/post";
import { useAuthStore } from "@/lib/store/authStore";

interface UsePostInteractionProps {
  postId: string;
  initialLikeCount: number;
  initialBookmarkCount: number;
  initialIsLiked?: boolean;
  initialIsBookmarked?: boolean;
}

interface UsePostInteractionReturn {
  // 좋아요 상태
  likeCount: number;
  isLiked: boolean;
  isLiking: boolean;
  handleLike: () => void;

  // 북마크 상태
  bookmarkCount: number;
  isBookmarked: boolean;
  isBookmarking: boolean;
  handleBookmark: () => void;
}

export function usePostInteraction({
  postId,
  initialLikeCount,
  initialBookmarkCount,
  initialIsLiked = false,
  initialIsBookmarked = false,
}: UsePostInteractionProps): UsePostInteractionReturn {
  const { user, isAuthenticated } = useAuthStore();

  // 좋아요 상태
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  // 북마크 상태
  const [bookmarkCount, setBookmarkCount] = useState(initialBookmarkCount);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);

  // 좋아요 mutation
  const likeMutation = useMutation({
    mutationFn: async (currentIsLiked: boolean) => {
      if (!isAuthenticated || !user) {
        throw new Error("로그인이 필요합니다.");
      }

      if (currentIsLiked) {
        await postApi.unlikePost(user.id, postId);
      } else {
        await postApi.likePost(user.id, postId);
      }
    },
    onMutate: async (currentIsLiked) => {
      // 낙관적 업데이트
      setLikeCount((prev) => prev + (currentIsLiked ? -1 : 1));
      setIsLiked(!currentIsLiked);
    },
    onError: (error: Error, currentIsLiked) => {
      // 에러 시 롤백
      setLikeCount((prev) => prev + (currentIsLiked ? 1 : -1));
      setIsLiked(currentIsLiked);
      console.error("좋아요 처리 실패:", error);
      window.alert(error.message || "좋아요 처리에 실패했습니다.");
    },
  });

  // 북마크 mutation
  const bookmarkMutation = useMutation({
    mutationFn: async (currentIsBookmarked: boolean) => {
      if (!isAuthenticated || !user) {
        throw new Error("로그인이 필요합니다.");
      }

      if (currentIsBookmarked) {
        await postApi.unbookmarkPost(user.id, postId);
      } else {
        await postApi.bookmarkPost(user.id, postId);
      }
    },
    onMutate: async (currentIsBookmarked) => {
      // 낙관적 업데이트
      setBookmarkCount((prev) => prev + (currentIsBookmarked ? -1 : 1));
      setIsBookmarked(!currentIsBookmarked);
    },
    onError: (error: Error, currentIsBookmarked) => {
      // 에러 시 롤백
      setBookmarkCount((prev) => prev + (currentIsBookmarked ? 1 : -1));
      setIsBookmarked(currentIsBookmarked);
      console.error("북마크 처리 실패:", error);
      window.alert(error.message || "북마크 처리에 실패했습니다.");
    },
  });

  return {
    likeCount,
    isLiked,
    isLiking: likeMutation.isPending,
    handleLike: () => likeMutation.mutate(isLiked),
    bookmarkCount,
    isBookmarked,
    isBookmarking: bookmarkMutation.isPending,
    handleBookmark: () => bookmarkMutation.mutate(isBookmarked),
  };
}
