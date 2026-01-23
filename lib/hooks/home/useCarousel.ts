import { useState, useEffect, useCallback } from "react";

export interface UseCarouselOptions {
  totalSlides: number;
  autoPlayInterval?: number;
  autoPlay?: boolean;
}

export interface UseCarouselReturn {
  currentIndex: number;
  isPlaying: boolean;
  isTransitioning: boolean;
  extendedImages: string[];
  totalSlides: number;
  handleNext: () => void;
  handlePrev: () => void;
  handlePlay: () => void;
  handlePause: () => void;
  getDisplayIndex: () => number;
}

/**
 * 무한 루프 캐러셀 로직을 관리하는 커스텀 훅
 * - 양방향 무한 루프 슬라이드
 * - 자동 재생 기능
 * - transition 관리
 */
export function useCarousel(
  images: string[],
  {
    autoPlayInterval = 3000,
    autoPlay = true,
  }: Omit<UseCarouselOptions, "totalSlides"> = {}
): UseCarouselReturn {
  const [currentIndex, setCurrentIndex] = useState(1); // 복제된 마지막 이미지부터 시작
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 무한 루프를 위해 앞뒤로 복제: [마지막, 1, 2, 3, 첫번째]
  const totalSlides = images.length;
  const extendedImages = [images[images.length - 1], ...images, images[0]];

  // 다음 슬라이드로 이동
  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  }, [isTransitioning]);

  // 이전 슬라이드로 이동
  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex - 1);
  }, [isTransitioning]);

  // 재생/일시정지 토글
  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // 현재 표시할 인덱스 계산 (복제 이미지 고려)
  const getDisplayIndex = useCallback(() => {
    if (currentIndex === 0) return totalSlides;
    if (currentIndex === totalSlides + 1) return 1;
    return currentIndex;
  }, [currentIndex, totalSlides]);

  // 슬라이드 전환 완료 처리 (무한 루프 리셋)
  useEffect(() => {
    if (!isTransitioning) return;

    const timeout = setTimeout(() => {
      setIsTransitioning(false);

      // 마지막 복제 이미지에 도달 시 실제 첫 번째로 점프
      if (currentIndex === totalSlides + 1) {
        setCurrentIndex(1);
      }
      // 첫 번째 복제 이미지에 도달 시 실제 마지막으로 점프
      else if (currentIndex === 0) {
        setCurrentIndex(totalSlides);
      }
    }, 1000); // transition duration과 동일

    return () => clearTimeout(timeout);
  }, [currentIndex, totalSlides, isTransitioning]);

  // 자동 재생
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(handleNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isPlaying, handleNext, autoPlayInterval]);

  return {
    currentIndex,
    isPlaying,
    isTransitioning,
    extendedImages,
    totalSlides,
    handleNext,
    handlePrev,
    handlePlay,
    handlePause,
    getDisplayIndex,
  };
}
