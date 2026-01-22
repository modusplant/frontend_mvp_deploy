"use client";

import Image from "next/image";
import Link from "next/link";
import { PostData } from "@/lib/types/post";
import Badge from "@/components/_common/badge";
import { secondaryCategoryLabels } from "@/lib/constants/categories";
import { getThumbnail, getExcerpt, formatPostDate } from "@/lib/utils/post";
import { Bookmark, Heart, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils/tailwindHelper";

export interface PostListItemProps {
  post: PostData;
}

/**
 * 게시글 리스트 아이템 컴포넌트
 * - 왼쪽: 게시글 정보 (카테고리, 제목, 본문 일부)
 * - 오른쪽: 썸네일 이미지
 * - 하단: 메타 정보 (카테고리, 좋아요, 댓글, 북마크, 날짜)
 */
export default function PostListItem({ post }: PostListItemProps) {
  // 썸네일 이미지 (content에서 추출)
  const thumbnail = getThumbnail(post);

  // 본문 요약 (content에서 추출)
  const excerpt = getExcerpt(post);

  // 날짜 포맷팅
  const formattedDate = formatPostDate(post.publishedAt);

  return (
    <Link
      href={`/community/${post.postId}`}
      className="group flex items-center gap-6 py-0.5"
    >
      {/* 왼쪽: 콘텐츠 영역 */}
      <div className="flex flex-1 flex-col gap-2">
        {/* 카테고리 배지 + 제목 + 본문 영역 */}
        <div className="flex flex-col gap-2">
          {/* 2차 카테고리 배지 */}
          <div>
            <Badge
              variant="outline"
              size="md"
              className="bg-surface-98 font-medium"
            >
              {secondaryCategoryLabels[post.secondaryCategory] ||
                post.secondaryCategory}
            </Badge>
          </div>

          {/* 제목 + 본문 영역 */}
          <div className="flex flex-col gap-1.5">
            {/* 제목 */}
            <h3 className="text-neutral-20 group-hover:text-primary-50 line-clamp-1 text-[15px] leading-[1.2] font-medium tracking-[-0.01em]">
              {post.title}
            </h3>

            {/* 본문 일부 (말줄임표, 최대 2줄) */}
            {excerpt && (
              <p className="text-neutral-40 line-clamp-2 max-w-3xl text-sm leading-normal tracking-[-0.03em]">
                {excerpt}
              </p>
            )}
          </div>
        </div>

        {/* 메타 정보 */}
        <div className="text-neutral-60 flex items-center gap-2 text-xs leading-[1.2] tracking-[-0.02em]">
          {/* 1차 카테고리 */}
          <span>{post.primaryCategory}</span>

          {/* 좋아요 */}
          <span className="flex items-center gap-1">
            <Heart
              className="h-4 w-4"
              color={post.isLiked ? "red" : "currentColor"}
              fill={post.isLiked ? "red" : "none"}
            />
            <span>{post.likeCount}</span>
          </span>

          {/* 댓글 */}
          <span className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{post.commentCount}</span>
          </span>

          {/* 북마크 */}
          <Bookmark
            fill={post.isBookmarked ? "currentColor" : "none"}
            className={cn(
              "h-[17px] w-[17px]",
              post.isBookmarked ? "text-primary-50" : "text-neutral-60"
            )}
          />

          {/* 날짜 */}
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* 오른쪽: 썸네일 이미지 */}
      {thumbnail && (
        <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-lg">
          <Image
            src={thumbnail}
            alt={post.title}
            fill
            className="object-cover"
            sizes="100px"
          />
        </div>
      )}
    </Link>
  );
}
