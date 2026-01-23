"use client";

import { cn } from "@/lib/utils/tailwindHelper";
import { ChevronDown } from "lucide-react";
import { PRIMARY_CATEGORIES, type Category } from "@/lib/constants/categories";
import { useDropdownState } from "@/lib/hooks/category/useDropdownState";

export interface PrimaryCategoryFilterProps {
  selectedCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
  variant?: "filter" | "selector";
  showAll?: boolean;
  className?: string;
}

/**
 * 1차 카테고리 필터/셀렉터 (커스텀 드롭다운)
 * - variant="filter": 메인페이지 필터 (둥근 pill, "전체" 포함)
 * - variant="selector": 게시글 작성 셀렉터 (일반 rounded, "전체" 제외)
 */
export default function PrimaryCategoryFilter({
  selectedCategoryId,
  onCategoryChange,
  variant = "filter",
  showAll = true,
  className,
}: PrimaryCategoryFilterProps) {
  const { isOpen, dropdownRef, toggle, close } = useDropdownState();

  const categories: Category[] = showAll
    ? [{ id: "all", name: "전체" }, ...PRIMARY_CATEGORIES]
    : PRIMARY_CATEGORIES;

  const handleSelect = (category: Category) => {
    onCategoryChange(category.id);
    close();
  };

  const isSelector = variant === "selector";
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const displayText = selectedCategory?.name ?? "주제를 선택해주세요(필수)";

  return (
    <div
      ref={dropdownRef}
      className={cn("relative inline-block w-full md:w-auto", className)}
    >
      {/* 드롭다운 버튼 */}
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "border-surface-stroke flex items-center justify-between border bg-neutral-100",
          "hover:border-primary-50 focus:border-primary-50 focus:ring-primary-10 focus:ring-2 focus:outline-none",
          "cursor-pointer",
          isOpen && "border-primary-50 ring-primary-10 ring-2",
          {
            // filter 스타일 (메인페이지)
            "text-neutral-0 w-40 rounded-full px-4 py-3 text-sm font-medium":
              !isSelector,
            // selector 스타일 (게시글 작성)
            "h-11 w-60 rounded-lg px-4.5 py-2.5": isSelector,
          }
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span
          className={cn({
            "text-[15px] leading-normal font-medium tracking-[-0.01em]":
              isSelector,
            "text-neutral-20": isSelector && selectedCategory,
            "text-neutral-60": isSelector && !selectedCategory,
          })}
        >
          {displayText}
        </span>
        <ChevronDown
          className={cn("transition-transform", isOpen && "rotate-180", {
            "text-neutral-60 ml-2 h-4 w-4 md:h-5 md:w-5": !isSelector,
            "text-neutral-70 h-3.5 w-3.5": isSelector,
          })}
        />
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div
          className={cn(
            "border-surface-stroke absolute z-50 mt-2 border bg-neutral-100 shadow-lg",
            {
              "rounded-lg p-1.5": !isSelector,
              "top-12 left-0 w-60 rounded-lg": isSelector,
            }
          )}
          role="listbox"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleSelect(category)}
              className={cn(
                "hover:bg-surface-98 w-full text-left transition-colors",
                {
                  // filter 스타일
                  "text-neutral-0 rounded-lg px-5 py-2.5 text-sm font-medium md:px-4 md:py-3":
                    !isSelector,
                  "bg-primary-90 text-primary-50 font-semibold":
                    !isSelector && selectedCategoryId === category.id,
                  // selector 스타일
                  "text-neutral-20 px-4 py-2.5 text-[15px] leading-normal font-medium tracking-[-0.01em]":
                    isSelector,
                }
              )}
              role="option"
              aria-selected={selectedCategoryId === category.id}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
