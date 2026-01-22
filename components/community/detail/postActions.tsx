"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { postApi } from "@/lib/api/client/post";
import { useAuthStore } from "@/lib/store/authStore";
import { showModal } from "@/lib/store/modalStore";

interface PostActionsProps {
  postId: string;
  authorId: string;
}

export default function PostActions({ postId, authorId }: PostActionsProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);

  // 본인 게시글 여부 확인
  const isAuthor = user?.id === authorId;

  if (!isAuthor) {
    return null;
  }

  const handleEdit = () => {
    router.push(`/community/write/edit/${postId}`);
  };

  const handleDelete = async () => {
    showModal({
      title: "게시글을 삭제하시겠습니까?",
      description: "삭제된 게시글은 복구할 수 없습니다.",
      type: "two-button",
      buttonText: "삭제",
      onConfirm: confirmDelete,
    });
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await postApi.deletePost(postId);
      showModal({
        description: "게시글이 성공적으로 삭제되었습니다.",
        type: "snackbar",
      });
      router.back(); // 이전 페이지로 이동
    } catch (error) {
      showModal({
        title: "게시글 삭제 실패",
        description: "게시글 삭제 중 오류가 발생했습니다. 다시 시도해주세요.",
        type: "one-button",
        buttonText: "확인",
      });
    } finally {
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
