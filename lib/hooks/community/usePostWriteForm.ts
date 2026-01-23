import { useState, useEffect, useMemo } from "react";

/**
 * 게시글 작성/수정 폼 상태 관리 훅
 * - 카테고리, 제목, 본문, 이미지 상태 통합 관리
 * - 폼 유효성 검증 로직 포함
 * - 기존 게시글 데이터 초기화 지원
 */
export function usePostWriteForm(initialData?: {
  primaryCategoryId?: string;
  secondaryCategoryId?: string;
  title?: string;
  textContent?: string;
}) {
  // 카테고리 상태
  const [primaryCategoryId, setPrimaryCategoryId] = useState(
    initialData?.primaryCategoryId || ""
  );
  const [secondaryCategoryId, setSecondaryCategoryId] = useState(
    initialData?.secondaryCategoryId || ""
  );

  // 제목 및 본문 상태
  const [title, setTitle] = useState(initialData?.title || "");
  const [textContent, setTextContent] = useState(
    initialData?.textContent || ""
  );

  // 이미지 상태
  const [images, setImages] = useState<File[]>([]);

  // 기존 데이터로 폼 초기화 (수정 모드)
  useEffect(() => {
    if (initialData) {
      if (initialData.primaryCategoryId) {
        setPrimaryCategoryId(initialData.primaryCategoryId);
      }
      if (initialData.secondaryCategoryId) {
        setSecondaryCategoryId(initialData.secondaryCategoryId);
      }
      if (initialData.title) {
        setTitle(initialData.title);
      }
      if (initialData.textContent) {
        setTextContent(initialData.textContent);
      }
    }
  }, [initialData]);

  // 폼 유효성 검증
  const isFormValid = useMemo(
    () =>
      primaryCategoryId.trim() !== "" &&
      secondaryCategoryId.trim() !== "" &&
      title.trim() !== "" &&
      title.length <= 60 &&
      (textContent.trim() !== "" || images.length > 0),
    [primaryCategoryId, secondaryCategoryId, title, textContent, images]
  );

  // 폼 초기화
  const resetForm = () => {
    setPrimaryCategoryId("");
    setSecondaryCategoryId("");
    setTitle("");
    setTextContent("");
    setImages([]);
  };

  return {
    // 카테고리 상태
    primaryCategoryId,
    setPrimaryCategoryId,
    secondaryCategoryId,
    setSecondaryCategoryId,

    // 제목 및 본문 상태
    title,
    setTitle,
    textContent,
    setTextContent,

    // 이미지 상태
    images,
    setImages,

    // 유틸리티
    isFormValid,
    resetForm,
  };
}
