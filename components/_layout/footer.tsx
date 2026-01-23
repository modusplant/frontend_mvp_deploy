import Link from "next/link";
import { cn } from "@/lib/utils/tailwindHelper";
import Image from "next/image";

export interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "border-surface-stroke bg-surface-99 w-full border-t",
        className
      )}
    >
      <div className="mx-auto w-full max-w-[68vw] px-4 py-8 md:px-6 md:py-12 lg:px-8">
        <div className="flex items-center justify-between">
          <Image
            src="/logo_favicon/Logo_green.svg"
            alt="모두의식물 로고"
            width={120}
            height={32}
          />

          <span className="text-surface-stroke-2">|</span>

          {/* 링크 섹션 1 */}
          <div className="text-neutral-40 flex gap-10">
            <Link href="/" className="hover:text-primary-50 transition-colors">
              사이트 소개
            </Link>
            <Link href="/" className="hover:text-primary-50 transition-colors">
              건의/버그 제보
            </Link>
            <Link href="/" className="hover:text-primary-50 transition-colors">
              이용약관
            </Link>
            <Link
              href="/"
              className="hover:text-primary-50 font-semibold transition-colors"
            >
              개인정보처리방침
            </Link>
          </div>

          <span className="text-surface-stroke-2">|</span>

          {/* 하단 저작권 */}
          <div className="text-neutral-60 text-xs md:text-sm">
            <p>© {currentYear} 모두의식물. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
