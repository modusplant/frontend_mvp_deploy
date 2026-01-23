import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import Image from "next/image";

export interface CarouselControlsProps {
  isPlaying: boolean;
  currentIndex: number;
  totalSlides: number;
  onPlay: () => void;
  onPause: () => void;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * 캐러셀 네비게이션 컨트롤 (재생/일시정지, 좌우 화살표, 인덱스 표시)
 */
export default function CarouselControls({
  isPlaying,
  currentIndex,
  totalSlides,
  onPlay,
  onPause,
  onPrev,
  onNext,
}: CarouselControlsProps) {
  return (
    <div className="absolute inset-x-0 bottom-4 z-10">
      <div className="mx-auto flex w-full max-w-7xl justify-end gap-2 px-4 md:px-6 lg:px-8">
        {/* 재생/일시중지 */}
        <button
          onClick={onPause}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 transition-colors hover:bg-black/80"
          aria-label="일시정지"
        >
          <Image src="/icon/pause.png" alt="일시정지" width={10} height={12} />
        </button>
        <button
          onClick={onPlay}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 transition-colors hover:bg-black/80"
          aria-label="재생"
        >
          <Play color="white" size={18} />
        </button>

        {/* 좌우 화살표 및 인덱스 */}
        <div className="flex h-8 w-22 items-center justify-between rounded-full bg-black/60 px-1 text-white">
          <button
            onClick={onPrev}
            className="transition-opacity hover:opacity-80"
            aria-label="이전 슬라이드"
          >
            <ChevronLeft color="white" size={20} />
          </button>
          <span>{currentIndex}</span>
          <span className="opacity-50">| {totalSlides}</span>
          <button
            onClick={onNext}
            className="transition-opacity hover:opacity-80"
            aria-label="다음 슬라이드"
          >
            <ChevronRight color="white" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
