"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import PostWriteHeader from "@/components/community/write/postWriteHeader";
import CategorySelector from "@/components/community/write/categorySelector";
import TitleInput from "@/components/community/write/titleInput";
import ContentEditor from "@/components/community/write/contentEditor";
import PostWriteActions from "@/components/community/write/postWriteActions";
import usePostWrite from "@/lib/hooks/community/usePostWrite";
import { usePostWriteForm } from "@/lib/hooks/community/usePostWriteForm";
import { postApi } from "@/lib/api/post";

export default function PostWritePage() {
  const params = useParams();
  const mode = params.mode as string[] | undefined;

  // 수정 모드 확인 (URL: /community/write/edit/[postId])
  const isEditMode = mode?.[0] === "edit";
  const postId = isEditMode ? mode[1] : undefined;

  // 수정 모드일 경우 기존 데이터 로드
  const { data: existingPost } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => postApi.getPostDetail(postId!),
    enabled: isEditMode && !!postId,
  });

  // 기존 게시글 데이터 가공
  const initialData = useMemo(() => {
    if (!existingPost?.data) return undefined;

    const post = existingPost.data;
    // 텍스트 콘텐츠 추출
    const textParts = post.content
      .filter((c) => c.type === "text")
      .map((c) => c.data)
      .join("\n\n");

    return {
      // TODO: API 응답에서 UUID를 가져와야 함
      primaryCategoryId: post.primaryCategory, // API에서 ID로 제공되어야 함
      secondaryCategoryId: post.secondaryCategory, // API에서 ID로 제공되어야 함
      title: post.title,
      textContent: textParts,
    };
  }, [existingPost]);

  // 폼 상태 관리 훅
  const {
    primaryCategoryId,
    setPrimaryCategoryId,
    secondaryCategoryId,
    setSecondaryCategoryId,
    title,
    setTitle,
    textContent,
    setTextContent,
    images,
    setImages,
    isFormValid,
  } = usePostWriteForm(initialData);

  // 게시글 제출 훅
  const {
    isEditMode: hookIsEditMode,
    isSubmitting,
    handleSubmit,
  } = usePostWrite(postId);

  // 제출 핸들러
  const onSubmit = () => {
    if (!isFormValid || isSubmitting) return;

    handleSubmit({
      primaryCategoryId,
      secondaryCategoryId,
      title: title.trim(),
      textContent: textContent.trim(),
      images,
    });
  };

  return (
    <div className="mx-auto flex min-h-screen w-[848px] flex-col gap-5 bg-neutral-100 px-10 py-5">
      {/* 헤더 */}
      <PostWriteHeader isEditMode={hookIsEditMode} />

      {/* 메인 폼 */}
      <div className="flex flex-col gap-4 self-stretch">
        {/* 카테고리 선택 */}
        <CategorySelector
          primaryCategoryId={primaryCategoryId}
          secondaryCategoryId={secondaryCategoryId}
          onPrimaryCategoryChange={setPrimaryCategoryId}
          onSecondaryCategoryChange={setSecondaryCategoryId}
        />

        {/* 제목 입력 */}
        <TitleInput value={title} onChange={setTitle} />

        {/* 본문 에디터 */}
        <ContentEditor
          textContent={textContent}
          images={images}
          onTextChange={setTextContent}
          onImagesChange={setImages}
        />

        {/* 액션 버튼 */}
        <PostWriteActions
          isSubmitting={isSubmitting}
          isFormValid={isFormValid}
          onSubmit={onSubmit}
          isEditMode={hookIsEditMode}
        />
      </div>
    </div>
  );
}
