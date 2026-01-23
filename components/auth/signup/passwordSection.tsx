"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/tailwindHelper";
import { Input } from "@/components/_common/input";
import { PasswordSectionProps } from "@/lib/types/auth";
import { validatePassword } from "@/lib/utils/auth";

export default function PasswordSection({
  register,
  errors,
  watch,
  className,
}: PasswordSectionProps) {
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmError, setConfirmError] = useState<string>("");

  const password = watch?.("password") || "";
  const passwordConfirm = watch?.("passwordConfirm") || "";

  // 비밀번호 실시간 검증
  useEffect(() => {
    if (!password) {
      setPasswordError("");
      return;
    }

    const validation = validatePassword(password);
    if (!validation.isValid) {
      setPasswordError("올바르지 않은 비밀번호 입니다.");
    } else {
      setPasswordError("");
    }
  }, [password]);

  // 비밀번호 확인 실시간 검증
  useEffect(() => {
    if (!passwordConfirm) {
      setConfirmError("");
      return;
    }

    if (password !== passwordConfirm) {
      setConfirmError("비밀번호가 서로 일치하지 않습니다");
    } else {
      setConfirmError("");
    }
  }, [password, passwordConfirm]);

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-neutral-20 block text-sm font-medium">
        비밀번호
      </label>

      <div className="space-y-3">
        {/* 비밀번호 입력 */}
        <div>
          <Input
            {...register("password")}
            type="password"
            placeholder="비밀번호를 입력해주세요"
            showPasswordToggle
            className={cn(
              "w-full",
              (errors.password || passwordError) && "border-system-alert"
            )}
          />

          {passwordError && !errors.password && (
            <p className="text-system-alert mt-1 text-sm">{passwordError}</p>
          )}
          {errors.password && (
            <p className="text-system-alert mt-1 text-sm">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* 비밀번호 확인 입력 */}
        <div>
          <Input
            {...register("passwordConfirm")}
            type="password"
            placeholder="비밀번호를 다시 한번 입력해주세요"
            showPasswordToggle
            className={cn(
              "w-full",
              (errors.passwordConfirm || confirmError) && "border-system-alert"
            )}
          />
          {confirmError && !errors.passwordConfirm && (
            <p className="text-system-alert mt-1 text-sm">{confirmError}</p>
          )}
          {errors.passwordConfirm && (
            <p className="text-system-alert mt-1 text-sm">
              {errors.passwordConfirm.message}
            </p>
          )}
        </div>

        <p className="text-neutral-60 mt-1 text-sm">
          영문 대소문자, 숫자, 특수문자를 포함한 8자 이상의 비밀번호로
          입력해주세요.
        </p>
      </div>
    </div>
  );
}
