import { FieldErrors } from "react-hook-form";
import {
  EmailVerificationState,
  NicknameVerificationState,
} from "@/lib/types/auth";
import { z } from "zod";

/**
 * JWT 페이로드 타입
 */
export interface JWTPayload {
  sub: string; // 사용자 ID
  nickname: string;
  roles: string;
  exp: number; // Unix timestamp (초 단위)
}

/**
 * JWT 토큰 디코딩
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(window.atob(base64));
    return payload as JWTPayload;
  } catch (error) {
    console.error("JWT 디코딩 실패:", error);
    return null;
  }
}

/**
 * JWT 토큰 만료 여부 확인
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded?.exp) return true;

  // exp는 초 단위이므로 1000을 곱해서 밀리초로 변환
  return decoded.exp * 1000 < Date.now();
}

/**
 * 카운트다운 시간을 "MM:SS" 형식으로 포매팅
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

/**
 * 로그인 폼 스키마
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일을 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
  rememberMe: z.boolean().optional(),
});

/**
 * 회원가입 폼 스키마
 */
export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해주세요")
      .email("올바른 이메일을 입력해주세요"),
    verificationCode: z.string().min(1, "인증코드를 입력해주세요"),
    password: z
      .string()
      .min(
        8,
        "영문 대소문자, 숫자, 특수문자를 포함한 8자 이상의 비밀번호로 입력해주세요"
      )
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
        "영문 대소문자, 숫자, 특수문자를 포함한 8자 이상의 비밀번호로 입력해주세요"
      ),
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요"),
    nickname: z
      .string()
      .min(1, "닉네임을 입력해주세요")
      .max(20, "닉네임은 20자 이내로 입력해주세요"),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "이용약관에 동의해주세요",
    }),
    agreeToPrivacy: z.boolean().refine((val) => val === true, {
      message: "개인정보처리방침에 동의해주세요",
    }),
    agreeToCommunity: z.boolean().refine((val) => val === true, {
      message: "커뮤니티 운영정책에 동의해주세요",
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 서로 일치하지 않습니다",
    path: ["passwordConfirm"],
  });

/**
 * 비밀번호 재설정 폼 스키마
 */
export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해주세요")
      .email("올바른 이메일을 입력해주세요"),
    verificationCode: z.string().min(1, "인증코드를 입력해주세요"),
    newPassword: z
      .string()
      .min(
        8,
        "영문 대소문자, 숫자, 특수문자를 포함한 8자 이상의 비밀번호로 입력해주세요"
      )
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
        "영문 대소문자, 숫자, 특수문자를 포함한 8자 이상의 비밀번호로 입력해주세요"
      ),
    newPasswordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요"),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: "비밀번호가 서로 일치하지 않습니다",
    path: ["newPasswordConfirm"],
  });

// 타입 추출
export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

/**
 * 비밀번호 유효성 검사 함수
 */
export const validatePassword = (password: string) => {
  const minLength = password.length >= 8;
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&#]/.test(password);

  return {
    isValid:
      minLength && hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar,
    requirements: {
      minLength,
      hasLowerCase,
      hasUpperCase,
      hasNumber,
      hasSpecialChar,
    },
  };
};

/**
 * 이메일 유효성 검사 함수
 */
export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 회원가입 폼의 전체 유효성을 검사
 */
export const isSignupFormValid = (
  emailVerification: EmailVerificationState,
  nicknameVerification: NicknameVerificationState,
  agreeToTerms: boolean,
  agreeToPrivacy: boolean,
  errors: FieldErrors<SignupFormValues>
): boolean => {
  const hasEmailVerification = emailVerification.isVerified;
  const hasNicknameVerification =
    nicknameVerification.isChecked && nicknameVerification.isAvailable;
  const hasRequiredAgreements = agreeToTerms && agreeToPrivacy;
  const hasNoFormErrors =
    !errors.email &&
    !errors.password &&
    !errors.passwordConfirm &&
    !errors.nickname;

  return (
    hasEmailVerification &&
    hasNicknameVerification &&
    hasRequiredAgreements &&
    hasNoFormErrors
  );
};

/**
 * 폼 에러의 개수를 계산
 */
export const getFormErrorCount = (errors: FieldErrors<any>): number => {
  return Object.keys(errors).length;
};

/**
 * 첫 번째 에러 메시지를 반환
 */
export const getFirstErrorMessage = (
  errors: FieldErrors<any>
): string | null => {
  const firstError = Object.values(errors)[0];
  if (typeof firstError === "object" && firstError && "message" in firstError) {
    return (firstError as any).message || null;
  }
  return null;
};

/**
 * 회원가입 단계별 진행률을 계산 (0-100)
 */
export const calculateSignupProgress = (
  emailVerified: boolean,
  passwordValid: boolean,
  nicknameValid: boolean,
  termsAgreed: boolean
): number => {
  const steps = [emailVerified, passwordValid, nicknameValid, termsAgreed];
  const completedSteps = steps.filter(Boolean).length;
  return (completedSteps / steps.length) * 100;
};

/**
 * 이메일 도메인 추천 목록
 */
export const getEmailDomainSuggestions = (email: string): string[] => {
  const commonDomains = [
    "@gmail.com",
    "@naver.com",
    "@daum.net",
    "@kakao.com",
    "@outlook.com",
    "@yahoo.com",
    "@hotmail.com",
  ];

  if (!email.includes("@")) {
    return commonDomains.map((domain) => email + domain);
  }

  return [];
};

/**
 * 비밀번호 강도를 계산 (1-5)
 */
export const calculatePasswordStrength = (
  password: string
): {
  score: number;
  feedback: string;
} => {
  if (!password) {
    return { score: 0, feedback: "비밀번호를 입력하세요" };
  }

  let score = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  Object.values(checks).forEach((check) => {
    if (check) score++;
  });

  const feedbacks = {
    0: "매우 약함",
    1: "약함",
    2: "보통",
    3: "보통",
    4: "강함",
    5: "매우 강함",
  };

  return {
    score,
    feedback: feedbacks[score as keyof typeof feedbacks] || "알 수 없음",
  };
};

/**
 * 닉네임 유효성을 검사 (길이, 특수문자 등)
 */
export const validateNickname = (
  nickname: string
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!nickname.trim()) {
    errors.push("닉네임을 입력해주세요");
  } else {
    if (nickname.length < 2) {
      errors.push("닉네임은 2자 이상이어야 합니다");
    }
    if (nickname.length > 20) {
      errors.push("닉네임은 20자 이내여야 합니다");
    }
    if (/[^가-힣a-zA-Z0-9_]/.test(nickname)) {
      errors.push("닉네임은 한글, 영문, 숫자, 언더스코어만 사용할 수 있습니다");
    }
    if (/^\d+$/.test(nickname)) {
      errors.push("닉네임은 숫자로만 구성될 수 없습니다");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * 안전한 문자열 변환 (null/undefined 처리)
 */
export const safeString = (value: any): string => {
  return value?.toString() || "";
};

/**
 * 디바운스된 검증을 위한 타이머 관리
 */
export const createDebounceTimer = () => {
  let timeoutId: NodeJS.Timeout | number | null = null;

  const debounce = (func: Function, delay: number) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(func, delay);
  };

  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return { debounce, cancel };
};
