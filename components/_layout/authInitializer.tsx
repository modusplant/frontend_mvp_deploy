"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";

/**
 * 앱 시작 시 자동 로그인 체크를 위한 초기화 컴포넌트
 * 루트 레이아웃에 추가하여 사용
 */
export default function AuthInitializer() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, []); // 의존성 배열 비워두기 - 앱 시작 시 한 번만 실행

  return null;
}
