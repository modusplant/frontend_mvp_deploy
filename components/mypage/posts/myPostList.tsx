"use client";

import { useMyPostsQuery } from "@/lib/hooks/mypage/useMyPostsQuery";
import EmptyMyPosts from "./emptyMyPosts";
import PostList from "@/components/mypage/common/postList";

/**
 * 내가 쓴 게시글 목록 컴포넌트
 */
export default function MyPostList() {
  return (
    <PostList
      useQueryHook={useMyPostsQuery}
      emptyComponent={<EmptyMyPosts />}
    />
  );
}
