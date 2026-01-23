"use client";

import PostContent from "./postContent";
import PostActions from "./postActions";
import CommentSection from "../../comment/commentSection";
import PostDetailHeader from "./postDetailHeader";
import usePostDetailQuery from "@/lib/hooks/community/usePostDetailQuery";
interface PostDetailProps {
  postId: string;
}

export default function PostDetail({ postId }: PostDetailProps) {
  const { data: postQuery, isLoading, error } = usePostDetailQuery({ postId });

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
      <PostDetailHeader
        secondaryCategory={postQuery.secondaryCategory}
        title={postQuery.title}
        nickname={postQuery.nickname}
        publishedAt={postQuery.publishedAt}
        viewCount={postQuery.viewCount}
        isUpdated={postQuery.publishedAt !== postQuery.updatedAt}
      />

      {/* 본문 */}
      <PostContent content={postQuery.content} />

      {/* 액션 버튼 */}
      <div className="mt-12 pt-6">
        <PostActions
          postId={postId}
          authorId={postQuery.authorId}
          initialLikeCount={postQuery.likeCount}
          initialIsLiked={postQuery.isLiked}
          initialIsBookmarked={postQuery.isBookmarked}
        />
      </div>

      {/* 댓글 섹션 */}
      <CommentSection postId={postId} />
    </div>
  );
}
