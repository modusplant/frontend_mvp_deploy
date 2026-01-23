"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import type { User } from "@/lib/types/auth";

interface AuthInitializerProps {
  initialUser: User | null;
}

/**
 * 서버에서 결정한 인증 상태를 클라이언트 스토어에 초기화하는 컴포넌트
 * HydrationError를 방지하기 위해 useEffect에서 상태를 설정함
 */
export default function AuthInitializer({ initialUser }: AuthInitializerProps) {
  useEffect(() => {
    // 서버에서 받은 사용자 정보로 zustand 초기화
    if (initialUser) {
      useAuthStore.setState({
        user: initialUser,
        isAuthenticated: true,
      });
    }
    // initialUser가 null이면 zustand의 기본값(미인증)이 유지됨
  }, []); // 의존성 배열 비움 - 한 번만 실행 (hydration 직후)

  return null;
}
