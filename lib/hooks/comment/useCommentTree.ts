import { useMemo } from "react";
import { Comment } from "@/lib/types/comment";
import { buildCommentTree } from "@/lib/utils/parseComments";

interface UseCommentTreeProps {
  comments: Comment[];
}

interface UseCommentTreeReturn {
  commentTree: Comment[];
  totalCount: number;
}

export function useCommentTree({
  comments,
}: UseCommentTreeProps): UseCommentTreeReturn {
  const commentTree = useMemo(() => {
    return buildCommentTree(comments);
  }, [comments]);

  const totalCount = comments.length;

  return {
    commentTree,
    totalCount,
  };
}
