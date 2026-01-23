"use client";

import { useState, useEffect, useCallback } from "react";
import { EmailVerificationState } from "@/lib/types/auth";

export interface UseEmailVerificationProps {
  /** 인증 요청 API 함수 (실제 구현 시 사용) */
  onRequestVerification?: (
    email: string
  ) => Promise<{ success: boolean; expiresIn?: number }>;
  /** 인증 코드 확인 API 함수 (실제 구현 시 사용) */
  onVerifyCode?: (email: string, code: string) => Promise<{ success: boolean }>;
  /** 기본 만료 시간 (초) */
  defaultExpiresIn?: number;
}

export const useEmailVerification = ({
  onRequestVerification,
  onVerifyCode,
  defaultExpiresIn = 180,
}: UseEmailVerificationProps = {}) => {
  const [verificationState, setVerificationState] =
    useState<EmailVerificationState>({
      isCodeSent: false,
      isVerified: false,
      timeRemaining: 0,
      canResend: false,
    });

  // 카운트다운 타이머
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (verificationState.timeRemaining > 0) {
      timer = setTimeout(() => {
        setVerificationState((prev) => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }));
      }, 1000);
    } else if (
      verificationState.isCodeSent &&
      verificationState.timeRemaining === 0
    ) {
      setVerificationState((prev) => ({
        ...prev,
        canResend: true,
      }));
    }

    return () => clearTimeout(timer);
  }, [verificationState.timeRemaining, verificationState.isCodeSent]);

  // 인증 요청
  const requestVerification = useCallback(
    async (email: string) => {
      try {
        let response;

        if (onRequestVerification) {
          response = await onRequestVerification(email);
        } else {
          // 모킹 응답
          response = { success: true, expiresIn: defaultExpiresIn };
        }

        if (response.success) {
          setVerificationState({
            isCodeSent: true,
            isVerified: false,
            timeRemaining: response.expiresIn || defaultExpiresIn,
            canResend: false,
          });
          return { success: true, message: "인증코드가 발송되었습니다." };
        } else {
          return { success: false, message: "인증코드 발송에 실패했습니다." };
        }
      } catch (error) {
        return {
          success: false,
          message: "인증코드 발송에 실패했습니다. 다시 시도해주세요.",
        };
      }
    },
    [onRequestVerification, defaultExpiresIn]
  );

  // 재요청
  const resendVerification = useCallback(
    async (email: string) => {
      try {
        let response;

        if (onRequestVerification) {
          response = await onRequestVerification(email);
        } else {
          // 모킹 응답
          response = { success: true, expiresIn: defaultExpiresIn };
        }

        if (response.success) {
          setVerificationState({
            isCodeSent: true,
            isVerified: false,
            timeRemaining: response.expiresIn || defaultExpiresIn,
            canResend: false,
          });
          return { success: true, message: "인증코드가 재발송되었습니다." };
        } else {
          return { success: false, message: "인증코드 재발송에 실패했습니다." };
        }
      } catch (error) {
        return { success: false, message: "인증코드 재발송에 실패했습니다." };
      }
    },
    [onRequestVerification, defaultExpiresIn]
  );

  // 인증코드 확인
  const verifyCode = useCallback(
    async (email: string, code: string) => {
      // 시간 만료 체크
      if (
        verificationState.isCodeSent &&
        verificationState.timeRemaining === 0
      ) {
        return {
          success: false,
          message: "인증 시간이 만료되었습니다. 인증코드를 재발송해주세요.",
        };
      }

      try {
        let response;

        if (onVerifyCode) {
          response = await onVerifyCode(email, code);
        } else {
          // 모킹 응답 (인증코드가 "123456"인 경우만 성공)
          response = { success: code === "123456" };
        }

        if (response.success) {
          setVerificationState((prev) => ({
            ...prev,
            isVerified: true,
            timeRemaining: 0,
          }));
          return { success: true, message: "이메일 인증이 완료되었습니다." };
        } else {
          return { success: false, message: "인증코드가 일치하지 않습니다." };
        }
      } catch (error) {
        return { success: false, message: "인증 확인에 실패했습니다." };
      }
    },
    [
      onVerifyCode,
      verificationState.isCodeSent,
      verificationState.timeRemaining,
    ]
  );

  // 상태 초기화
  const resetVerification = useCallback(() => {
    setVerificationState({
      isCodeSent: false,
      isVerified: false,
      timeRemaining: 0,
      canResend: false,
    });
  }, []);

  // 시간 포매팅 유틸리티
  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  return {
    verificationState,
    requestVerification,
    resendVerification,
    verifyCode,
    resetVerification,
    formatTime,
    // 편의 속성들
    isCodeSent: verificationState.isCodeSent,
    isVerified: verificationState.isVerified,
    canResend: verificationState.canResend,
    timeRemaining: verificationState.timeRemaining,
    formattedTime: formatTime(verificationState.timeRemaining),
  };
};
