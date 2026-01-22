"use client";

import { useTermsAgreement } from "@/lib/hooks/auth/useTermsAgreement";
import { Checkbox } from "@/components/_common/checkbox";
import { TERMS_MAP, TERMS_LABELS } from "@/lib/constants/terms";
import { TermsSectionProps } from "@/lib/types/auth";

export default function TermsSection({
  register,
  errors,
  watch,
  setValue,
}: TermsSectionProps) {
  const { contentState, toggleContent } = useTermsAgreement();

  // 현재 폼의 동의 상태 확인
  const agreementValues = {
    agreeToTerms: watch("agreeToTerms"),
    agreeToPrivacy: watch("agreeToPrivacy"),
    agreeToCommunity: watch("agreeToCommunity"),
  };

  // 모든 필수 약관 동의 상태
  const allTermsAgreed =
    agreementValues.agreeToTerms &&
    agreementValues.agreeToPrivacy &&
    agreementValues.agreeToCommunity;

  const handleAllAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setValue("agreeToTerms", checked);
    setValue("agreeToPrivacy", checked);
    setValue("agreeToCommunity", checked);
  };

  return (
    <div className="space-y-3">
      {/* 전체 동의 */}
      <div className="flex items-center gap-2">
        <Checkbox
          checked={allTermsAgreed}
          onChange={handleAllAgreementChange}
          id="agreeToAll"
        />
        <span className="text-neutral-20 text-sm font-semibold">
          {TERMS_LABELS.all}
        </span>
      </div>

      {/* 구분선 */}
      <div className="bg-neutral-90 h-px"></div>

      {/* 개별 약관들 */}
      <div className="space-y-3">
        {/* 이용약관 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                {...register("agreeToTerms")}
                id="agreeToTerms"
                checked={agreementValues.agreeToTerms || false}
              />
              <span className="text-neutral-60 text-sm">
                {TERMS_LABELS.terms}
              </span>
            </div>
            <button
              type="button"
              onClick={() => toggleContent("showTermsContent")}
              className="text-neutral-60 cursor-pointer text-sm underline"
            >
              {contentState.showTermsContent ? "접기" : "보기"}
            </button>
          </div>
          {contentState.showTermsContent && (
            <div className="bg-neutral-98 text-neutral-60 ml-6 rounded-md p-3 text-sm leading-relaxed">
              <p className="mb-2 font-medium">{TERMS_MAP.terms.title}</p>
              <ul className="space-y-1 text-xs md:text-sm">
                {TERMS_MAP.terms.items.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 개인정보 처리방침 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                {...register("agreeToPrivacy")}
                id="agreeToPrivacy"
                checked={agreementValues.agreeToPrivacy || false}
              />
              <span className="text-neutral-60 text-sm">
                {TERMS_LABELS.privacy}
              </span>
            </div>
            <button
              type="button"
              onClick={() => toggleContent("showPrivacyContent")}
              className="text-neutral-60 cursor-pointer text-sm underline"
            >
              {contentState.showPrivacyContent ? "접기" : "보기"}
            </button>
          </div>
          {contentState.showPrivacyContent && (
            <div className="bg-neutral-98 text-neutral-60 ml-6 rounded-md p-3 text-sm leading-relaxed">
              <p className="mb-2 font-medium">{TERMS_MAP.privacy.title}</p>
              <ul className="space-y-1 text-xs md:text-sm">
                {TERMS_MAP.privacy.items.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 커뮤니티 운영정책 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                {...register("agreeToCommunity")}
                id="agreeToCommunity"
                checked={agreementValues.agreeToCommunity || false}
              />
              <span className="text-neutral-60 text-sm">
                {TERMS_LABELS.community}
              </span>
            </div>
            <button
              type="button"
              onClick={() => toggleContent("showCommunityContent")}
              className="text-neutral-60 cursor-pointer text-sm underline"
            >
              {contentState.showCommunityContent ? "접기" : "보기"}
            </button>
          </div>
          {contentState.showCommunityContent && (
            <div className="bg-neutral-98 text-neutral-60 ml-6 rounded-md p-3 text-sm leading-relaxed">
              <p className="mb-2 font-medium">{TERMS_MAP.community.title}</p>
              <ul className="space-y-1 text-xs md:text-sm">
                {TERMS_MAP.community.items.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 에러 메시지 */}
      {(errors.agreeToTerms ||
        errors.agreeToPrivacy ||
        errors.agreeToCommunity) && (
        <p className="text-system-alert mt-2 text-sm">
          필수 약관에 동의해주세요.
        </p>
      )}
    </div>
  );
}
