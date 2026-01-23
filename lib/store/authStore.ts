import { create } from "zustand";
import { refreshAccessToken } from "@/lib/api/client";
import { User, AuthStore } from "@/lib/types/auth";
import { decodeJWT } from "@/lib/utils/auth";
import { authApi } from "@/lib/api/auth";

// Zustand store 생성
export const useAuthStore = create<AuthStore>()((set) => ({
  // 초기 상태
  user: null,
  isAuthenticated: false,
  loginAttempts: 0,
  accessToken: null,

  // 초기화 함수 (앱 시작 시 자동 로그인 체크)
  initialize: async () => {
    // 서버 환경에서는 실행하지 않음
    if (typeof window === "undefined") return;

    const rememberMe = localStorage.getItem("rememberMe") === "true";

    // rememberMe가 false이면 종료
    if (!rememberMe) {
      return;
    }

    // RefreshToken(httpOnly 쿠키)으로 새 AccessToken 발급 시도
    try {
      const newAccessToken = await refreshAccessToken();

      // 새 토큰에서 사용자 정보 추출
      const decoded = decodeJWT(newAccessToken);
      if (decoded) {
        // 사용자 이메일 조회
        const authInfoResponse = await authApi.getCurrentUser(decoded.sub);
        const email = authInfoResponse.data?.email || "";

        set({
          user: {
            id: decoded.sub,
            uuid: decoded.sub, // JWT의 sub가 UUID
            email: email,
            nickname: decoded.nickname,
            roles: decoded.roles,
          },
          isAuthenticated: true,
          accessToken: newAccessToken,
        });
      }
    } catch (error) {
      // RefreshToken도 만료되었거나 없는 경우 자동 로그인 정보 제거
      console.error("자동 로그인 실패:", error);
      localStorage.removeItem("rememberMe");
    }
  },

  // 액션들
  login: (user: User, rememberMe: boolean) => {
    set({
      user: {
        ...user,
        uuid: user.id, // id와 uuid 동기화
      },
      isAuthenticated: true,
      loginAttempts: 0, // 로그인 성공 시 시도 횟수 초기화
    });

    // 자동 로그인 설정
    if (rememberMe) {
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberMe");
    }
  },

  logout: () => {
    // 서버에 로그아웃 요청 (비동기, 에러 무시)
    authApi.logout().catch(console.error);

    set({
      user: null,
      isAuthenticated: false,
      loginAttempts: 0,
      accessToken: null,
    });

    // 자동 로그인 정보 제거
    localStorage.removeItem("rememberMe");
  },

  updateUser: (userData: Partial<User>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    }));
  },

  incrementLoginAttempts: () => {
    set((state) => ({
      loginAttempts: state.loginAttempts + 1,
    }));
  },

  resetLoginAttempts: () => {
    set({
      loginAttempts: 0,
    });
  },

  setAccessToken: (token: string | null) => {
    set({ accessToken: token });
  },
}));
