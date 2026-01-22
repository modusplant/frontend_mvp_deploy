import Link from "next/link";
import Button from "@/components/_common/button";
import { cn } from "@/lib/utils/tailwindHelper";

export type BlurOverlayVariant = "post" | "comment";

interface BlurOverlayProps {
  variant: BlurOverlayVariant;
  sticky?: boolean;
  className?: string;
}

const messages: Record<BlurOverlayVariant, string> = {
  post: "모두의식물 회원이 되어\n모든 게시글을 확인하세요",
  comment: "모두의식물 회원이 되어\n소통에 참여하세요",
};

export default function BlurOverlay({
  variant,
  sticky = false,
  className,
}: BlurOverlayProps) {
  const lines = messages[variant].split("\n");

  return (
    <div className={cn("absolute inset-0 z-10 min-h-[30vh]", className)}>
      {/* 배경 블러 + 반투명 화이트 */}
      <div className="h-full w-full bg-white/80 py-32 backdrop-blur-sm">
        {/* 중앙 정렬 컨테이너 */}
        <div
          className={cn(
            "px-4",
            sticky
              ? "sticky top-1/2"
              : "flex h-full items-center justify-center"
          )}
        >
          <div className="mx-auto flex max-w-[480px] flex-col items-center gap-5 text-center">
            <p className="text-neutral-20 text-[22px] leading-snug font-bold md:text-[22px]">
              {lines.map((line, idx) => (
                <span key={idx}>
                  {line}
                  {idx === 0 && <br className="hidden sm:block" />}
                </span>
              ))}
            </p>
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="default"
                  size="lg"
                  className="cursor-pointer rounded-full"
                >
                  로그인
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="point"
                  size="lg"
                  className="cursor-pointer rounded-full"
                >
                  회원가입
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
