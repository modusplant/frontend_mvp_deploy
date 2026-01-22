import RequestEmailForm from "@/components/auth/resetPassword/requestEmailForm";
import ResetPasswordForm from "@/components/auth/resetPassword/resetPasswordForm";

/**
 * 비밀번호 재설정 페이지
 * - UUID가 없으면: 이메일 요청 폼 표시
 * - UUID가 있으면: 비밀번호 재설정 폼 표시
 */
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ uuid?: string }>;
}) {
  const { uuid } = await searchParams;

  // UUID가 있으면 비밀번호 재설정 폼, 없으면 이메일 요청 폼
  if (uuid) {
    return <ResetPasswordForm uuid={uuid} />;
  }

  return <RequestEmailForm />;
}
