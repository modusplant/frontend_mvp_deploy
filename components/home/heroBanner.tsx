"use client";

import Image from "next/image";
import { cn } from "@/lib/utils/tailwindHelper";
import { useCarousel } from "@/lib/hooks/home/useCarousel";
import CarouselControls from "./carouselControls";
import HeroBannerContent from "./heroBannerContent";

export interface HeroBannerProps {
  images?: string[];
  autoPlayInterval?: number; // 밀리초 단위 (기본 5000ms = 5초)
  className?: string;
  title?: string;
  subtitle?: string;
  description?: string;
}

/**
 * 메인페이지 히어로 배너 (자동 슬라이드)
 * - 3개 이미지 자동 재생 (5초 간격)
 * - 좌우 화살표 네비게이션
 * - 루프 슬라이더
 */
export default function HeroBanner({
  images = ["/banner/ban_01.png", "/banner/ban_02.png", "/banner/ban_01.png"],
  autoPlayInterval = 5000,
  className,
  title,
  subtitle,
  description,
}: HeroBannerProps) {
  const {
    currentIndex,
    isPlaying,
    isTransitioning,
    extendedImages,
    totalSlides,
    handleNext,
    handlePrev,
    togglePlayPause,
    getDisplayIndex,
  } = useCarousel(images, { autoPlayInterval });

  return (
    <section
      className={cn(
        "bg-surface-98 relative h-[70vh] w-full overflow-hidden",
        className
      )}
    >
      {/* 슬라이드 이미지 */}
      <div className="relative h-full w-full">
        <div
          className={cn(
            "flex h-full",
            isTransitioning
              ? "transition-transform duration-1000 ease-in-out"
              : ""
          )}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {extendedImages.map((image, index) => (
            <div key={index} className="relative h-full w-full shrink-0">
              <Image
                src={image}
                alt={`히어로 이미지 ${(index % totalSlides) + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 배너 컨텐츠 */}
      <HeroBannerContent
        title={title}
        subtitle={subtitle}
        description={description}
      />

      {/* 네비게이션 컨트롤 */}
      <CarouselControls
        isPlaying={isPlaying}
        currentIndex={getDisplayIndex()}
        totalSlides={totalSlides}
        onPlayPauseToggle={togglePlayPause}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </section>
  );
}
