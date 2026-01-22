"use client";

import { useState, useCallback, useMemo } from "react";

export interface TermsAgreementState {
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  agreeToMarketing: boolean;
}

export interface TermsContentState {
  showTermsContent: boolean;
  showPrivacyContent: boolean;
  showCommunityContent: boolean;
  showMarketingContent: boolean;
}

export interface UseTermsAgreementOptions {
  /** 초기 동의 상태 */
  initialAgreement?: Partial<TermsAgreementState>;
  /** 초기 내용 표시 상태 */
  initialContentState?: Partial<TermsContentState>;
}

/**
 * 약관 동의 상태와 내용 표시를 관리하는 훅
 */
export const useTermsAgreement = ({
  initialAgreement = {},
  initialContentState = {},
}: UseTermsAgreementOptions = {}) => {
  // 동의 상태
  const [agreementState, setAgreementState] = useState<TermsAgreementState>({
    agreeToTerms: false,
    agreeToPrivacy: false,
    agreeToMarketing: false,
    ...initialAgreement,
  });

  // 내용 표시 상태
  const [contentState, setContentState] = useState<TermsContentState>({
    showTermsContent: false,
    showPrivacyContent: false,
    showCommunityContent: false,
    showMarketingContent: false,
    ...initialContentState,
  });

  // 필수 약관 모두 동의 여부
  const allRequiredAgreed = useMemo(() => {
    return agreementState.agreeToTerms && agreementState.agreeToPrivacy;
  }, [agreementState.agreeToTerms, agreementState.agreeToPrivacy]);

  // 모든 약관 동의 여부 (선택 포함)
  const allAgreed = useMemo(() => {
    return (
      agreementState.agreeToTerms &&
      agreementState.agreeToPrivacy &&
      agreementState.agreeToMarketing
    );
  }, [
    agreementState.agreeToTerms,
    agreementState.agreeToPrivacy,
    agreementState.agreeToMarketing,
  ]);

  // 개별 동의 상태 변경
  const setAgreement = useCallback(
    (field: keyof TermsAgreementState, value: boolean) => {
      setAgreementState((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  // 전체 동의 토글 (필수 약관들을 일괄 처리)
  const toggleAllAgreements = useCallback(() => {
    const newValue = !allRequiredAgreed;
    setAgreementState((prev) => ({
      ...prev,
      agreeToTerms: newValue,
      agreeToPrivacy: newValue,
      agreeToMarketing: newValue,
    }));
  }, [allRequiredAgreed]);

  // 필수 약관만 일괄 동의
  const toggleRequiredAgreements = useCallback(() => {
    const newValue = !allRequiredAgreed;
    setAgreementState((prev) => ({
      ...prev,
      agreeToTerms: newValue,
      agreeToPrivacy: newValue,
    }));
  }, [allRequiredAgreed]);

  // 약관 내용 표시 토글
  const toggleContent = useCallback((field: keyof TermsContentState) => {
    setContentState((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  }, []);

  // 모든 약관 내용 숨김
  const hideAllContent = useCallback(() => {
    setContentState({
      showTermsContent: false,
      showPrivacyContent: false,
      showCommunityContent: false,
      showMarketingContent: false,
    });
  }, []);

  // 상태 초기화
  const resetAgreements = useCallback(() => {
    setAgreementState({
      agreeToTerms: false,
      agreeToPrivacy: false,
      agreeToMarketing: false,
    });
    hideAllContent();
  }, [hideAllContent]);

  // React Hook Form 통합을 위한 헬퍼
  const getFieldProps = useCallback(
    (field: keyof TermsAgreementState) => ({
      checked: agreementState[field],
      onChange: (value: boolean) => setAgreement(field, value),
    }),
    [agreementState, setAgreement]
  );

  return {
    // 상태
    agreementState,
    contentState,

    // 계산된 값
    allRequiredAgreed,
    allAgreed,

    // 동의 관련 함수
    setAgreement,
    toggleAllAgreements,
    toggleRequiredAgreements,
    resetAgreements,

    // 내용 표시 관련 함수
    toggleContent,
    hideAllContent,

    // 편의 속성들
    agreeToTerms: agreementState.agreeToTerms,
    agreeToPrivacy: agreementState.agreeToPrivacy,
    agreeToMarketing: agreementState.agreeToMarketing,

    showTermsContent: contentState.showTermsContent,
    showPrivacyContent: contentState.showPrivacyContent,
    showMarketingContent: contentState.showMarketingContent,

    // React Hook Form 통합
    getFieldProps,

    // 폼 검증용
    isValidForSubmit: allRequiredAgreed,
  };
};
