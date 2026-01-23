"use client";

import PrimaryCategoryFilter from "@/components/_common/primaryCategoryFilter";
import SecondaryCategoryFilter from "@/components/_common/secondaryCategoryFilter";

interface CategorySelectorProps {
  primaryCategoryId: string;
  secondaryCategoryId: string;
  onPrimaryCategoryChange: (categoryId: string) => void;
  onSecondaryCategoryChange: (categoryId: string) => void;
}

/**
 * 게시글 작성 페이지 카테고리 셀렉터
 * - 기존 PrimaryCategoryFilter와 SecondaryCategoryFilter 재사용
 * - variant="selector"로 게시글 작성용 스타일 적용
 */
export default function CategorySelector({
  primaryCategoryId,
  secondaryCategoryId,
  onPrimaryCategoryChange,
  onSecondaryCategoryChange,
}: CategorySelectorProps) {
  const handlePrimaryChange = (categoryId: string) => {
    onPrimaryCategoryChange(categoryId);
    // 1차 변경 시 2차 초기화
    onSecondaryCategoryChange("");
  };

  const handleSecondaryChange = (categoryIds: string[]) => {
    onSecondaryCategoryChange(categoryIds[0] || "");
  };

  return (
    <div className="flex items-center gap-2.5">
      <PrimaryCategoryFilter
        selectedCategoryId={primaryCategoryId}
        onCategoryChange={handlePrimaryChange}
        variant="selector"
        showAll={false}
      />

      <SecondaryCategoryFilter
        primaryCategoryId={primaryCategoryId}
        selectedCategoryIds={secondaryCategoryId ? [secondaryCategoryId] : []}
        onCategoriesChange={handleSecondaryChange}
        variant="selector"
        multiSelect={false}
        showAll={false}
      />
    </div>
  );
}
