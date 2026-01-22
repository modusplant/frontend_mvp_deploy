import { AuthProvider } from "@/lib/types/member";

/**
 * 소셜 로그인 정보 섹션
 * - 소셜 로그인 사용자에게 표시되는 안내 메시지
 */
export default function SocialLoginInfo({
  authProvider,
}: {
  authProvider: AuthProvider;
}) {
  const providerName = {
    BASIC: "기본",
    Google: "구글",
    Kakao: "카카오",
    Naver: "네이버",
  }[authProvider];

  return (
    <div className="flex flex-col gap-6">
      <div className="border-surface-98 flex flex-col gap-[30px] rounded-xl border bg-white p-10">
        <div className="border-surface-stroke bg-surface-99 rounded-lg border p-6">
          <p className="text-neutral-60 text-sm leading-normal">
            {providerName} 간편 로그인으로 가입하셨습니다.
            <br />
            이메일과 비밀번호는 해당 서비스에서 관리됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
