"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/tailwindHelper";
import { Pause, ChevronLeft, ChevronRight, Play, Square } from "lucide-react";

export interface HeroBannerProps {
  images?: string[];
  autoPlayInterval?: number; // 밀리초 단위 (기본 3000ms = 3초)
  className?: string;
}

/**
 * 메인페이지 히어로 배너 (자동 슬라이드)
 * - 3개 이미지 자동 재생 (3초 간격)
 * - 좌우 화살표 네비게이션
 * - 루프 슬라이더
 */
export default function HeroBanner({
  images = ["/banner/ban_01.png", "/banner/ban_02.png", "/banner/ban_01.png"],
  autoPlayInterval = 3000,
  className,
}: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // 다음 슬라이드로 이동
  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  // 이전 슬라이드로 이동
  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  // 특정 슬라이드로 이동
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // 재생/일시정지 토글
  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  // 자동 재생
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(handleNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isPlaying, handleNext, autoPlayInterval, currentIndex]);

  return (
    <section
      className={cn(
        "bg-surface-98 relative h-[70vh] w-full overflow-hidden",
        className
      )}
    >
      {/* 슬라이드 이미지 */}
      <div className="relative h-full w-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-500",
              index === currentIndex ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={image}
              alt={`히어로 이미지 ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 md:px-6 lg:px-8">
          <span className="font-emphasis text-2xl font-bold text-neutral-100 text-shadow-lg">
            ModusPlant
          </span>
          <span className="font-emphasis text-3xl font-bold tracking-tighter text-neutral-100 text-shadow-lg md:text-4xl lg:text-[44px]">
            당신의 공간에 스며든 초록빛 평화
          </span>
          <span className="font-body text-base text-neutral-100 lg:text-lg">
            모두의식물에서 함께 가꾸는 특별한 일상을 시작하세요.
          </span>
        </div>
      </div>

      {/* 네비게이션 컨트롤 */}
      <div className="absolute inset-x-0 bottom-4 z-10">
        <div className="mx-auto flex w-full max-w-7xl justify-end gap-2 px-4 md:px-6 lg:px-8">
          {/* 재생/일시중지 */}
          <button
            onClick={togglePlayPause}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 transition-colors hover:bg-black/80"
            aria-label={isPlaying ? "일시정지" : "재생"}
          >
            {isPlaying ? (
              <Square color="white" size={18} />
            ) : (
              <Play color="white" size={18} />
            )}
          </button>

          {/* 좌우 화살표 및 인덱스 */}
          <div className="flex h-8 w-22 items-center justify-between rounded-full bg-black/60 px-1 text-white">
            <button
              onClick={handlePrev}
              className="transition-opacity hover:opacity-80"
              aria-label="이전 슬라이드"
            >
              <ChevronLeft color="white" size={20} />
            </button>
            <span>{currentIndex + 1}</span>
            <span className="opacity-50">| {images.length}</span>
            <button
              onClick={handleNext}
              className="transition-opacity hover:opacity-80"
              aria-label="다음 슬라이드"
            >
              <ChevronRight color="white" size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
