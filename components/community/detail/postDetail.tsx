"use client";

import { useRouter } from "next/navigation";
import { PostDetail as PostDetailType } from "@/lib/types/post";
import PostContent from "./postContent";
import PostActions from "./postActions";
import CommentSection from "../../comment/commentSection";
import { formatRelativeTime } from "@/lib/utils/formatTime";
import {
  primaryCategoryLabels,
  secondaryCategoryLabels,
} from "@/lib/constants/categories";
import { Heart, Bookmark } from "lucide-react";
import { usePostInteraction } from "@/lib/hooks/community/usePostInteraction";

interface PostDetailProps {
  postId: string;
  initialData: PostDetailType;
}

export default function PostDetail({ postId, initialData }: PostDetailProps) {
  const router = useRouter();

  const getCategoryLabel = (
    category: string,
    type: "primary" | "secondary"
  ) => {
    if (type === "primary") {
      return primaryCategoryLabels[category] || category;
    }
    return secondaryCategoryLabels[category] || category;
  };

  const {
    likeCount,
    isLiked,
    isLiking,
    handleLike,
    bookmarkCount,
    isBookmarked,
    isBookmarking,
    handleBookmark,
  } = usePostInteraction({
    postId,
    initialLikeCount: initialData.likeCount,
    initialBookmarkCount: initialData.bookmarkCount,
    initialIsLiked: initialData.isLiked,
    initialIsBookmarked: initialData.isBookmarked,
  });

  return (
    <div className="mx-auto max-w-[1320px] px-5 py-12">
      {/* 헤더: 카테고리 + 작성자 정보 */}
      <div className="mb-6 flex items-center gap-3">
        <span className="bg-primary-10 text-primary-50 rounded-full px-4 py-1.5 text-sm font-semibold">
          {getCategoryLabel(initialData.primaryCategory, "primary")} &gt;{" "}
          {getCategoryLabel(initialData.secondaryCategory, "secondary")}
        </span>
      </div>

      {/* 제목 */}
      <h1 className="font-nanum text-neutral-0 mb-2 text-[44px] leading-tight font-bold">
        {initialData.title}
      </h1>

      <div className="mb-8 flex items-center gap-2">
        {/* 작성자 */}
        <span className="text-neutral-20 text-sm font-medium">
          {initialData.authorNickname}
        </span>
        {/* 작성일 */}
        <span className="text-neutral-60 text-sm">
          {formatRelativeTime(initialData.createdAt)}
        </span>
        {/* 조회수 */}
        <div className="text-neutral-60 flex items-center gap-1.5 text-sm">
          <span>조회 {initialData.viewCount.toLocaleString()}</span>
        </div>
      </div>

      {/* 본문 */}
      <PostContent content={initialData.content} />

      {/* 액션 버튼 */}
      <div className="mt-12 flex items-center justify-between pt-6">
        <div className="text-neutral-60 flex w-full items-center justify-between gap-6 text-lg">
          {/* 좋아요 */}
          <button
            onClick={handleLike}
            disabled={isLiking}
            className="flex cursor-pointer gap-1.5"
          >
            <Heart
              className={`h-6 w-6 ${
                isLiked ? "text-primary-50" : "text-neutral-60"
              }`}
            />
            <span>{likeCount.toLocaleString()}</span>
          </button>
          {/* 북마크 */}
          <button
            onClick={handleBookmark}
            disabled={isBookmarking}
            className="flex cursor-pointer gap-1.5"
          >
            <Bookmark
              className={`h-6 w-6 ${
                isBookmarked ? "text-primary-50" : "text-neutral-60"
              }`}
            />
          </button>
        </div>

        {/* 수정/삭제 버튼 (작성자만) */}
        <PostActions postId={postId} authorUuid={initialData.authorUuid} />
      </div>

      {/* 댓글 섹션 */}
      <CommentSection postId={postId} />
    </div>
  );
}
