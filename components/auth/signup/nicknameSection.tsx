"use client";

import { cn } from "@/lib/utils/tailwindHelper";
import { useNicknameVerification } from "@/lib/hooks/auth/useNicknameVerification";
import { authApi } from "@/lib/api/auth";
import { Input } from "@/components/_common/input";
import Button from "@/components/_common/button";
import { NicknameSectionProps } from "@/lib/types/auth";

export default function NicknameSection({
  register,
  trigger,
  watch,
  errors,
  className,
}: NicknameSectionProps) {
  const watchedNickname = watch("nickname");

  const {
    isChecked,
    isAvailable,
    message,
    isLoading,
    checkNickname,
    resetVerification,
  } = useNicknameVerification({
    onCheckNickname: authApi.checkNickname,
  });

  // 닉네임 중복 확인 핸들러
  const handleCheckNickname = async () => {
    const nicknameValid = await trigger("nickname");
    if (!nicknameValid) return;

    const result = await checkNickname(watchedNickname);
    window.alert(result.message);
  };

  // 닉네임 변경 핸들러
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    register("nickname").onChange(e);
    // 닉네임 변경 시 검증 상태 초기화
    resetVerification();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-neutral-20 block text-sm font-medium">
        닉네임
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <Input
            {...register("nickname")}
            type="text"
            placeholder="닉네임을 입력해주세요"
            className={cn(
              "w-full",
              errors.nickname && "border-system-alert",
              isChecked && !isAvailable && "border-system-alert"
            )}
            onChange={handleNicknameChange}
          />
        </div>
        <Button
          type="button"
          onClick={handleCheckNickname}
          disabled={!watchedNickname || !!errors.nickname || isLoading}
          className="w-full min-w-[92px] cursor-pointer px-5 py-3 text-sm sm:w-auto"
          variant="secondary"
        >
          {isLoading ? "확인중..." : "중복확인"}
        </Button>
      </div>

      {/* 닉네임 에러 메시지 */}
      {errors.nickname && (
        <p className="text-system-alert text-sm">{errors.nickname.message}</p>
      )}
      {isChecked && !isAvailable && (
        <p className="text-system-alert text-sm">{message}</p>
      )}
      {isChecked && isAvailable && (
        <p className="text-primary-50 text-sm">{message}</p>
      )}
    </div>
  );
}
