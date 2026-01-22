"use client";

import { PostDetail as PostDetailType } from "@/lib/types/post";
import PostContent from "./postContent";
import PostActions from "./postActions";
import CommentSection from "../../comment/commentSection";
import { formatRelativeTime } from "@/lib/utils/formatTime";
import { Heart, Bookmark } from "lucide-react";
import { usePostInteraction } from "@/lib/hooks/community/usePostInteraction";
import usePostDetailQuery from "@/lib/hooks/community/usePostDetailQuery";
interface PostDetailProps {
  postId: string;
}

export default function PostDetail({ postId }: PostDetailProps) {
  const { data: postQuery, isLoading, error } = usePostDetailQuery({ postId });

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
    initialLikeCount: postQuery?.likeCount,
    initialIsLiked: postQuery?.isLiked,
    initialIsBookmarked: postQuery?.isBookmarked,
  });

  if (isLoading) {
    return <div className="mx-auto max-w-[1320px] px-5 py-12">로딩 중...</div>;
  }

  if (error || !postQuery) {
    return (
      <div className="mx-auto max-w-[1320px] px-5 py-12">
        게시글을 불러오는데 실패했습니다.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1320px] px-5 py-12">
      {/* 헤더: 카테고리 + 작성자 정보 */}
      <div className="mb-6 flex items-center gap-3">
        <span className="bg-primary-10 text-primary-50 rounded-full px-4 py-1.5 text-sm font-semibold">
          {postQuery.primaryCategory} &gt; {postQuery.secondaryCategory}
        </span>
      </div>

      {/* 제목 */}
      <h1 className="font-nanum text-neutral-0 mb-2 text-[44px] leading-tight font-bold">
        {postQuery.title}
      </h1>

      <div className="mb-8 flex items-center gap-2">
        {/* 작성자 */}
        <span className="text-neutral-20 text-sm font-medium">
          {postQuery.nickname}
        </span>
        {/* 작성일 */}
        <span className="text-neutral-60 text-sm">
          {formatRelativeTime(postQuery.publishedAt)}
        </span>
        {/* 조회수 */}
        <div className="text-neutral-60 flex items-center gap-1.5 text-sm">
          <span>조회 {postQuery.viewCount.toLocaleString()}</span>
        </div>
      </div>

      {/* 본문 */}
      <PostContent content={postQuery.content} />

      {/* 액션 버튼 */}
      <div className="mt-12 flex items-center justify-between pt-6">
        <div className="text-neutral-60 flex w-full items-center justify-between gap-6 text-lg">
          {/* 좋아요 */}
          <button
            onClick={handleLike}
            disabled={isLiking}
            className="group flex cursor-pointer gap-1.5"
          >
            <Heart
              className={`h-6 w-6 transition-all ${isLiked ? "" : "group-hover:fill-neutral-90"}`}
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
              className={`h-6 w-6 transition-all ${isBookmarked ? "" : "group-hover:fill-neutral-90"}`}
              fill={isBookmarked ? "#3a972e" : "none"}
              color={isBookmarked ? "#3a972e" : "#919191"}
            />
          </button>
        </div>

        {/* 수정/삭제 버튼 (작성자만) */}
        <PostActions postId={postId} authorId={postQuery.authorId} />
      </div>

      {/* 댓글 섹션 */}
      <CommentSection postId={postId} />
    </div>
  );
}
