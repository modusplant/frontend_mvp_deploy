import { z } from "zod";

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
 * 공통 이메일 스키마
 */
export const emailSchema = z
  .string()
  .min(1, "이메일을 입력해주세요")
  .email("올바른 이메일을 입력해주세요");

/**
 * 공통 인증코드 스키마
 */
export const verificationCodeSchema = z
  .string()
  .min(1, "인증코드를 입력해주세요");

/**
 * 공통 비밀번호 스키마
 */
export const passwordSchema = z
  .string()
  .min(
    8,
    "영문 대소문자, 숫자, 특수문자를 포함한 8자 이상의 비밀번호로 입력해주세요"
  )
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
    "영문 대소문자, 숫자, 특수문자를 포함한 8자 이상의 비밀번호로 입력해주세요"
  );

/**
 * 공통 비밀번호 확인 스키마
 */
export const passwordConfirmSchema = z
  .string()
  .min(1, "비밀번호 확인을 입력해주세요");

/**
 * 회원가입 폼 스키마
 */
export const signupSchema = z
  .object({
    email: emailSchema,
    verificationCode: verificationCodeSchema,
    password: passwordSchema,
    passwordConfirm: passwordConfirmSchema,
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
 * 비밀번호 재설정 폼 스키마 (이메일 인증 포함)
 */
export const resetPasswordSchema = z
  .object({
    email: emailSchema,
    verificationCode: verificationCodeSchema,
    newPassword: passwordSchema,
    newPasswordConfirm: passwordConfirmSchema,
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: "비밀번호가 서로 일치하지 않습니다",
    path: ["newPasswordConfirm"],
  });

/**
 * 새 비밀번호 설정 스키마 (UUID 토큰으로 인증된 경우)
 */
export const newPasswordSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: passwordConfirmSchema,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 서로 일치하지 않습니다",
    path: ["passwordConfirm"],
  });

// 타입 추출
export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;
