"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import EmptyState from "@/components/_common/emptyState";

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * 전역 인증 가드 컴포넌트
 *
 * @description
 * - 특정 경로(메인, 로그인, 회원가입, 게시글 상세, 비밀번호 재설정)는 인증 없이 접근 가능
 * - 나머지 경로는 인증 필요
 * - 미인증 상태에서 보호된 경로 접근 시 로그인 안내 페이지 표시
 *
 * @example
 * ```tsx
 * // Root Layout에서 사용
 * <AuthGuard>
 *   {children}
 * </AuthGuard>
 * ```
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // 인증이 필요없는 공개 경로 목록
  const publicPaths = [
    "/", // 메인페이지
    "/login", // 로그인
    "/signup", // 회원가입
    "/reset-password", // 비밀번호 재설정
  ];

  // 현재 경로가 공개 경로인지 확인
  const isPublicPath =
    publicPaths.includes(pathname) ||
    (pathname.startsWith("/community/") &&
      !pathname.startsWith("/community/write")); // 게시글 상세만 허용

  // 공개 경로거나 인증된 경우 children 렌더링
  if (isPublicPath || isAuthenticated) {
    return <>{children}</>;
  }

  // 미인증 상태에서 보호된 경로 접근 시 로그인 안내
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
      <EmptyState
        imageSrc="/character_sad.svg"
        title="로그인이 필요한 서비스예요"
        description="회원 전용 콘텐츠를 이용하려면\n먼저 로그인해주세요."
        buttonText="로그인하기"
        buttonHref="/login"
      />
    </div>
  );
}
