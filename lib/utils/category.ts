import {
  PRIMARY_CATEGORIES,
  SECONDARY_CATEGORIES,
  type Category,
} from "@/lib/constants/categories";

/**
 * 카테고리 ID로 이름 조회
 */
export function getCategoryNameById(categoryId: string): string {
  // "전체" 처리
  if (categoryId === "all") {
    return "전체";
  }

  // 1차 카테고리에서 검색
  const primaryCategory = PRIMARY_CATEGORIES.find((c) => c.id === categoryId);
  if (primaryCategory) {
    return primaryCategory.name;
  }

  // 2차 카테고리에서 검색
  for (const categories of Object.values(SECONDARY_CATEGORIES)) {
    const secondaryCategory = categories.find((c) => c.id === categoryId);
    if (secondaryCategory) {
      return secondaryCategory.name;
    }
  }

  return "";
}

/**
 * 여러 카테고리 ID로 이름 배열 조회
 */
export function getCategoryNamesByIds(categoryIds: string[]): string[] {
  return categoryIds.map((id) => getCategoryNameById(id));
}

/**
 * 카테고리 이름으로 ID 조회
 */
export function getCategoryIdByName(categoryName: string): string {
  // "전체" 처리
  if (categoryName === "전체") {
    return "all";
  }

  // 1차 카테고리에서 검색
  const primaryCategory = PRIMARY_CATEGORIES.find(
    (c) => c.name === categoryName
  );
  if (primaryCategory) {
    return primaryCategory.id;
  }

  // 2차 카테고리에서 검색
  for (const categories of Object.values(SECONDARY_CATEGORIES)) {
    const secondaryCategory = categories.find((c) => c.name === categoryName);
    if (secondaryCategory) {
      return secondaryCategory.id;
    }
  }

  return "";
}
