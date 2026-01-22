import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { authApi } from "@/lib/api/client/auth";
import { LoginFormValues } from "@/lib/constants/schema";
import { processSuccessfulAuth } from "@/lib/utils/auth/processSuccessfulAuth";

/**
 * 로그인 커스텀 훅
 */
export function useLogin() {
  const router = useRouter();
  const { login, incrementLoginAttempts } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      setServerError(null);

      //1. API 호출
      const response = await authApi.login({
        email: data.email,
        password: data.password,
      });

      if (response.status === 200 && response.data?.accessToken) {
        //2-6. 인증 성공 처리 (토큰 저장, 사용자 정보 조회 등)
        const user = await processSuccessfulAuth(
          response.data.accessToken,
          data.rememberMe ?? false
        );

        // 로그인 성공 - 사용자 정보 저장
        login(user);

        console.log("로그인 성공");
        router.push("/");
      }
    } catch (error: any) {
      // 로그인 시도 횟수 증가
      incrementLoginAttempts();

      setServerError(error.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLogin,
    serverError,
    isLoading,
  };
}
