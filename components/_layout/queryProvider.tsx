"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

interface QueryProviderProps {
  children: ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0, // 항상 최신 데이터 유지
            gcTime: 1000 * 60 * 5, // 5분간 캐시 유지 (UX 개선)
            retry: 1, // 실패 시 1회 재시도
            refetchOnWindowFocus: true, // 윈도우 포커스 시 자동 리페치
          },
          mutations: {
            retry: 0, // mutation은 재시도 안 함
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
