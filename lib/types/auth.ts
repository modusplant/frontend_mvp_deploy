import {
  UseFormRegister,
  UseFormTrigger,
  UseFormWatch,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";
import { SignupFormValues } from "@/lib/utils/auth";

/**
 * 로그인 요청 데이터
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * 로그인 응답 데이터
 */
export interface LoginResponseData {
  accessToken: string;
}

/**
 * 이메일 인증 요청 데이터
 */
export interface EmailVerificationRequest {
  email: string;
}

/**
 * 이메일 인증 응답 데이터
 */
export interface EmailVerificationResponseData {
  hasEmailAuth: boolean;
}

/**
 * 이메일 인증 확인 요청 데이터
 */
export interface EmailVerifyRequest {
  email: string;
  verifyCode: string;
}

/**
 * 닉네임 중복 확인 응답 데이터
 */
export interface NicknameCheckResponseData {
  isNicknameExisted: boolean;
}

/**
 * 회원가입 요청 데이터
 */
export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
  agreedTermsOfUseVersion: string;
  agreedPrivacyPolicyVersion: string;
  agreedAdInfoReceivingVersion: string;
}

/**
 * 사용자 인증 정보 응답 데이터
 */
export interface UserAuthInfoResponseData {
  id: string;
  email: string;
  provider: string;
}

/**
 * 인증된 사용자 정보 타입
 */
export interface User {
  id: string;
  uuid: string; // 사용자 UUID (게시글 작성자 비교용)
  email: string;
  nickname: string;
  roles: string;
}

/**
 * 회원가입 폼 데이터 타입
 */
export interface SignupFormData {
  email: string;
  verificationCode: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  agreeToCommunity: boolean;
}

/**
 * 이메일 인증 상태 타입
 */
export interface EmailVerificationState {
  isCodeSent: boolean;
  isVerified: boolean;
  timeRemaining: number; // 초 단위
  canResend: boolean;
}

/**
 * 닉네임 검증 상태 타입
 */
export interface NicknameVerificationState {
  isChecked: boolean;
  isAvailable: boolean;
  message: string;
}

/**
 * 회원가입 API 응답 타입
 */
export interface SignupResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    nickname: string;
  };
}

/**
 * 이메일 인증 요청 응답 타입
 */
export interface EmailVerificationResponse {
  success: boolean;
  message: string;
  expiresIn?: number; // 만료 시간(초)
}

/**
 * 인증코드 확인 응답 타입
 */
export interface VerificationCodeResponse {
  success: boolean;
  message: string;
}

/**
 * 닉네임 중복 확인 응답 타입
 */
export interface NicknameCheckResponse {
  success: boolean;
  available: boolean;
  message: string;
}

/**
 * 인증 상태 및 액션 타입 (Zustand 스토어용)
 */
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loginAttempts: number;
  accessToken: string | null;
}

/**
 * 인증 액션 타입
 */
interface AuthActions {
  initialize: () => Promise<void>;
  login: (user: User, rememberMe: boolean) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  incrementLoginAttempts: () => void;
  resetLoginAttempts: () => void;
  setAccessToken: (token: string | null) => void;
}

/**
 * 인증 스토어 타입
 */
export type AuthStore = AuthState & AuthActions;

/**
 * 이메일 섹션 컴포넌트 props 타입
 */
export interface EmailSectionProps {
  register: UseFormRegister<SignupFormValues>;
  trigger: UseFormTrigger<SignupFormValues>;
  watch: UseFormWatch<SignupFormValues>;
  errors: {
    email?: { message?: string };
    verificationCode?: { message?: string };
  };
  className?: string;
}

/**
 * 비밀번호 섹션 컴포넌트 props 타입
 */
export interface PasswordSectionProps {
  register: UseFormRegister<SignupFormValues>;
  watch: UseFormWatch<SignupFormValues>;
  errors: Pick<FieldErrors<SignupFormValues>, "password" | "passwordConfirm">;
  className?: string;
}

/**
 * 닉네임 섹션 컴포넌트 props 타입
 */
export interface NicknameSectionProps {
  register: UseFormRegister<SignupFormValues>;
  trigger: UseFormTrigger<SignupFormValues>;
  watch: UseFormWatch<SignupFormValues>;
  errors: Pick<FieldErrors<SignupFormValues>, "nickname">;
  className?: string;
}

/**
 * 약관 동의 섹션 컴포넌트 props 타입
 */
export interface TermsSectionProps {
  register: UseFormRegister<SignupFormValues>;
  errors: FieldErrors<SignupFormValues>;
  watch: (name: keyof SignupFormValues) => any;
  setValue: UseFormSetValue<SignupFormValues>;
}
