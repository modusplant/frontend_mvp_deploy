import { create } from "zustand";
import { User } from "@/lib/types/auth";
import { authApi } from "@/lib/api/client/auth";
import { deleteCookie } from "@/lib/utils/cookies/client";
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loginAttempts: number;
}
interface AuthActions {
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  incrementLoginAttempts: () => void;
  resetLoginAttempts: () => void;
}

type AuthStore = AuthState & AuthActions;

// Zustand store 생성
export const useAuthStore = create<AuthStore>()((set) => ({
  // 초기 상태
  user: null,
  isAuthenticated: false,
  loginAttempts: 0,

  // 액션들
  login: (user: User) => {
    set({
      user: {
        ...user,
      },
      isAuthenticated: true,
      loginAttempts: 0, // 로그인 성공 시 시도 횟수 초기화
    });
  },

  logout: () => {
    // 서버에 로그아웃 요청 (비동기, 에러 무시)
    authApi.logout().catch(console.error);

    // RememberMe 쿠키 삭제
    deleteCookie("rememberMe", {
      path: "/",
    });

    set({
      user: null,
      isAuthenticated: false,
      loginAttempts: 0,
    });
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
}));
