"use client";

import { useRecentPostsQuery } from "@/lib/hooks/mypage/useRecentPostsQuery";
import EmptyRecentPosts from "./emptyRecentPosts";
import PostList from "@/components/mypage/common/postList";

/**
 * 최근에 본 게시글 리스트 섹션
 */
export default function RecentPostList() {
  return (
    <PostList
      useQueryHook={useRecentPostsQuery}
      emptyComponent={<EmptyRecentPosts />}
    />
  );
}
