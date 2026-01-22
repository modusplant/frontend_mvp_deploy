"use client";

import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/tailwindHelper";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * 페이지네이션 컴포넌트
 * - 숫자 버튼으로 페이지 이동
 * - 현재 페이지 강조
 * - 좌우 화살표로 이전/다음 페이지 이동
 * - 페이지 범위 표시 (최대 5개)
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  // 페이지 범위 계산 (최대 5개 표시)
  const getPageNumbers = () => {
    const maxPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);

    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const showEllipsisEnd = pageNumbers[pageNumbers.length - 1] < totalPages;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* 이전 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
          currentPage === 1
            ? "border-surface-stroke cursor-not-allowed opacity-50"
            : "border-surface-stroke hover:bg-surface-98"
        )}
        aria-label="이전 페이지"
      >
        <ChevronRight className="h-4 w-4 rotate-180" />
      </button>

      {/* 페이지 번호 버튼들 */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg text-[13px] leading-normal font-extrabold transition-colors",
            page === currentPage
              ? "bg-primary-50 text-white"
              : "text-neutral-20 hover:bg-surface-98"
          )}
          aria-label={`${page}페이지`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      {/* 말줄임표 */}
      {showEllipsisEnd && (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg">
          <span className="text-neutral-20 text-[13px] leading-normal font-medium">
            ⋯
          </span>
        </div>
      )}

      {/* 마지막 페이지 */}
      {showEllipsisEnd && (
        <button
          onClick={() => onPageChange(totalPages)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg text-[13px] leading-normal font-medium transition-colors",
            totalPages === currentPage
              ? "bg-primary-50 text-white"
              : "text-neutral-20 hover:bg-surface-98"
          )}
          aria-label={`${totalPages}페이지`}
        >
          {totalPages}
        </button>
      )}

      {/* 다음 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
          currentPage === totalPages
            ? "border-surface-stroke cursor-not-allowed opacity-50"
            : "border-surface-stroke hover:bg-surface-98"
        )}
        aria-label="다음 페이지"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
