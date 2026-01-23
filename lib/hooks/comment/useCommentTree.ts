import { useMemo } from "react";
import { Comment } from "@/lib/types/comment";
import { buildCommentTree } from "@/lib/utils/parseComments";

interface UseCommentTreeProps {
  comments: Comment[];
}

interface UseCommentTreeReturn {
  commentTree: Comment[];
  totalCount: number;
  rootCount: number; // 최상위 댓글 개수
}

export function useCommentTree({
  comments,
}: UseCommentTreeProps): UseCommentTreeReturn {
  const commentTree = useMemo(() => {
    return buildCommentTree(comments);
  }, [comments]);

  const totalCount = comments.length;
  const rootCount = commentTree.length; // 최상위 댓글 개수

  return {
    commentTree,
    totalCount,
    rootCount,
  };
}
