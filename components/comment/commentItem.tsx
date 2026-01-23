"use client";

import { useState } from "react";
import { Comment } from "@/lib/types/comment";
import { useAuthStore } from "@/lib/store/authStore";
import { formatRelativeTime } from "@/lib/utils/formatTime";
import { Heart, MessageSquare, Trash2 } from "lucide-react";
import { useCommentLike } from "@/lib/hooks/comment/useCommentLike";
import { useCommentMutations } from "@/lib/hooks/comment/useCommentMutations";
import CommentInput from "./commentInput";
import Profile from "@/components/_common/profile";

interface CommentItemProps {
  comment: Comment;
  postId: string;
  onUpdate: () => void;
}

export default function CommentItem({
  comment,
  postId,
  onUpdate,
}: CommentItemProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [showReplyForm, setShowReplyForm] = useState(false);

  const isMyComment = isAuthenticated && user?.nickname === comment.nickname;

  // 들여쓰기 계산 (depth * 32px)
  const indentClass = comment.depth ? `ml-${comment.depth * 8}` : "";

  // 좋아요 훅
  const { likeCount, isLiked, isLiking, handleLike } = useCommentLike({
    postId,
    commentPath: comment.path,
    initialLikeCount: comment.likeCount,
    initialIsLiked: comment.isLiked,
  });

  // 삭제 훅
  const { deleteComment, isDeleting } = useCommentMutations({
    postId,
    onSuccess: onUpdate,
  });

  const handleDelete = () => {
    deleteComment({ commentPath: comment.path });
  };

  return (
    <>
      {comment.isDeleted ? (
        // 삭제된 댓글
        <div className="text-neutral-60 py-4 text-sm">삭제된 댓글입니다</div>
      ) : (
        <div className="mt-6 flex items-start gap-4">
          <Profile />

          <div className="w-full">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-neutral-20 font-medium">
                {comment.nickname}
              </span>

              {isMyComment && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-neutral-60 hover:text-system-alert flex items-center gap-1 text-sm transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  삭제
                </button>
              )}
            </div>

            {/* 댓글 내용 */}
            <p className="text-neutral-20 mb-2 text-sm leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>

            {/* 액션 버튼 */}
            <div className="text-neutral-60 flex items-center gap-4 text-sm">
              <span>{formatRelativeTime(comment.createdAt)}</span>
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center gap-1.5 transition-colors disabled:opacity-50 ${
                  isLiked
                    ? "text-primary-50"
                    : "text-neutral-60 hover:text-primary-50"
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                  strokeWidth={2}
                />
              </button>
              <span>{likeCount}</span>

              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-neutral-60 hover:text-primary-50 flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                답글 쓰기
              </button>
            </div>

            {/* 답글 작성 입력창 */}
            {showReplyForm && (
              <div className="mt-4">
                <CommentInput
                  postId={postId}
                  parentPath={comment.path}
                  siblingCount={comment.children?.length || 0}
                  onSuccess={() => {
                    setShowReplyForm(false);
                    onUpdate();
                  }}
                  onCancel={() => setShowReplyForm(false)}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 답글 렌더링 (재귀) */}
      {comment.children && comment.children.length > 0 && (
        <div className="mt-4 ml-14 space-y-4">
          {comment.children.map((childComment) => (
            <CommentItem
              key={childComment.path}
              comment={childComment}
              postId={postId}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </>
  );
}
