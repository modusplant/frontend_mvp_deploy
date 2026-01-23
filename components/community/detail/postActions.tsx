"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { postApi } from "@/lib/api/post";
import { useAuthStore } from "@/lib/store/authStore";

interface PostActionsProps {
  postId: string;
  authorUuid: string;
}

export default function PostActions({ postId, authorUuid }: PostActionsProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);

  // 본인 게시글 여부 확인
  // const isAuthor = user?.uuid === authorUuid;
  const isAuthor = true; // TODO: 인증 로직 완성 후 수정

  if (!isAuthor) {
    return null;
  }

  const handleEdit = () => {
    router.push(`/community/write/edit/${postId}`);
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "정말 삭제하시겠습니까?\n삭제된 게시글은 복구할 수 없습니다."
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      await postApi.deletePost(postId);
      window.alert("게시글이 삭제되었습니다.");
      router.back(); // 이전 페이지로 이동
    } catch (error) {
      window.alert("게시글 삭제에 실패했습니다.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="ml-4 flex items-center gap-2">
      <button
        onClick={handleEdit}
        className="border-neutral-90 text-neutral-20 hover:bg-surface-98 rounded-lg border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors"
      >
        수정
      </button>

      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="border-neutral-90 text-neutral-20 hover:bg-surface-98 rounded-lg border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors"
      >
        {isDeleting ? "삭제 중..." : "삭제"}
      </button>
    </div>
  );
}
