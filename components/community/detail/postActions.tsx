"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, Bookmark, EllipsisVertical } from "lucide-react";
import { postApi } from "@/lib/api/client/post";
import { useAuthStore } from "@/lib/store/authStore";
import { showModal } from "@/lib/store/modalStore";
import { usePostInteraction } from "@/lib/hooks/community/usePostInteraction";

interface PostActionsProps {
  postId: string;
  authorId: string;
  initialLikeCount?: number;
  initialIsLiked?: boolean;
  initialIsBookmarked?: boolean;
}

export default function PostActions({
  postId,
  authorId,
  initialLikeCount,
  initialIsLiked,
  initialIsBookmarked,
}: PostActionsProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    likeCount,
    isLiked,
    isLiking,
    handleLike,
    isBookmarked,
    isBookmarking,
    handleBookmark,
  } = usePostInteraction({
    postId,
    initialLikeCount,
    initialIsLiked,
    initialIsBookmarked,
  });

  // 본인 게시글 여부 확인
  const isAuthor = user?.id === authorId;

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

  const handleEdit = () => {
    setIsDropdownOpen(false);
    router.push(`/community/write/edit/${postId}`);
  };

  const handleDelete = async () => {
    setIsDropdownOpen(false);
    showModal({
      title: "게시글을 삭제하시겠습니까?",
      description: "삭제된 게시글은 복구할 수 없습니다.",
      type: "two-button",
      buttonText: "삭제",
      onConfirm: confirmDelete,
    });
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await postApi.deletePost(postId);
      showModal({
        description: "게시글이 성공적으로 삭제되었습니다.",
        type: "snackbar",
      });
      router.back(); // 이전 페이지로 이동
    } catch (error) {
      showModal({
        title: "게시글 삭제 실패",
        description: "게시글 삭제 중 오류가 발생했습니다. 다시 시도해주세요.",
        type: "one-button",
        buttonText: "확인",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-between">
      {/* 좋아요/북마크 버튼 */}
      <div className="text-neutral-60 flex w-full items-center justify-between text-lg">
        {/* 좋아요 */}
        <button
          onClick={handleLike}
          disabled={isLiking}
          className="group flex cursor-pointer gap-1.5"
        >
          <Heart
            className={`h-6 w-6 transition-all ${
              isLiked ? "" : "group-hover:fill-neutral-90"
            }`}
            color={isLiked ? "red" : "#919191"}
            fill={isLiked ? "red" : "none"}
          />
          <span>{likeCount.toLocaleString()}</span>
        </button>
        {/* 북마크 */}
        <button
          onClick={handleBookmark}
          disabled={isBookmarking}
          className="group flex cursor-pointer gap-1.5"
        >
          <Bookmark
            className={`h-6 w-6 transition-all ${
              isBookmarked ? "" : "group-hover:fill-neutral-90"
            }`}
            fill={isBookmarked ? "#3a972e" : "none"}
            color={isBookmarked ? "#3a972e" : "#919191"}
          />
        </button>
      </div>

      {/* 수정/삭제 버튼 (작성자만) */}
      {isAuthor && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full"
            aria-label="게시글 옵션"
          >
            <EllipsisVertical className="text-neutral-60 h-5 w-5" />
          </button>

          {/* 드롭다운 메뉴 */}
          {isDropdownOpen && (
            <div className="border-surface-99 absolute top-12 right-0 z-50 w-24 rounded-lg border bg-neutral-100 text-sm font-medium shadow-sm">
              <button
                onClick={handleEdit}
                className="text-neutral-20 hover:bg-surface-98 w-full cursor-pointer px-4 py-3 first:rounded-t-lg"
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-neutral-20 hover:bg-surface-98 w-full cursor-pointer px-4 py-3 last:rounded-b-lg"
              >
                삭제
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
