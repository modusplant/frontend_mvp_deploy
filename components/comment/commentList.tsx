"use client";

import { Comment } from "@/lib/types/comment";
import CommentItem from "./commentItem";

interface CommentListProps {
  comments: Comment[];
  postId: string;
  onUpdate: () => void;
}

export default function CommentList({
  comments,
  postId,
  onUpdate,
}: CommentListProps) {
  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem
          key={comment.path}
          comment={comment}
          postId={postId}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
