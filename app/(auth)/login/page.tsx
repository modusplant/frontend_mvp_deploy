import Link from "next/link";
import Image from "next/image";
import LoginForm from "@/components/auth/loginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 md:p-6">
      {/* 로그인 카드 */}
      <div className="border-surface-stroke w-full max-w-[480px] rounded-[20px] border bg-white/70 p-8 shadow-lg backdrop-blur-sm md:rounded-[28px] md:p-12">
        {/* 로고 영역 */}
        <div className="mb-8 flex flex-col items-center gap-1 md:mb-10">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <Image
              src="/logo_favicon/Logo_green.svg"
              alt="모두의식물"
              width={117}
              height={26}
              className="h-6 w-auto md:h-7"
            />
          </Link>
        </div>

        {/* 로그인 폼 */}
        <LoginForm />
      </div>
    </div>
  );
}
