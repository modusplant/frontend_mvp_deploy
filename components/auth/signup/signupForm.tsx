"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { showModal } from "@/lib/store/modalStore";
import { signupSchema, SignupFormValues } from "@/lib/constants/schema";
import { authApi } from "@/lib/api/client/auth";
import { useAuthStore } from "@/lib/store/authStore";
import { TERMS_VERSIONS } from "@/lib/constants/terms";
import { Button } from "@/components/_common/button";
import { processSuccessfulAuth } from "@/lib/utils/auth/processSuccessfulAuth";

// Sub-components
import EmailSection from "./emailSection";
import PasswordSection from "./passwordSection";
import NicknameSection from "./nicknameSection";
import TermsSection from "./termsSection";

export default function SignupForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      // 1. 회원가입 API 호출
      const signupData = {
        email: data.email,
        password: data.password,
        nickname: data.nickname,
        agreedTermsOfUseVersion: TERMS_VERSIONS.termsOfUse,
        agreedPrivacyPolicyVersion: TERMS_VERSIONS.privacyPolicy,
        agreedAdInfoReceivingVersion: data.agreeToCommunity
          ? TERMS_VERSIONS.adInfoReceiving
          : "",
      };

      const signupResult = await authApi.signup(signupData);

      if (signupResult.status === 200) {
        // 2. 회원가입 성공 후 자동 로그인
        const loginResult = await authApi.login({
          email: data.email,
          password: data.password,
        });

        if (loginResult.status === 200 && loginResult.data?.accessToken) {
          // 3-6. 인증 성공 처리 (토큰 저장, 사용자 정보 조회 등)
          const user = await processSuccessfulAuth(
            loginResult.data.accessToken,
            true // 회원가입 시 rememberMe 무조건 true
          );

          // 로그인 성공 - 사용자 정보 저장
          login(user);

          showModal({
            type: "snackbar",
            description: "회원가입이 완료되었습니다!",
          });
          router.push("/"); // 메인 페이지로 이동
        } else {
          // 로그인 실패 시 로그인 페이지로 이동
          showModal({
            type: "one-button",
            title: "회원가입이 완료되었습니다!",
            description: "로그인을 진행해주세요.",
            buttonText: "로그인",
            onConfirm: () => {
              router.push("/login");
            },
          });
        }
      }
    } catch (error: any) {
      console.error("회원가입 오류:", error);
      showModal({
        type: "snackbar",
        description: error.message || "회원가입 중 오류가 발생했습니다.",
      });
    }
  };

  // 폼 유효성 검사
  const formData = watch();
  const isFormValid =
    formData.agreeToTerms &&
    formData.agreeToPrivacy &&
    !Object.keys(errors).length;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
      {/* 이메일 섹션 */}
      <EmailSection
        register={register}
        errors={errors}
        watch={watch}
        trigger={trigger}
      />

      {/* 비밀번호 섹션 */}
      <PasswordSection register={register} errors={errors} watch={watch} />

      {/* 닉네임 섹션 */}
      <NicknameSection
        register={register}
        errors={errors}
        watch={watch}
        trigger={trigger}
      />

      {/* 약관 동의 섹션 */}
      <TermsSection
        register={register}
        errors={errors}
        watch={watch}
        setValue={setValue}
      />

      {/* 회원가입 버튼 */}
      <Button
        type="submit"
        disabled={!isFormValid || isSubmitting}
        className="w-full rounded-lg py-3 md:py-4"
        variant={isFormValid || !isSubmitting ? "point" : "secondary"}
      >
        {isSubmitting ? "처리 중..." : "회원가입"}
      </Button>
    </form>
  );
}
