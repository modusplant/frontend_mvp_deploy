"use client";

import { useState, useEffect } from "react";
import { useCommentMutations } from "@/lib/hooks/comment/useCommentMutations";
import ProfileImage from "@/components/_common/profileImage";
import { useAuthStore } from "@/lib/store/authStore";
import { ArrowUp } from "lucide-react";

interface CommentInputProps {
  postId: string;
  parentPath?: string | null; // 답글인 경우 부모 path
  onSuccess: () => void;
  onCancel?: () => void;
  currentCommentCount?: number; // 현재 댓글 개수 (최상위 댓글용)
  siblingCount?: number; // 형제 댓글 개수 (답글용)
}

export default function CommentInput({
  postId,
  parentPath = null,
  onSuccess,
  onCancel,
  currentCommentCount = 0,
  siblingCount = 0,
}: CommentInputProps) {
  const { user } = useAuthStore();
  const [content, setContent] = useState("");

  const { createComment, isCreating } = useCommentMutations({
    postId,
    onSuccess: () => {
      setContent("");
      onSuccess();
      onCancel?.();
    },
  });

  // 페이지 이탈 경고
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (content.trim().length > 0) {
        e.preventDefault();
        e.returnValue = ""; // Chrome에서 필요
        window.alert("작성 중인 댓글이 있습니다. 페이지를 떠나시겠습니까?");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createComment({
      parentPath,
      currentCommentCount,
      siblingCount,
      content,
    });
  };

  return (
    <div className="flex items-center gap-3">
      {/* 사용자 아이콘 */}
      <div className="relative h-7.5 w-7.5">
        <ProfileImage imageSrc={user?.image || null} />
      </div>
      <form onSubmit={handleSubmit} className="relative h-11 w-full">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={parentPath ? "답글 작성하기" : "댓글 작성하기"}
          className="border-neutral-90 text-neutral-20 placeholder:text-neutral-60 focus:border-primary-50 h-full w-full resize-none rounded-lg border px-4 py-3 pr-14 text-base leading-relaxed focus:outline-none"
          disabled={isCreating}
        />
        {/* 전송 버튼 */}
        <button
          type="submit"
          disabled={isCreating || content.trim().length === 0}
          className={`absolute top-1/2 right-2 flex h-6.5 w-6.5 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-200 ${
            content.trim().length === 0
              ? "bg-surface-98 cursor-not-allowed"
              : "bg-primary-50 hover:bg-primary-70 active:scale-95"
          }`}
          aria-label="댓글 전송"
        >
          <ArrowUp
            className={`h-4 w-4 ${
              content.trim().length === 0
                ? "text-neutral-70"
                : "text-neutral-100"
            }`}
            strokeWidth={2.5}
          />
        </button>
      </form>
    </div>
  );
}
