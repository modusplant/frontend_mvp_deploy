"use client";

import { useAuthStore } from "@/lib/store/authStore";
import { useMemberAuthInfo } from "@/lib/hooks/mypage/useMemberAuthInfo";
import EmailInfoSection from "./emailInfoSection";
import PasswordSection from "./passwordSection";
import SocialLoginInfo from "./socialLoginInfo";
import ChangeEmailModal from "./changeEmailModal";
import { useState } from "react";

/**
 * 계정 설정 섹션
 * - 이메일 정보 (일반 로그인만 표시)
 * - 비밀번호 변경
 * - 가입일 (읽기 전용)
 */
export default function AccountSection() {
  const { user } = useAuthStore();
  const [emailModalVisible, setEmailModalVisible] = useState(false);

  const { data: authInfo, isLoading, error } = useMemberAuthInfo(user?.id);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-neutral-60">로딩 중...</p>
      </div>
    );
  }

  if (error || !authInfo) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-system-alert">계정 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const isBasicAuth = authInfo.authProvider === "BASIC";

  if (isBasicAuth) {
    return (
      <div className="flex flex-col gap-6">
        {emailModalVisible && (
          <ChangeEmailModal
            userId={user!.id}
            email={user?.email || authInfo.email}
            close={() => setEmailModalVisible(false)}
          />
        )}
        <EmailInfoSection
          email={user?.email || authInfo.email}
          createdAt={authInfo.createdAt}
          onChangeEmail={() => setEmailModalVisible(true)}
        />
        <PasswordSection />
      </div>
    );
  }

  return <SocialLoginInfo authProvider={authInfo.authProvider} />;
}
