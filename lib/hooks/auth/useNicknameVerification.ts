"use client";

import { useState, useCallback } from "react";
import { NicknameVerificationState } from "@/lib/types/auth";

export interface UseNicknameVerificationProps {
  /** 닉네임 중복 확인 API 함수 (실제 구현 시 사용) */
  onCheckNickname?: (
    nickname: string
  ) => Promise<{ success: boolean; available: boolean; message: string }>;
  /** 중복으로 처리할 닉네임 목록 (모킹용) */
  unavailableNicknames?: string[];
}

export const useNicknameVerification = ({
  onCheckNickname,
  unavailableNicknames = ["admin", "test", "모두의식물"],
}: UseNicknameVerificationProps = {}) => {
  const [verificationState, setVerificationState] =
    useState<NicknameVerificationState>({
      isChecked: false,
      isAvailable: false,
      message: "",
    });

  const [isLoading, setIsLoading] = useState(false);

  // 닉네임 중복 확인
  const checkNickname = useCallback(
    async (nickname: string) => {
      if (!nickname.trim()) {
        return { success: false, message: "닉네임을 입력해주세요." };
      }

      setIsLoading(true);

      try {
        let response;

        if (onCheckNickname) {
          response = await onCheckNickname(nickname);
        } else {
          // 모킹 응답
          const isUnavailable = unavailableNicknames.includes(
            nickname.toLowerCase()
          );
          response = {
            success: true,
            available: !isUnavailable,
            message: isUnavailable
              ? "사용 중인 닉네임입니다."
              : "사용 가능한 닉네임입니다.",
          };
        }

        setVerificationState({
          isChecked: true,
          isAvailable: response.available,
          message: response.message,
        });

        return {
          success: response.success,
          available: response.available,
          message: response.message,
        };
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
    },
    [onCheckNickname, unavailableNicknames]
  );

  // 닉네임 변경 시 상태 초기화
  const resetVerification = useCallback(() => {
    setVerificationState({
      isChecked: false,
      isAvailable: false,
      message: "",
    });
  }, []);

  // 특정 상태로 설정 (테스트용)
  const setVerificationState_UNSAFE = useCallback(
    (state: Partial<NicknameVerificationState>) => {
      setVerificationState((prev) => ({ ...prev, ...state }));
    },
    []
  );

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
    // 개발/테스트용
    setVerificationState_UNSAFE,
  };
};
