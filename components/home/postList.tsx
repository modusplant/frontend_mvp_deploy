"use client";

import { useMemo, useEffect, useRef } from "react";
import PostCard from "@/components/_common/postCard";
import PrimaryCategoryFilter from "@/components/_common/primaryCategoryFilter";
import SecondaryCategoryFilter from "@/components/_common/secondaryCategoryFilter";
import { useAuthStore } from "@/lib/store/authStore";
import BlurOverlay from "@/components/_layout/blurOverlay";
import { useCategoryFilter } from "@/lib/hooks/category/useCategoryFilter";
import { usePostsQuery } from "@/lib/hooks/home/usePostsQuery";
import LoadingState from "./loadingState";
import ErrorState from "./errorState";
import HomeEmptyState from "./homeEmptyState";

export default function PostList() {
  const { isAuthenticated } = useAuthStore();
  const {
    primaryCategory,
    primaryCategoryId,
    handlePrimaryCategoryChange,
    selectedSecondaryCategories,
    selectedSecondaryCategoryIds,
    handleSecondaryCategoriesChange,
  } = useCategoryFilter();

  // 무한 스크롤을 위한 관찰 대상 ref
  const observerTarget = useRef<HTMLDivElement>(null);

  // API 호출 (카테고리 필터링 포함)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = usePostsQuery({
    size: 12,
    primaryCategoryId:
      primaryCategory === "전체" ? undefined : primaryCategoryId,
    secondaryCategoryId:
      selectedSecondaryCategories.includes("전체") ||
      selectedSecondaryCategoryIds.length === 0
        ? undefined
        : selectedSecondaryCategoryIds.join(","),
  });

  // 모든 페이지의 게시글을 하나의 배열로 평탄화
  const allPosts = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page?.posts ?? []);
  }, [data]);

  // 게스트(비로그인) 상태에서 보여줄/가릴 목록 계산
  const isGuest = !isAuthenticated;
  const visiblePosts = useMemo(
    () => (isGuest ? allPosts.slice(0, 9) : allPosts),
    [isGuest, allPosts]
  );
  const hiddenPosts = useMemo(
    () => (isGuest ? allPosts.slice(9) : []),
    [isGuest, allPosts]
  );

  // IntersectionObserver를 사용한 무한 스크롤 트리거
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 타겟이 보이고, 다음 페이지가 있고, 현재 로딩 중이 아닐 때
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, isAuthenticated]);

  return (
    <section className="w-full">
      {/* 카테고리 필터 */}
      <div className="my-10 flex gap-2.5">
        {/* 1차 카테고리 */}
        <div>
          <PrimaryCategoryFilter
            selectedCategoryId={primaryCategoryId}
            onCategoryChange={handlePrimaryCategoryChange}
            variant="filter"
            showAll={true}
          />
        </div>

        {/* 2차 카테고리 */}
        <div>
          <SecondaryCategoryFilter
            primaryCategoryId={primaryCategoryId}
            selectedCategoryIds={selectedSecondaryCategoryIds}
            onCategoriesChange={handleSecondaryCategoriesChange}
            variant="filter"
            multiSelect={true}
            showAll={true}
          />
        </div>
      </div>

      {/* 로딩 상태 (초기 로딩) */}
      {isLoading && <LoadingState />}

      {/* 에러 상태 */}
      {isError && (
        <ErrorState
          message={error instanceof Error ? error.message : undefined}
        />
      )}

      {/* 게시물 목록 */}
      {!isLoading && !isError && (
        <>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-10">
            {visiblePosts.map((post) => (
              <PostCard key={post.postId} post={post} />
            ))}
          </div>

          {/* 비로그인 시 9개 이후 영역 블러 + CTA 오버레이 */}
          {isGuest && hiddenPosts.length > 0 && (
            <div className="relative mt-12">
              {/* 가려질 게시물 영역 (실제 배치 유지) */}
              <div className="pointer-events-none grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-10">
                {hiddenPosts.map((post) => (
                  <PostCard key={post.postId} post={post} />
                ))}
              </div>

              {/* 블러 + 오버레이 컨텐츠 (재사용 컴포넌트) */}
              <BlurOverlay variant="post" />
            </div>
          )}

          {/* 무한 스크롤 트리거 (로그인 상태일 때만) */}
          {!isGuest && <div ref={observerTarget} className="h-10" />}

          {/* 다음 페이지 로딩 중 */}
          {isFetchingNextPage && <LoadingState />}

          {/* 게시물이 없을 때 */}
          {allPosts.length === 0 && <HomeEmptyState />}
        </>
      )}
    </section>
  );
}
