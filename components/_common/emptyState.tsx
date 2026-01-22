"use client";

import Image from "next/image";
import Link from "next/link";

interface EmptyStateProps {
  /**
   * 캐릭터 이미지 경로
   * @default "/character.svg"
   */
  imageSrc?: string;
  /**
   * 주요 메시지 (강조)
   */
  title: string;
  /**
   * 부가 설명 (여러 줄 가능)
   */
  description: string;
  /**
   * 버튼 텍스트
   */
  buttonText: string;
  /**
   * 버튼 클릭 시 이동할 경로
   */
  buttonHref: string;
}

/**
 * 마이페이지 빈 상태 컴포넌트
 *
 * @example
 * ```tsx
 * <EmptyState
 *   title="최근 본 식물 기록이 없어요!"
 *   description="초록빛 가득한 이야기들을 탐색하고\n나만의 식물 아카이브를 채워보세요."
 *   buttonText="둘러보기"
 *   buttonHref="/"
 * />
 * ```
 */
export default function EmptyState({
  imageSrc = "/character.svg",
  title,
  description,
  buttonText,
  buttonHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-[60px]">
      {/* 캐릭터 이미지 */}
      <div className="relative h-[100px] w-[100px]">
        <Image src={imageSrc} alt={title} fill className="object-contain" />
      </div>

      {/* 안내 문구 */}
      <div className="flex flex-col items-center gap-3">
        <h3 className="text-neutral-10 text-base leading-[1.19] font-semibold tracking-[-0.02em]">
          {title}
        </h3>
        <p className="text-neutral-40 text-center text-[15px] leading-normal font-normal tracking-[-0.02em]">
          {description.split("\\n").map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
        </p>
      </div>

      {/* CTA 버튼 */}
      <Link
        href={buttonHref}
        className="border-surface-stroke text-neutral-20 flex h-12 items-center justify-center gap-[9px] rounded-[31px] border px-6 py-4 text-base leading-[1.2] font-medium tracking-[-0.03em]"
      >
        {buttonText}
      </Link>
    </div>
  );
}
