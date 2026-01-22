"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@/components/_common/button";
import { Input } from "@/components/_common/input";
import { useEmailVerification } from "@/lib/hooks/auth/useEmailVerification";
import { cn } from "@/lib/utils/tailwindHelper";
import { emailSchema, verificationCodeSchema } from "@/lib/constants/schema";
import { showModal } from "@/lib/store/modalStore";
import { memberApi } from "@/lib/api/client/member";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";

interface ChangeEmailModalProps {
  userId?: string;
  email: string;
  close?: () => void;
}

// 이메일 변경 폼 스키마 - 공통 스키마 재사용
const changeEmailSchema = z.object({
  newEmail: emailSchema,
  verificationCode: verificationCodeSchema,
});

type ChangeEmailFormValues = z.infer<typeof changeEmailSchema>;

export default function ChangeEmailModal({
  userId,
  email,
  close,
}: ChangeEmailModalProps) {
  const {
    register,
    watch,
    trigger,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(changeEmailSchema),
  });
  const router = useRouter();
  const { logout } = useAuthStore();
  const watchedNewEmail = watch("newEmail");

  const {
    isCodeSent,
    isVerified,
    canResend,
    timeRemaining,
    formattedTime,
    handleRequestVerification,
    handleResendVerification,
    handleVerifyCode,
  } = useEmailVerification({ trigger, watch });

  // 버튼 클릭 핸들러
  const handleButtonClick = async () => {
    if (!isCodeSent) {
      // 인증 코드 발송 - 유효성 검증 먼저 수행
      const isValid = await trigger("newEmail");
      if (!isValid) return;

      if (watchedNewEmail === email) {
        setError("newEmail", {
          type: "manual",
          message: "현재 이메일과 동일합니다.",
        });
        return;
      }

      await handleRequestVerification(watchedNewEmail);
      return;
    }

    // 재발송
    if (canResend && !isVerified) {
      await handleResendVerification(watchedNewEmail);
      return;
    }

    if (isCodeSent && !isVerified) {
      // 인증 코드 확인 - 유효성 검증 먼저 수행
      const isValid = await trigger("verificationCode");
      if (!isValid) return;

      await handleVerifyCode(watchedNewEmail);
      return;
    }

    if (isVerified) {
      // 이메일 변경 처리
      await memberApi.changeEmail(userId!, email, watchedNewEmail);
      close?.();
      showModal({
        type: "one-button",
        title: "이메일이 변경 되었습니다.",
        description: "변경된 이메일로 다시 로그인 해주세요.",
        buttonText: "로그인 하기",
        onConfirm: () => {
          router.push("/login");
          setTimeout(() => {
            logout();
          }, 1000);
        },
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-100/40"
      onClick={close}
    >
      {/* 모달 영역 */}
      <div
        className="min-h-[375px] w-[480px] rounded-[28px] bg-neutral-100 px-10 pb-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mt-8 text-center text-xl font-bold">이메일 변경</h2>
        <div className="mt-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-neutral-20">현재 이메일</p>
            <Input type="email" value={email} readOnly />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-neutral-20">새 이메일</p>
            <Input
              {...register("newEmail")}
              type="email"
              placeholder="새 이메일 주소를 입력해주세요."
              disabled={isVerified}
              className={cn(
                errors.newEmail && "border-system-alert",
                isVerified && "border-primary-50"
              )}
            />
            {errors.newEmail && (
              <p className="text-system-alert text-sm">
                {errors.newEmail.message}
              </p>
            )}
          </div>

          {isCodeSent && !isVerified && (
            <div className="flex flex-col gap-2">
              <p className="text-neutral-20">인증 코드</p>
              <Input
                {...register("verificationCode")}
                type="text"
                placeholder="인증 코드를 입력해주세요."
              />
              {timeRemaining > 0 && (
                <p className="text-neutral-60 text-sm">
                  요청 시간 {formattedTime}
                </p>
              )}
              {timeRemaining === 0 && (
                <p className="text-system-alert text-sm">
                  인증 요청 시간이 만료되었습니다. 인증 코드를 재발송해주세요.
                </p>
              )}
              {errors.verificationCode && (
                <p className="text-system-alert text-sm">
                  {errors.verificationCode.message}
                </p>
              )}
            </div>
          )}

          <Button
            variant="point"
            size="lg"
            className="mb-12 rounded-[10px]"
            onClick={handleButtonClick}
            disabled={isSubmitting}
          >
            {isVerified
              ? "이메일 변경하기"
              : canResend
                ? "인증 코드 재발송"
                : isCodeSent
                  ? "확인"
                  : "인증 코드 발송"}
          </Button>
        </div>
      </div>
    </div>
  );
}
