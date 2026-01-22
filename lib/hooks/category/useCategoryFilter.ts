import { useState, useCallback } from "react";
import {
  getCategoryNameById,
  getCategoryNamesByIds,
} from "@/lib/utils/category";

/**
 * 카테고리 필터 상태 관리 훅
 * - 1차/2차 카테고리 통합 관리
 * - UUID 기반 카테고리 관리 (ID만 저장)
 * - 메인페이지 필터 및 게시글 작성 셀렉터에서 사용
 */
export function useCategoryFilter(initialValues?: {
  primaryCategoryId?: string;
  secondaryCategoryIds?: string[];
}) {
  // 1차 카테고리 상태 (ID만 관리)
  const [primaryCategoryId, setPrimaryCategoryId] = useState<string>(
    initialValues?.primaryCategoryId || "all"
  );

  // 2차 카테고리 상태 (선택 중, ID만 관리)
  const [selectedSecondaryCategoryIds, setSelectedSecondaryCategoryIds] =
    useState<string[]>(initialValues?.secondaryCategoryIds || ["all"]);

  // 1차 카테고리 변경 핸들러
  const handlePrimaryCategoryChange = useCallback((categoryId: string) => {
    setPrimaryCategoryId(categoryId);
  }, []);

  // 2차 카테고리 변경 핸들러 (선택)
  const handleSecondaryCategoriesChange = useCallback(
    (categoryIds: string[]) => {
      setSelectedSecondaryCategoryIds(categoryIds);
    },
    []
  );

  // 초기화
  const reset = useCallback(() => {
    setPrimaryCategoryId("all");
    setSelectedSecondaryCategoryIds(["all"]);
  }, []);

  return {
    // 1차 카테고리
    primaryCategoryId,
    primaryCategory: getCategoryNameById(primaryCategoryId), // 계산된 값
    handlePrimaryCategoryChange,

    // 2차 카테고리 (선택 중)
    selectedSecondaryCategoryIds,
    selectedSecondaryCategories: getCategoryNamesByIds(
      selectedSecondaryCategoryIds
    ), // 계산된 값
    handleSecondaryCategoriesChange,

    // 유틸리티
    reset,
  };
}
