"use client";

import { useState, useRef, useEffect } from "react";
import { Comment } from "@/lib/types/comment";
import { useAuthStore } from "@/lib/store/authStore";
import { formatPostDate } from "@/lib/utils/post";
import { Heart, MessageSquare, EllipsisVertical } from "lucide-react";
import { useCommentLike } from "@/lib/hooks/comment/useCommentLike";
import { useCommentMutations } from "@/lib/hooks/comment/useCommentMutations";
import CommentInput from "./commentInput";
import ProfileImage from "@/components/_common/profileImage";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleDelete = () => {
    setIsDropdownOpen(false);
    deleteComment({ commentPath: comment.path });
  };

  return (
    <>
      {comment.isDeleted ? (
        // 삭제된 댓글
        <div className="text-neutral-60 py-4 text-sm">삭제된 댓글입니다</div>
      ) : (
        <div className="mt-6 flex gap-4">
          <div className="relative h-7.5 w-7.5">
            <ProfileImage imageSrc={comment.image} />
          </div>

          <div className="w-full">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-neutral-10 text-[17px] font-semibold">
                {comment.nickname}
              </span>

              {isMyComment && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full"
                    aria-label="댓글 옵션"
                  >
                    <EllipsisVertical className="text-neutral-60 h-4 w-4" />
                  </button>

                  {/* 드롭다운 메뉴 */}
                  {isDropdownOpen && (
                    <div className="border-surface-99 absolute top-8 right-2 z-50 w-24 rounded-lg border bg-neutral-100 text-sm font-medium shadow-sm">
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="text-neutral-20 hover:bg-surface-98 w-full cursor-pointer rounded-lg px-4 py-2.5"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 댓글 내용 */}
            <p className="text-neutral-20 mb-2 text-[16px] leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>

            {/* 액션 버튼 */}
            <div className="text-neutral-60 flex items-center gap-4 text-sm">
              <span>{formatPostDate(comment.createdAt)}</span>
              <button
                onClick={handleLike}
                disabled={isLiking}
                className="group flex cursor-pointer gap-1"
              >
                <Heart
                  className={`h-4 w-4 transition-all ${
                    isLiked ? "" : "group-hover:fill-neutral-90"
                  }`}
                  color={isLiked ? "red" : "#919191"}
                  fill={isLiked ? "red" : "none"}
                />
                <span>{likeCount}</span>
              </button>

              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-neutral-60 hover:text-primary-50 flex items-center gap-1 transition-colors"
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
