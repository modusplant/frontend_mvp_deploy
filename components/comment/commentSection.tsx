"use client";

import { useCommentTree } from "@/lib/hooks/comment/useCommentTree";
import { useCommentsQuery } from "@/lib/hooks/comment/useCommentsQuery";
import CommentList from "./commentList";
import CommentInput from "./commentInput";
import BlurOverlay from "../_layout/blurOverlay";
import { useAuthStore } from "@/lib/store/authStore";

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  // React Query로 댓글 조회
  const { comments, isLoading, refetch } = useCommentsQuery({ postId });

  // 댓글 트리 구조 생성
  const { commentTree, totalCount, rootCount } = useCommentTree({ comments });

  // 인증 상태
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="border-surface-stroke mt-16 border-t pt-12">
      <h2 className="text-neutral-20 mb-8 text-[28px] font-bold">
        댓글 {totalCount.toLocaleString()}개
      </h2>

      {/* 댓글 작성 입력창 */}
      <CommentInput
        postId={postId}
        onSuccess={refetch}
        currentCommentCount={rootCount}
      />

      <div className="relative min-h-[30vh] overflow-hidden">
        {/* 댓글 목록 */}
        {isLoading ? (
          <div className="text-neutral-60 py-12 text-center">
            댓글을 불러오는 중...
          </div>
        ) : commentTree.length === 0 ? (
          <div className="text-neutral-60 py-12 text-center">
            첫 댓글을 작성해보세요!
          </div>
        ) : (
          <CommentList
            comments={commentTree}
            postId={postId}
            onUpdate={refetch}
          />
        )}
        {!isAuthenticated && <BlurOverlay variant="comment" />}
      </div>
    </div>
  );
}
