"use client";

import { Input } from "@/components/_common/input";
import { useRouter } from "next/navigation";
import Button from "@/components/_common/button";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "@/lib/api/client/auth";
import { ApiError } from "@/lib/types/common";
import { showModal } from "@/lib/store/modalStore";
import {
  newPasswordSchema,
  NewPasswordFormValues,
} from "@/lib/constants/schema";
import { cn } from "@/lib/utils/tailwindHelper";

interface ResetPasswordFormProps {
  uuid: string;
}

/**
 * 비밀번호 재설정 폼
 * - 이메일 링크를 통해 받은 UUID로 새 비밀번호를 설정합니다
 */
export default function ResetPasswordForm({ uuid }: ResetPasswordFormProps) {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isValidUuid, setIsValidUuid] = useState<number>(-1);

  useEffect(() => {
    const verifyUuid = async () => {
      const result = await authApi.verifyPasswordResetEmail(uuid);
      setIsValidUuid(result.status);
    };
    verifyUuid();
  }, [uuid]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
  });

  const onSubmit = async (data: NewPasswordFormValues) => {
    try {
      setApiError(null);
      await authApi.resetPassword(data.password);

      showModal({
        type: "one-button",
        title: "비밀번호가 변경되었습니다.",
        description: "아래 버튼을 누르면 로그인 페이지로 이동합니다.",
        buttonText: "로그인 하기",
        onConfirm: async () => {
          router.push("/login");
        },
      });
    } catch (err) {
      const error = err as ApiError;
      setApiError(
        error.message || "비밀번호 변경에 실패했습니다. 다시 시도해주세요."
      );
    }
  };

  if (isValidUuid !== 200) {
    return (
      <div className="mx-auto w-[480px] p-10 text-center">
        <h1 className="mb-6 text-2xl font-bold">비밀번호 재설정</h1>
        <p className="text-neutral-20">
          유효하지 않은 링크입니다. <br />
          비밀번호 재설정 요청을 다시 시도해주세요.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-[520px] space-y-10 p-10"
    >
      {/* 페이지 제목 */}
      <h1 className="text-center text-2xl font-bold">비밀번호 재설정</h1>

      <div className="space-y-2">
        {/* 비밀번호 입력 */}
        <p>새 비밀번호</p>
        <Input
          {...register("password")}
          type="password"
          placeholder="새 비밀번호를 입력해주세요."
          showPasswordToggle
          className={cn("w-full", errors.password && "border-system-alert")}
        />
        {errors.password && (
          <p className="text-system-alert mt-1 text-sm">
            {errors.password.message}
          </p>
        )}

        {/* 비밀번호 확인 입력 */}
        <Input
          {...register("passwordConfirm")}
          type="password"
          placeholder="새 비밀번호를 다시 한번 입력해주세요."
          showPasswordToggle
          className={cn(
            "w-full",
            errors.passwordConfirm && "border-system-alert"
          )}
        />
        {errors.passwordConfirm && (
          <p className="text-system-alert mt-1 text-sm">
            {errors.passwordConfirm.message}
          </p>
        )}

        {/* 비밀번호 안내 문구 */}
        {!errors.password && !errors.passwordConfirm && (
          <p className="text-neutral-60 text-xs">
            영문 대소문자, 숫자, 특수문자를 포함한 8자 이상의 비밀번호로
            입력해주세요.
          </p>
        )}

        {/* API 에러 메시지 */}
        {apiError && (
          <div className="text-system-alert text-center text-sm">
            {apiError}
          </div>
        )}
      </div>

      <Button
        type="submit"
        variant="point"
        size="lg"
        className="rounded-lg"
        disabled={isSubmitting}
        fullWidth
      >
        {isSubmitting ? "처리 중..." : "재설정"}
      </Button>
    </form>
  );
}
