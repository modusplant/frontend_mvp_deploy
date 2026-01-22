"use client";

import { useState, useCallback } from "react";

export interface UsePasswordVisibilityOptions {
  /** 초기 표시 상태 */
  initialVisible?: boolean;
}

/**
 * 비밀번호 입력 필드의 가시성을 관리하는 훅
 */
export const usePasswordVisibility = ({
  initialVisible = false,
}: UsePasswordVisibilityOptions = {}) => {
  const [isVisible, setIsVisible] = useState(initialVisible);

  // 가시성 토글
  const toggle = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  // 가시성 설정
  const show = useCallback(() => {
    setIsVisible(true);
  }, []);

  // 가시성 해제
  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  // 조건부 가시성 설정
  const setVisible = useCallback((visible: boolean) => {
    setIsVisible(visible);
  }, []);

  return {
    isVisible,
    toggle,
    show,
    hide,
    setVisible,
    // 편의 속성들
    type: isVisible ? "text" : "password",
    icon: isVisible ? "EyeOff" : "Eye",
    ariaLabel: isVisible ? "비밀번호 숨김" : "비밀번호 보기",
  };
};

/**
 * 여러 비밀번호 필드를 관리하는 훅
 */
export const useMultiplePasswordVisibility = (fieldNames: string[]) => {
  const [visibilityStates, setVisibilityStates] = useState<
    Record<string, boolean>
  >(fieldNames.reduce((acc, field) => ({ ...acc, [field]: false }), {}));

  // 특정 필드 가시성 토글
  const toggle = useCallback((fieldName: string) => {
    setVisibilityStates((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  }, []);

  // 특정 필드 가시성 설정
  const setVisible = useCallback((fieldName: string, visible: boolean) => {
    setVisibilityStates((prev) => ({
      ...prev,
      [fieldName]: visible,
    }));
  }, []);

  // 모든 필드 가시성 설정
  const setAllVisible = useCallback((visible: boolean) => {
    setVisibilityStates((prev) =>
      Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: visible }), {})
    );
  }, []);

  // 특정 필드의 상태 반환
  const getFieldState = useCallback(
    (fieldName: string) => {
      const isVisible = visibilityStates[fieldName] || false;
      return {
        isVisible,
        type: isVisible ? "text" : "password",
        icon: isVisible ? "EyeOff" : "Eye",
        ariaLabel: isVisible ? "비밀번호 숨김" : "비밀번호 보기",
        toggle: () => toggle(fieldName),
      };
    },
    [visibilityStates, toggle]
  );

  return {
    visibilityStates,
    toggle,
    setVisible,
    setAllVisible,
    getFieldState,
    // 편의 함수들
    isVisible: (fieldName: string) => visibilityStates[fieldName] || false,
    areAllVisible: Object.values(visibilityStates).every(Boolean),
    areAnyVisible: Object.values(visibilityStates).some(Boolean),
  };
};
