"use client";
import { cn } from "@/lib/utils/tailwindHelper";
import { useEmailVerification } from "@/lib/hooks/auth/useEmailVerification";
import { Input } from "@/components/_common/input";
import Button from "@/components/_common/button";
import { EmailSectionProps } from "@/lib/types/auth";

export default function EmailSection({
  register,
  trigger,
  watch,
  errors,
  className,
}: EmailSectionProps) {
  const watchedEmail = watch("email");

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

  const emailDisabled =
    !watchedEmail || !!errors.email || (isCodeSent && !canResend) || isVerified;

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-neutral-20 block text-sm font-medium">
        이메일
      </label>

      {/* 이메일 입력 + 인증요청 버튼 */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <Input
            {...register("email")}
            type="email"
            placeholder="이메일을 입력해주세요"
            disabled={isVerified}
            className={cn(
              "w-full",
              errors.email && "border-system-alert",
              isVerified && "border-primary-50"
            )}
          />
        </div>
        <Button
          type="button"
          onClick={() =>
            canResend
              ? handleResendVerification(watchedEmail)
              : handleRequestVerification(watchedEmail)
          }
          disabled={emailDisabled}
          className="w-full min-w-[92px] cursor-pointer rounded-lg px-5 py-3 text-sm sm:w-auto"
          variant={!emailDisabled ? "point" : "secondary"}
        >
          {canResend ? "재요청" : "인증요청"}
        </Button>
      </div>

      {/* 이메일 에러 메시지 */}
      {errors.email && (
        <p className="text-system-alert text-sm">{errors.email.message}</p>
      )}

      {/* 인증코드 입력 */}
      {isCodeSent && !isVerified && (
        <div className="space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex-1">
              <Input
                {...register("verificationCode")}
                type="text"
                placeholder="인증코드를 입력해주세요"
                className="w-full"
              />
            </div>
            <Button
              type="button"
              onClick={() => handleVerifyCode(watchedEmail)}
              disabled={!watch("verificationCode")}
              className="w-full min-w-[92px] rounded-lg px-5 py-3 text-sm sm:w-auto"
              variant={watch("verificationCode") ? "point" : "secondary"}
            >
              확인
            </Button>
          </div>

          {/* 카운트다운 */}
          {timeRemaining > 0 && (
            <p className="text-neutral-60 text-sm">요청 시간 {formattedTime}</p>
          )}

          {/* 인증코드 에러 메시지 */}
          {errors.verificationCode && (
            <p className="text-system-alert text-sm">
              {errors.verificationCode.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
