export interface HeroBannerContentProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

/**
 * 히어로 배너 텍스트 컨텐츠
 */
export default function HeroBannerContent({
  title = "ModusPlant",
  subtitle = "당신의 공간에 스며든 초록빛 평화",
  description = "모두의식물에서 함께 가꾸는 특별한 일상을 시작하세요.",
}: HeroBannerContentProps) {
  return (
    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 md:px-6 lg:px-8">
        <span className="font-emphasis text-2xl font-bold text-neutral-100 text-shadow-lg">
          {title}
        </span>
        <span className="font-emphasis text-3xl font-bold tracking-tighter text-neutral-100 text-shadow-lg md:text-4xl lg:text-[44px]">
          {subtitle}
        </span>
        <span className="font-body text-base text-neutral-100 lg:text-lg">
          {description}
        </span>
      </div>
    </div>
  );
}
