import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { authApi } from "@/lib/api/auth";
import { LoginFormValues } from "@/lib/utils/auth";

/**
 * 로그인 커스텀 훅
 */
export function useLogin() {
  const router = useRouter();
  const { login, incrementLoginAttempts, setAccessToken } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: LoginFormValues) => {
    // 임시 로그인 데이터
    // TODO: 추후 삭제
    if (data.email === "test1234@naver.com" && data.password === "test1234") {
      const testUser = {
        uuid: "test-uuid-123",
        id: "test@test.com",
        email: "test@test.com",
        nickname: "test_user",
        roles: "ROLE_USER",
      };

      login(testUser, data.rememberMe || false);
      setAccessToken("test-access-token");

      if (data.rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }
      router.back();
      return;
    }

    try {
      setIsLoading(true);
      setServerError(null);

      // API 호출
      const response = await authApi.login({
        email: data.email,
        password: data.password,
      });

      if (
        response.status === 200 &&
        response.user &&
        response.data?.accessToken
      ) {
        // AccessToken 저장 (메모리)
        setAccessToken(response.data.accessToken);

        // 로그인 성공 - JWT에서 추출한 사용자 정보 저장
        login(response.user, data.rememberMe || false);

        console.log("로그인 성공");
        router.back();
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
