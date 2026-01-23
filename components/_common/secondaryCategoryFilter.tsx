"use client";

import { useEffect } from "react";
import {
  SECONDARY_CATEGORIES,
  type Category,
} from "@/lib/constants/categories";
import { cn } from "@/lib/utils/tailwindHelper";
import { ChevronDown } from "lucide-react";
import { useDropdownState } from "@/lib/hooks/category/useDropdownState";
import { getCategoryNameById } from "@/lib/utils/category";

export interface SecondaryCategoryFilterProps {
  primaryCategoryId: string;
  selectedCategoryIds: string[];
  onCategoriesChange: (categoryIds: string[]) => void;
  variant?: "filter" | "selector";
  multiSelect?: boolean;
  showAll?: boolean;
  className?: string;
}

/**
 * 2차 카테고리 필터/셀렉터 (커스텀 드롭다운)
 * - variant="filter": 메인페이지 필터 (복수 선택, 칩 형태, 저장 버튼)
 * - variant="selector": 게시글 작성 셀렉터 (단일 선택, 드롭다운)
 */
export default function SecondaryCategoryFilter({
  primaryCategoryId,
  selectedCategoryIds,
  onCategoriesChange,
  variant = "filter",
  multiSelect = true,
  showAll = true,
  className,
}: SecondaryCategoryFilterProps) {
  const { isOpen, dropdownRef, toggle, close } = useDropdownState();
  const isSelector = variant === "selector";

  // 1차 카테고리에 따른 2차 카테고리 옵션
  const getSecondaryCategoryOptions = (): Category[] => {
    const primaryCategoryName = getCategoryNameById(primaryCategoryId);
    const options = SECONDARY_CATEGORIES[primaryCategoryName] || [];
    if (showAll && variant === "filter") {
      return [{ id: "all", name: "전체" }, ...options];
    }
    return options;
  };

  const secondaryOptions = getSecondaryCategoryOptions();

  // 카테고리 선택 (단일 또는 복수)
  const handleCategorySelect = (category: Category) => {
    if (isSelector || !multiSelect) {
      // 단일 선택 (게시글 작성)
      onCategoriesChange([category.id]);
      close();
      return;
    }

    // 복수 선택 (메인페이지 필터)
    if (category.id === "all") {
      onCategoriesChange(["all"]);
      return;
    }

    if (selectedCategoryIds.includes("all")) {
      onCategoriesChange([category.id]);
      return;
    }

    if (selectedCategoryIds.includes(category.id)) {
      const newIds = selectedCategoryIds.filter((id) => id !== category.id);
      onCategoriesChange(newIds.length === 0 ? ["all"] : newIds);
    } else {
      onCategoriesChange([...selectedCategoryIds, category.id]);
    }
  };

  // 초기화
  const handleReset = () => {
    onCategoriesChange(["all"]);
  };

  // 1차 카테고리 변경 시 2차 카테고리 자동 초기화
  useEffect(() => {
    if (variant === "filter") {
      onCategoriesChange(["all"]);
    } else {
      onCategoriesChange([]);
    }
  }, [primaryCategoryId]);

  // 선택된 카테고리 표시 라벨
  const getSelectedLabel = () => {
    if (isSelector) {
      const firstId = selectedCategoryIds[0];
      return firstId
        ? getCategoryNameById(firstId)
        : "세부 주제를 선택해주세요(필수)";
    }
    if (selectedCategoryIds.includes("all")) {
      return "전체";
    }
    const count = selectedCategoryIds.length;
    return `${count}개 선택됨`;
  };

  const handleApplyAndClose = () => {
    onCategoriesChange(selectedCategoryIds);
    close();
  };

  const isDisabled = isSelector && !primaryCategoryId;

  return (
    <div
      ref={dropdownRef}
      className={cn("relative inline-block w-full md:w-auto", className)}
    >
      {/* 드롭다운 버튼 */}
      <button
        type="button"
        onClick={() => !isDisabled && toggle()}
        disabled={isDisabled}
        className={cn(
          "border-surface-stroke flex items-center justify-between border bg-neutral-100",
          "hover:border-primary-50 focus:border-primary-50 focus:ring-primary-10 focus:ring-2 focus:outline-none",
          "cursor-pointer",
          isOpen && "border-primary-50 ring-primary-10 ring-2",
          isDisabled && "cursor-not-allowed opacity-50",
          {
            // filter 스타일
            "text-neutral-0 w-40 rounded-full px-4 py-3 text-sm font-medium":
              !isSelector,
            // selector 스타일
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
            "text-neutral-20": isSelector && selectedCategoryIds.length > 0,
            "text-neutral-60": isSelector && selectedCategoryIds.length === 0,
          })}
        >
          {getSelectedLabel()}
        </span>
        <ChevronDown
          className={cn("transition-transform", isOpen && "rotate-180", {
            "text-neutral-60 ml-2 h-4 w-4 md:h-5 md:w-5": !isSelector,
            "text-neutral-70 h-3.5 w-3.5": isSelector,
          })}
        />
      </button>

      {/* 드롭다운 박스 */}
      {isOpen && (
        <div
          className={cn(
            "border-surface-stroke absolute z-50 border bg-neutral-100 shadow-lg",
            {
              // filter 스타일 (칩 형태)
              "mt-2 w-sm rounded-lg p-4": !isSelector,
              // selector 스타일 (리스트 형태)
              "top-12 left-0 w-60 rounded-lg": isSelector,
            }
          )}
          role="listbox"
        >
          {isSelector ? (
            // 게시글 작성: 리스트 형태
            <>
              {secondaryOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleCategorySelect(option)}
                  className="text-neutral-20 hover:bg-surface-98 block w-full px-4 py-2.5 text-left text-[15px] leading-normal font-medium tracking-[-0.01em] transition-colors"
                  role="option"
                  aria-selected={selectedCategoryIds.includes(option.id)}
                >
                  {option.name}
                </button>
              ))}
            </>
          ) : (
            // 메인페이지: 칩 형태
            <>
              <div className="mb-4 flex flex-wrap items-center gap-1.5 md:gap-2">
                {secondaryOptions.map((option) => {
                  const isSelected = selectedCategoryIds.includes(option.id);

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleCategorySelect(option)}
                      className={cn(
                        "rounded-full px-3.5 py-2.5 text-xs font-medium whitespace-nowrap transition-all md:px-4 md:py-2 md:text-sm",
                        {
                          "bg-neutral-10 text-neutral-100": isSelected,
                          "border-surface-stroke border bg-neutral-100 text-neutral-50":
                            !isSelected,
                        }
                      )}
                      role="option"
                      aria-selected={isSelected}
                    >
                      {option.name}
                    </button>
                  );
                })}
              </div>

              {/* 초기화 및 저장 버튼 */}
              <div className="flex items-center justify-end gap-2 font-medium md:gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="border-surface-stroke text-neutral-20 bg-surface-98 rounded-lg border px-4 py-2"
                >
                  초기화
                </button>
                <button
                  type="button"
                  onClick={handleApplyAndClose}
                  className="bg-primary-50 rounded-lg px-4 py-2 text-neutral-100"
                >
                  저장
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
