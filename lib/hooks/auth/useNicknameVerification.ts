"use client";

import { useState, useCallback } from "react";
import { NicknameVerificationState } from "@/lib/types/auth";
import { authApi } from "@/lib/api/client/auth";

export const useNicknameVerification = () => {
  const [verificationState, setVerificationState] =
    useState<NicknameVerificationState>({
      isChecked: false,
      isAvailable: false,
      message: "",
    });

  const [isLoading, setIsLoading] = useState(false);

  // 닉네임 중복 확인
  const checkNickname = useCallback(async (nickname: string) => {
    if (!nickname.trim()) {
      return { success: false, message: "닉네임을 입력해주세요." };
    }

    setIsLoading(true);

    try {
      const res = await authApi.checkNickname(nickname);
      setVerificationState({
        isChecked: true,
        isAvailable: res.available,
        message: res.message,
      });

      return res;
    } catch (error) {
      const errorMessage = "닉네임 확인에 실패했습니다.";

      setVerificationState({
        isChecked: false,
        isAvailable: false,
        message: errorMessage,
      });

      return { success: false, available: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 닉네임 변경 시 상태 초기화
  const resetVerification = useCallback(() => {
    setVerificationState({
      isChecked: false,
      isAvailable: false,
      message: "",
    });
  }, []);

  return {
    verificationState,
    isLoading,
    checkNickname,
    resetVerification,
    // 편의 속성들
    isChecked: verificationState.isChecked,
    isAvailable: verificationState.isAvailable,
    message: verificationState.message,
    isValid: verificationState.isChecked && verificationState.isAvailable,
  };
};
